# 🩺 Doctoris Frontend - Medical AI Assistant

Frontend React + Vite kết nối với n8n workflow để cung cấp trợ lý y khoa thông minh với RAG (Retrieval-Augmented Generation).

---

## 🚀 Khởi chạy nhanh

**Prerequisites:** Node.js 18+

### 1. Cài đặt dependencies

```powershell
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local`:

```bash
# Frontend toggles
VITE_USE_N8N_RAG=true

# n8n Webhook URL
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/doctoris-chat

# Optional: API key cho webhook authentication
VITE_N8N_API_KEY=

# Gemini API (nếu USE_N8N_RAG=false)
GEMINI_API_KEY=your-gemini-api-key-here
```

> ⚠️ **Lưu ý:** Vite chỉ expose biến có prefix `VITE_` ra client.

### 3. Chạy development server

```powershell
npm run dev
```

Truy cập: http://localhost:3000

### 4. Build production

```powershell
npm run build
npm run preview
```

---

## 🔧 Cấu hình n8n Workflow

### **Expression mapping quan trọng:**

Frontend gửi:
```json
{
  "message": "câu hỏi người dùng",
  "sessionId": "web-demo",
  "searchType": "SYMPTOM"
}
```

Trong n8n:
- **AI Agent Prompt:** `{{ $json.body.message }}`
- **Chat Memory Session ID:** `{{ $json.body.sessionId }}`

📘 **Xem chi tiết:** [`N8N_CONFIG_GUIDE.md`](./N8N_CONFIG_GUIDE.md)

---

## 🧪 Test Webhook

```powershell
.\test-webhook.ps1
```

---

## 🎯 Tính năng

- ✅ Tìm kiếm: Triệu chứng / Bệnh / Thuốc / Bệnh nhân
- ✅ Upload ảnh (toa thuốc, X-quang, tổn thương)
- ✅ Lịch sử tìm kiếm (50 items)
- ✅ **Giới hạn input 6000 ký tự** (~1500 tokens)
- ✅ Cảnh báo khi gần đạt giới hạn
- ✨ **Markdown rendering:** Headings, lists, bold, italic, code, blockquote
- ✨ **Auto-parse sections:** Tự động tách output thành sections đẹp
- ✨ **Typography chuyên nghiệp:** Font, spacing, colors tối ưu cho nội dung y khoa

---

## 🐛 Troubleshooting

### "No prompt specified"
→ Kiểm tra AI Agent Prompt dùng `{{ $json.body.message }}`

### "Context length exceeded"
→ Xem [`N8N_CONFIG_GUIDE.md`](./N8N_CONFIG_GUIDE.md) - giảm Top K, bật compression

### Không kết nối n8n
→ Chạy `.\test-webhook.ps1`, kiểm tra `.env.local`

---

## 📂 Files quan trọng

- `services/geminiService.ts` - API call + smart parsing ✅
- `components/ResultCard.tsx` - Markdown rendering ✅
- `components/SearchBar.tsx` - Input validation ✅
- `.env.local` - Environment config ✅
- `N8N_CONFIG_GUIDE.md` - Hướng dẫn cấu hình n8n ✅
- `OUTPUT_FORMAT_GUIDE.md` - Hướng dẫn format output markdown ✨
- `test-webhook.ps1` - Test script ✅

---

**Phát triển:** Doctoris Team | **Cập nhật:** 18/12/2025
