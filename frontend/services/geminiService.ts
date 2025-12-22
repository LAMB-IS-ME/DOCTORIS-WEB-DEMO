import { MedicalData, SearchType } from "../types";

// Read environment variables (Vite exposes only variables prefixed with VITE_)
const USE_N8N_RAG = (import.meta.env.VITE_USE_N8N_RAG ?? "true") === "true";
const N8N_WEBHOOK_URL =
  (import.meta.env.VITE_N8N_WEBHOOK_URL as string) ||
  "http://localhost:5678/webhook/doctoris-chat";
const N8N_API_KEY = (import.meta.env.VITE_N8N_API_KEY as string) || "";

/**
 * Parse raw output - Giữ nguyên văn như tài liệu gốc, chỉ extract references
 */
function parseOutputToSections(
  text: string,
  searchType: SearchType
): MedicalData {
  const titleMap: Record<SearchType, string> = {
    [SearchType.SYMPTOM]: "Kết quả tra cứu Triệu chứng",
    [SearchType.DISEASE]: "Thông tin Bệnh lý",
    [SearchType.DRUG]: "Thông tin Thuốc",
    [SearchType.PATIENT]: "Thông tin Bệnh nhân",
  };

  const categoryMap: Record<SearchType, string> = {
    [SearchType.SYMPTOM]: "Triệu chứng",
    [SearchType.DISEASE]: "Bệnh lý",
    [SearchType.DRUG]: "Dược phẩm",
    [SearchType.PATIENT]: "Bệnh nhân",
  };

  // Extract references từ text (các pattern phổ biến)
  const references: Array<{ title: string; url: string }> = [];
  
  // Pattern 1: [text](url)
  const markdownLinks = text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
  for (const match of markdownLinks) {
    references.push({ title: match[1], url: match[2] });
  }
  
  // Pattern 2: Source: URL hoặc Nguồn: URL
  const sourcePattern = /(?:Source|Nguồn|Tài liệu tham khảo):\s*(.+?)(?:\n|$)/gi;
  const sourceMatches = text.matchAll(sourcePattern);
  for (const match of sourceMatches) {
    const sourceText = match[1].trim();
    // Nếu có URL
    const urlMatch = sourceText.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      references.push({
        title: sourceText.replace(urlMatch[0], '').trim() || 'Tài liệu tham khảo',
        url: urlMatch[0]
      });
    }
  }

  // Tạo summary ngắn (3 dòng đầu)
  const lines = text.split('\n').filter(l => l.trim());
  const summary = lines.slice(0, 3).join(' ').slice(0, 300) + '...';

  // GIỮ NGUYÊN VĂN - Không tách sections phức tạp
  return {
    title: titleMap[searchType] || "Kết quả tra cứu",
    category: categoryMap[searchType] || "Tài liệu y khoa",
    summary: summary,
    sections: [
      {
        heading: "Nội dung",
        content: text.trim(),
      },
    ],
    warnings: [], // Không tự động detect warnings
    references: references.length > 0 ? references : undefined,
  };
}

export const fetchMedicalInfo = async (
  query: string,
  searchType: SearchType,
  imageBase64?: string
): Promise<MedicalData> => {
  try {
    if (!USE_N8N_RAG) {
      // Gemini fallback chưa được triển khai trong bản web demo này
      // (tránh gọi mạng khi thiếu khóa và để minh bạch cấu hình)
      throw new Error(
        "Chế độ n8n đang tắt (USE_N8N_RAG=false) và Gemini chưa được cấu hình. Vui lòng bật USE_N8N_RAG hoặc cấu hình Gemini."
      );
    }

    // Build headers, optionally attach Authorization if key is provided
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (N8N_API_KEY) headers["Authorization"] = `Bearer ${N8N_API_KEY}`;

    // Align payload field names with n8n workflow
    // Send flat payload: n8n Webhook receives it as $json.body in the workflow
    // AI Agent can then use {{$json.body.message}} and Chat Memory {{$json.body.sessionId}}
    const bodyPayload: Record<string, unknown> = {
      message: query,
      sessionId: "web-demo", // sau này thay bằng userId
      searchType,
      ...(imageBase64 ? { imageBase64 } : {}),
    };

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyPayload),
    });

    if (!res.ok) {
      throw new Error("Không gọi được API n8n");
    }

    const data = await res.json();
    const answerText: string = data.output ?? data.answer ?? data.text ?? "";

    // Parse output thành sections đẹp hơn
    const parsedResult = parseOutputToSections(answerText, searchType);

    return parsedResult;
  } catch (error) {
    console.error("Doctoris n8n API Error:", error);
    throw new Error("Không thể lấy thông tin từ hệ thống Doctoris.");
  }
};
