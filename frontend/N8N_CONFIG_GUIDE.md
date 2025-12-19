# Hướng dẫn cấu hình n8n Workflow cho Doctoris

## 📋 Tổng quan

Frontend hiện gửi payload JSON đơn giản đến n8n webhook:

```json
{
  "message": "nội dung câu hỏi",
  "sessionId": "web-demo",
  "searchType": "SYMPTOM",
  "imageBase64": "..." // (optional)
}
```

n8n Webhook node sẽ nhận payload này vào `$json.body`, tức là:
- `$json.body.message` → câu hỏi người dùng
- `$json.body.sessionId` → session ID để Chat Memory track lịch sử
- `$json.body.searchType` → loại tìm kiếm (SYMPTOM/DISEASE/DRUG/PATIENT)
- `$json.body.imageBase64` → ảnh nếu có

---

## ⚙️ Cấu hình từng Node

### 1️⃣ **Webhook Node** (doctoris-chat)

**Path:** `/webhook/doctoris-chat`

**Settings:**
- Method: POST
- Response Mode: "Last Node" hoặc "Respond to Webhook"
- Authentication: None (hoặc Bearer Token nếu cần bảo mật)

**Không cần config gì thêm.** Webhook tự động parse JSON body.

---

### 2️⃣ **AI Agent Node**

#### **Prompt (User Message):**

**Source:** "Define below"

**Expression:**
```javascript
{{ $json.body.message }}
```

> ⚠️ **LƯU Ý:** Đừng dùng `$json.body.body.message` hay `$json.query`. Phải là `$json.body.message`.

#### **System Message:**

Điền prompt system của bạn (ví dụ):
```
Bạn là một trợ lý y tế chuyên nghiệp, hỗ trợ bác sĩ trong việc nghiên cứu các tài liệu y khoa chuyên ngành.
Nhiệm vụ:
- Trả lời các câu hỏi liên quan đến triệu chứng, bệnh lý, thuốc, và thông tin bệnh nhân.
- Sử dụng các tài liệu từ vector database để cung cấp câu trả lời chính xác.
- Luôn trích dẫn nguồn nếu có.
```

#### **Options → Transforms:**

Để tránh tràn context token, thêm **middle-out compression**:

1. Click "Add Item" trong "Transforms"
2. Chọn "Middle-out" hoặc "Compress prompt"
3. Set parameters:
   - **Target tokens:** `6000` (an toàn cho model 32k; nếu model ≥128k thì có thể để 10k–20k)
   - **Min chunk size:** `500`

---

### 3️⃣ **Chat Memory Node**

**Connection/Session ID:**

**Expression:**
```javascript
{{ $json.body.sessionId }}
```

**Settings:**
- **Max messages/items:** `6–8` (giữ lịch sử ngắn để không tràn token)
- **Window type:** Token window hoặc Message count
- Nếu có tùy chọn "Summarize old messages", hãy bật.

---

### 4️⃣ **Qdrant Retrieval Tool** (hoặc Vector Store RAG)

**Settings:**
- **Top K:** `3–5` (đừng để quá cao, ví dụ 10+ sẽ tràn context)
- **Max characters per document:** `2000–3000` (tương đương ~500–800 tokens)
- **Return full payload:** OFF (chỉ giữ trường `text` hoặc `content`)

**Optional:** Nếu muốn filter theo `searchType`, bạn có thể dùng:
```javascript
{{ $json.body.searchType }}
```

---

### 5️⃣ **OpenRouter Chat Model** (hoặc LLM của bạn)

**Model:** Chọn một trong các model có context lớn:
- `anthropic/claude-3.5-sonnet` (~200k tokens)
- `openai/gpt-4o` (~128k tokens)
- `openai/gpt-4o-mini` (~128k tokens)

**Max tokens (Response):** `1024–2048` (câu trả lời y khoa thường không cần quá dài)

---

### 6️⃣ **Respond to Webhook Node**

**Response body:**

```javascript
{
  "output": "{{ $json.output }}",
  "sessionId": "{{ $json.body.sessionId }}"
}
```

Hoặc đơn giản hơn, để n8n tự động trả toàn bộ output của AI Agent:
```javascript
{{ $json }}
```

Frontend đọc `data.output` hoặc `data.answer` hoặc `data.text`.

---

## 🧪 Cách test Webhook trước khi chạy Frontend

### Test bằng cURL:

```powershell
curl -X POST http://localhost:5678/webhook/doctoris-chat `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"Xin hướng dẫn xử trí đau đầu nhẹ\",\"sessionId\":\"test1\",\"searchType\":\"SYMPTOM\"}'
```

### Test bằng PowerShell:

```powershell
$body = @{
  message = "Xin hướng dẫn xử trí đau đầu nhẹ"
  sessionId = "test1"
  searchType = "SYMPTOM"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook/doctoris-chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Kết quả mong đợi:**
```json
{
  "output": "Đau đầu nhẹ có thể do nhiều nguyên nhân...",
  "sessionId": "test1"
}
```

---

## 🚨 Troubleshooting

### ❌ Lỗi: "No prompt specified"

**Nguyên nhân:** Expression trong AI Agent Prompt không đúng.

**Fix:** Đảm bảo dùng `{{ $json.body.message }}` (KHÔNG phải `$json.query` hay `$json.body.body.message`).

---

### ❌ Lỗi: "Bad request - maximum context length is X tokens"

**Nguyên nhân:** Tổng input (RAG docs + Memory + Prompt + System) vượt giới hạn model.

**Fix:**
1. Giảm **Top K** trong Qdrant Retrieval Tool xuống 3–5.
2. Bật **middle-out compression** trong AI Agent.
3. Giảm **Max messages** trong Chat Memory xuống 6–8.
4. Chọn model có context lớn hơn (≥128k–200k).

---

### ❌ Lỗi: "Undefined" khi đọc `$json.body.message`

**Nguyên nhân:** Frontend đang gửi payload sai cấu trúc hoặc Webhook chưa parse đúng.

**Fix:**
1. Kiểm tra tab **INPUT** của AI Agent node → xem cấu trúc JSON.
2. Nếu thấy `body.body.message`, nghĩa là frontend wrap 2 lớp → xóa 1 lớp `body` trong code frontend.
3. Đảm bảo frontend gửi payload phẳng: `{ message, sessionId, searchType }`.

---

## 🎯 Checklist hoàn chỉnh

- [ ] Webhook node nhận POST tại `/webhook/doctoris-chat`
- [ ] AI Agent Prompt: `{{ $json.body.message }}`
- [ ] Chat Memory Session ID: `{{ $json.body.sessionId }}`
- [ ] AI Agent có middle-out compression (target ~6000 tokens)
- [ ] Qdrant Top K ≤ 5, max chars ~2000–3000
- [ ] Chat Memory Max messages ≤ 8
- [ ] Model có context ≥128k (khuyến nghị)
- [ ] Test webhook bằng cURL/PowerShell → nhận được output
- [ ] Frontend chạy `npm run dev` và thử gửi câu hỏi ngắn

---

## 📦 Tóm tắt luồng dữ liệu

```
Frontend (React)
  ↓ POST { message, sessionId, searchType }
Webhook (n8n)
  ↓ $json.body.message
AI Agent
  ├─ Chat Memory ($json.body.sessionId)
  ├─ Qdrant Retrieval Tool (Top K=3–5)
  └─ OpenRouter Model (nén middle-out)
  ↓ output
Respond to Webhook
  ↓ { output, sessionId }
Frontend (hiển thị kết quả)
```

---

✅ **Sau khi cấu hình xong, chạy frontend:**

```powershell
cd "d:\Chatbot y khoa\DOCTORIS-WEB-DEMO\frontend"
npm run dev
```

Mở http://localhost:3000, nhập câu hỏi ngắn để test. Nếu vẫn lỗi, check **Executions** tab trong n8n và gửi log cho mình.
