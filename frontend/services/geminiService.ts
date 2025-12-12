import { GoogleGenAI, Type } from "@google/genai";
import { MedicalData, SearchType } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

const MEDICAL_SYSTEM_INSTRUCTION = `
Bạn là một trợ lý y khoa chuyên nghiệp "Doctoris" dành cho các bác sĩ.
Nhiệm vụ của bạn là cung cấp thông tin chính xác về bệnh học, dược lý, phác đồ điều trị và hồ sơ bệnh nhân.

Nếu người dùng cung cấp hình ảnh, hãy phân tích kỹ hình ảnh đó (ví dụ: hình ảnh thuốc, hình ảnh tổn thương da, kết quả xét nghiệm) để đưa ra câu trả lời.

Hãy sử dụng ngôn ngữ y khoa chuyên ngành nhưng dễ hiểu, súc tích.
Luôn đưa ra các cảnh báo quan trọng nếu có (chống chỉ định, tương tác thuốc nguy hiểm, dấu hiệu cấp cứu).

QUAN TRỌNG VỀ NGUỒN TÀI LIỆU (REFERENCES):
- Đối với tra cứu Thuốc, Bệnh, Triệu chứng: BẮT BUỘC cung cấp danh sách các nguồn tham khảo uy tín có đường dẫn (URL) thực tế để bác sĩ kiểm chứng.
- Ưu tiên các nguồn: Bộ Y Tế Việt Nam, Cục Quản lý Dược, CDC, WHO, PubMed, MSD Manual, DrugBank, Medscape.
- Đối với tra cứu Bệnh nhân: Không cần nguồn tham khảo (để trống).

Yêu cầu định dạng đầu ra:
Bạn phải trả về kết quả dưới dạng JSON tuân thủ schema được cung cấp.
Không bao giờ trả về markdown ngoài JSON.

Cấu trúc mong muốn:
- title: Tên chính của bệnh, thuốc hoặc tên bệnh nhân.
- category: Phân loại.
- summary: Tóm tắt ngắn gọn.
- sections: Một mảng các mục chi tiết.
- warnings: Các cảnh báo quan trọng.
- references: Mảng chứa tên nguồn và đường link (URL).
`;

export const fetchMedicalInfo = async (query: string, searchType: SearchType, imageBase64?: string): Promise<MedicalData> => {
  if (!apiKey) {
    throw new Error("Vui lòng cấu hình API Key để sử dụng.");
  }

  const modelId = 'gemini-2.5-flash';

  // Specific context based on search type
  let promptContext = "";
  switch (searchType) {
    case SearchType.DRUG:
      promptContext = "Người dùng đang tra cứu thông tin về Thuốc. Nếu có ảnh, hãy nhận diện thuốc qua bao bì, viên thuốc hoặc đơn thuốc. Cung cấp liều dùng, chống chỉ định và tương tác thuốc.";
      break;
    case SearchType.DISEASE:
      promptContext = "Người dùng đang tra cứu thông tin về Bệnh học. Tập trung vào cơ chế bệnh sinh, tiêu chuẩn chẩn đoán và phác đồ điều trị mới nhất.";
      break;
    case SearchType.SYMPTOM:
      promptContext = "Người dùng đang tra cứu về Triệu chứng lâm sàng. Hãy đưa ra các chẩn đoán phân biệt, gợi ý cận lâm sàng và hướng xử trí.";
      break;
    case SearchType.PATIENT:
      promptContext = `
      Người dùng đang tra cứu hồ sơ Bệnh nhân (Giả lập truy vấn từ SQL).
      
      QUY TẮC XỬ LÝ CHO MỤC BỆNH NHÂN:
      1. Đây là tính năng mô phỏng lấy dữ liệu từ cơ sở dữ liệu bệnh viện.
      2. Vì hiện tại chưa kết nối SQL thực tế, nên nếu trong câu truy vấn của người dùng KHÔNG cung cấp thông tin cụ thể về bệnh nhân (như tuổi, tiền sử, bệnh án tóm tắt), bạn hãy trả về kết quả báo là "Không tìm thấy dữ liệu".
      3. Nếu người dùng nhập thông tin giả định (ví dụ: "Bệnh nhân Nguyễn Văn A, 45 tuổi, tiền sử tăng huyết áp..."), hãy đóng vai hệ thống đã tìm thấy hồ sơ và tóm tắt lại hồ sơ đó dưới dạng bệnh án chuẩn.
      
      Trường hợp không tìm thấy:
      - title: "Không tìm thấy dữ liệu"
      - category: "Lỗi truy vấn SQL"
      - summary: "Hệ thống không tìm thấy hồ sơ bệnh nhân tương ứng trong cơ sở dữ liệu."
      - sections: []
      - references: []
      `;
      break;
    default:
      promptContext = "Người dùng đang hỏi vấn đề y khoa.";
  }

  try {
    const parts: any[] = [];
    
    // Add image if exists
    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      });
    }

    // Add text prompt
    parts.push({
      text: `${promptContext}\nTruy vấn của người dùng: "${query}"`
    });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: parts },
      config: {
        systemInstruction: MEDICAL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Tên chính thức" },
            category: { type: Type.STRING, description: "Phân loại" },
            summary: { type: Type.STRING, description: "Tổng quan" },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING, description: "Tiêu đề mục" },
                  content: { type: Type.STRING, description: "Nội dung chi tiết" }
                }
              }
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Các cảnh báo quan trọng"
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Tên nguồn/bài viết" },
                  url: { type: Type.STRING, description: "Đường dẫn URL trực tiếp" }
                }
              },
              description: "Danh sách nguồn tài liệu tham khảo uy tín"
            }
          },
          required: ["title", "category", "summary", "sections", "warnings"]
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Không nhận được dữ liệu từ Gemini.");
    }

    const data = JSON.parse(textResponse) as MedicalData;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Không thể lấy thông tin. Vui lòng thử lại hoặc kiểm tra ảnh đầu vào.");
  }
};