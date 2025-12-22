# 📝 Hướng dẫn tối ưu Output cho n8n AI Agent

## 🎯 Mục tiêu

Frontend Doctoris đã được nâng cấp để hỗ trợ **Markdown rendering** với typography đẹp mắt. Để tận dụng tối đa, bạn cần hướng dẫn AI Agent trong n8n xuất output theo format Markdown chuẩn.

---

## ✅ Format Output Markdown Chuẩn

### **Template System Prompt cho AI Agent:**

```markdown
Bạn là một trợ lý y tế chuyên nghiệp, hỗ trợ bác sĩ trong việc nghiên cứu các tài liệu y khoa chuyên ngành.

**Nhiệm vụ:**
- Trả lời các câu hỏi liên quan đến triệu chứng, bệnh lý, thuốc, và thông tin bệnh nhân.
- Sử dụng các tài liệu từ vector database để cung cấp câu trả lời chính xác.
- Luôn trích dẫn nguồn nếu có.

**FORMAT OUTPUT (quan trọng):**
Luôn trả lời theo cấu trúc Markdown rõ ràng:

## Tổng quan
[Tóm tắt ngắn gọn câu trả lời]

## Thông tin chi tiết
[Nội dung chính, có thể chia thành nhiều đoạn]

### Các điểm quan trọng:
- Điểm 1
- Điểm 2
- Điểm 3

## Cảnh báo quan trọng
- Cảnh báo 1 (nếu có)
- Cảnh báo 2

## Nguồn tham khảo
- [Tên nguồn](URL) nếu có

**LƯU Ý:**
- Dùng `##` cho heading chính, `###` cho sub-heading
- Dùng bullet points (`-` hoặc `*`) cho lists
- Dùng `**text**` cho chữ in đậm
- Dùng `*text*` cho chữ nghiêng
- Đừng dùng HTML, chỉ dùng Markdown thuần
```

---

## 🎨 Các phần tử Markdown được hỗ trợ

### 1. **Headings**

```markdown
## Heading cấp 2 (sections chính)
### Heading cấp 3 (sub-sections)
#### Heading cấp 4 (chi tiết nhỏ)
```

**Hiển thị:** Heading to, đậm, màu đậm theo cấp độ

---

### 2. **Lists**

```markdown
- Bullet point 1
- Bullet point 2
  - Sub-point 2.1
  - Sub-point 2.2

1. Numbered item 1
2. Numbered item 2
```

**Hiển thị:** List đẹp với spacing và indent hợp lý

---

### 3. **Emphasis**

```markdown
**Chữ in đậm** cho điểm quan trọng
*Chữ nghiêng* cho nhấn mạnh nhẹ
```

**Hiển thị:**
- **Chữ đậm** → font-weight bold, màu đen
- *Chữ nghiêng* → italic, màu xám đậm

---

### 4. **Code / Thuật ngữ y khoa**

```markdown
Sử dụng `Paracetamol 500mg` cho hạ sốt.

Hoặc code block:
```
Liều dùng:
- Người lớn: 500mg x 3 lần/ngày
- Trẻ em: 10mg/kg/lần
```
```

**Hiển thị:**
- Inline code: nền xám nhạt, màu medical-700
- Code block: khối nền xám, font mono

---

### 5. **Blockquote (Trích dẫn)**

```markdown
> "Bệnh nhân cần được theo dõi sát trong 24h đầu"
> — Hướng dẫn điều trị COVID-19
```

**Hiển thị:** Border trái màu medical, chữ nghiêng

---

### 6. **Links**

```markdown
Xem thêm [Hướng dẫn WHO](https://who.int/guidelines)
```

**Hiển thị:** Link màu medical-600, hover đậm hơn, mở tab mới

---

### 7. **Horizontal Rule (Phân cách)**

```markdown
---
```

**Hiển thị:** Đường kẻ ngang mỏng, màu xám nhạt

---

## 💡 Ví dụ Output Chuẩn từ AI Agent

### **Input:** "Xin hướng dẫn xử trí đau đầu nhẹ"

### **Output mẫu:**

```markdown
## Tổng quan

Đau đầu nhẹ là triệu chứng phổ biến, có thể do nhiều nguyên nhân như căng thẳng, thiếu ngủ, hoặc mất nước. Phần lớn các trường hợp có thể tự khỏi hoặc điều trị đơn giản tại nhà.

## Nguyên nhân thường gặp

### 1. Đau đầu do căng thẳng (Tension Headache)
- Nguyên nhân: Stress, tư thế ngồi sai, mệt mỏi
- Triệu chứng: Đau âm ỉ hai bên đầu, như bị siết chặt

### 2. Đau nửa đầu (Migraine nhẹ)
- Nguyên nhân: Di truyền, thay đổi hormone, một số thực phẩm
- Triệu chứng: Đau một bên, có thể kèm buồn nôn

## Xử trí ban đầu

**Biện pháp không dùng thuốc:**
- Nghỉ ngơi trong phòng tối, yên tĩnh
- Chườm lạnh hoặc ấm vùng trán
- Massage nhẹ vùng thái dương và gáy
- Uống đủ nước (2-2.5L/ngày)

**Thuốc giảm đau:**
- `Paracetamol 500mg`: uống 1-2 viên, cách 4-6h
- `Ibuprofen 400mg`: uống 1 viên nếu không có chống chỉ định
- **Lưu ý:** Không lạm dụng thuốc giảm đau >3 ngày/tuần

## Cảnh báo quan trọng

⚠️ **Cần đến bác sĩ ngay nếu:**
- Đau đầu đột ngột, dữ dội (như bị sét đánh)
- Kèm sốt cao, cứng gáy
- Rối loạn ý thức, yếu liệt
- Đau đầu sau chấn thương
- Đau đầu mãn tính, tiến triển nặng dần

## Phòng ngừa

1. **Lối sống:**
   - Ngủ đủ 7-8h/đêm
   - Giảm stress: yoga, thiền, tập thể dục
   - Tránh nhịn đói kéo dài

2. **Môi trường:**
   - Ánh sáng phòng vừa phải
   - Tư thế làm việc đúng chuẩn
   - Giảm thời gian nhìn màn hình

## Nguồn tham khảo

- Hướng dẫn chẩn đoán và điều trị đau đầu - Bộ Y tế
- WHO Guidelines for Headache Management
```

---

## 🚀 Cách áp dụng vào n8n

### **Bước 1:** Cập nhật System Message của AI Agent

Copy template "FORMAT OUTPUT" ở trên vào System Message của AI Agent node.

### **Bước 2:** Kiểm tra Response

1. Test workflow với câu hỏi mẫu
2. Xem tab OUTPUT của AI Agent
3. Đảm bảo output có markdown headings (`##`, `###`)

### **Bước 3:** Chạy frontend và xem kết quả

```powershell
cd "d:\Chatbot y khoa\DOCTORIS-WEB-DEMO\frontend"
npm run dev
```

Truy cập http://localhost:3000 và gửi query. Output sẽ tự động:
- Parse markdown headings thành sections
- Render lists, bold, italic đẹp
- Tách cảnh báo (nếu heading chứa "cảnh báo")
- Hiển thị typography chuyên nghiệp

---

## 🎯 Checklist Output Chất Lượng

- [ ] Có ít nhất 2-3 headings `##` để tách sections
- [ ] Dùng bullet points cho lists
- [ ] Dùng `**text**` cho thuật ngữ quan trọng
- [ ] Có section "Cảnh báo" nếu cần thiết
- [ ] Ngắn gọn, tập trung (không quá 2000 words)
- [ ] Không dùng HTML (`<div>`, `<p>`) trong output

---

## 📊 So sánh trước và sau

### ❌ **Trước (Plain text):**

```
Đau đầu nhẹ có thể do nhiều nguyên nhân. Xử trí: nghỉ ngơi, uống paracetamol...
```

→ Nhàm chán, khó đọc, không cấu trúc

### ✅ **Sau (Markdown):**

```markdown
## Tổng quan
Đau đầu nhẹ...

## Xử trí
- Nghỉ ngơi
- Thuốc: `Paracetamol 500mg`

## Cảnh báo
- Cần đến bác sĩ nếu...
```

→ Rõ ràng, chuyên nghiệp, dễ đọc

---

## 🛠️ Troubleshooting

### ❓ "Output không có headings"

**Fix:** Thêm vào System Prompt:
```
LUÔN BẮT ĐẦU output với ## Tổng quan và chia thành sections rõ ràng.
```

### ❓ "Lists không hiển thị đẹp"

**Fix:** Đảm bảo AI dùng `-` hoặc `*` ở đầu dòng, có space sau:
```
- Item 1
- Item 2
```

### ❓ "Markdown không render"

**Fix:** Kiểm tra console log, đảm bảo `react-markdown` đã cài đặt.

---

**Cập nhật:** 18/12/2025 | **Version:** Frontend v1.0 with Markdown Support ✅
