import { MedicalData, SearchType } from "../types";

// Read environment variables (Vite exposes only variables prefixed with VITE_)
const USE_N8N_RAG = (import.meta.env.VITE_USE_N8N_RAG ?? "true") === "true";
const N8N_WEBHOOK_URL =
  (import.meta.env.VITE_N8N_WEBHOOK_URL as string) ||
  "http://localhost:5678/webhook/doctoris-chat";
const N8N_API_KEY = (import.meta.env.VITE_N8N_API_KEY as string) || "";

/**
 * Parse raw output text thành structured sections với markdown formatting
 */
function parseOutputToSections(
  text: string,
  searchType: SearchType
): MedicalData {
  // Tạo title dựa trên searchType
  const titleMap: Record<SearchType, string> = {
    [SearchType.SYMPTOM]: "Kết quả tra cứu Triệu chứng",
    [SearchType.DISEASE]: "Thông tin Bệnh lý",
    [SearchType.DRUG]: "Thông tin Thuốc",
    [SearchType.PATIENT]: "Thông tin Bệnh nhân",
  };

  const categoryMap: Record<SearchType, string> = {
    [SearchType.SYMPTOM]: "Triệu chứng & Chẩn đoán",
    [SearchType.DISEASE]: "Bệnh lý",
    [SearchType.DRUG]: "Dược phẩm",
    [SearchType.PATIENT]: "Hồ sơ Bệnh nhân",
  };

  // Tách sections dựa trên markdown headings (## hoặc ###)
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const matches = Array.from(text.matchAll(headingRegex));

  let sections: Array<{ heading: string; content: string }> = [];
  let warnings: string[] = [];

  if (matches.length > 0) {
    // Có headings → tách theo headings
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const heading = match[2].trim();
      const startIdx = match.index! + match[0].length;
      const endIdx = matches[i + 1]?.index ?? text.length;
      const content = text.slice(startIdx, endIdx).trim();

      // Detect warnings (heading chứa "cảnh báo", "lưu ý", "chú ý", "nguy hiểm")
      if (/cảnh báo|lưu ý|chú ý|nguy hiểm|quan trọng/i.test(heading)) {
        // Extract bullet points as warnings
        const warningLines = content
          .split("\n")
          .filter((line) => line.trim().match(/^[-*•]/))
          .map((line) => line.replace(/^[-*•]\s*/, "").trim());
        warnings.push(...warningLines);
      }

      sections.push({ heading, content });
    }
  } else {
    // Không có headings → tách theo paragraph breaks (2+ newlines)
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

    if (paragraphs.length > 1) {
      sections = paragraphs.map((para, idx) => ({
        heading: idx === 0 ? "Tổng quan" : `Phần ${idx + 1}`,
        content: para.trim(),
      }));
    } else {
      // Toàn bộ là 1 đoạn dài
      sections = [
        {
          heading: "Nội dung chi tiết",
          content: text.trim(),
        },
      ];
    }
  }

  // Extract summary (first 300 chars, cắt ở câu hoàn chỉnh)
  let summary = text.slice(0, 300).trim();
  const lastSentenceEnd = Math.max(
    summary.lastIndexOf("."),
    summary.lastIndexOf("。"),
    summary.lastIndexOf("!"),
    summary.lastIndexOf("?")
  );
  if (lastSentenceEnd > 100) {
    summary = summary.slice(0, lastSentenceEnd + 1);
  } else {
    summary = summary + "...";
  }

  return {
    title: titleMap[searchType] || "Kết quả tra cứu",
    category: categoryMap[searchType] || "RAG / Medical Documents",
    summary,
    sections,
    warnings,
    references: [], // TODO: extract references nếu có pattern [1], [2] hoặc URLs
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
