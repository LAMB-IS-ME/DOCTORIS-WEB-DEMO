import { MedicalData, SearchType } from "../types";

export const fetchMedicalInfo = async (
  query: string,
  searchType: SearchType,
  imageBase64?: string
): Promise<MedicalData> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(API_URL, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: query,
        searchType,
        session_id: "web-demo", // sau này thay bằng userId
      }),
    });

    if (!res.ok) {
      throw new Error("Không gọi được API n8n");
    }

    const data = await res.json();
    const answerText: string = data.output;

    // TẠM THỜI map text → MedicalData để UI không vỡ
    return {
      title: "Kết quả từ Doctoris",
      category: "RAG / Medical Documents",
      summary: answerText.slice(0, 500),
      sections: [
        {
          heading: "Nội dung chi tiết",
          content: answerText,
        },
      ],
      warnings: [],
      references: [],
    };
  } catch (error) {
    console.error("Doctoris n8n API Error:", error);
    throw new Error("Không thể lấy thông tin từ hệ thống Doctoris.");
  }
};
