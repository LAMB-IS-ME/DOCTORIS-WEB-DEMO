# DOCTORIS-WEB-DEMO

DOCTORIS-WEB-DEMO là dự án demo web ứng dụng công nghệ AI, xử lý chat, tài liệu (ảnh/PDF) và xác thực người dùng. Backend được xây dựng hiện đại, dễ mở rộng với Python và FastAPI.

## Cấu trúc dự án
```
backend/
│
├── app/
│   ├── api/           # Các endpoint API
│   ├── services/      # Xử lý nghiệp vụ và kết nối hệ thống ngoài
│   ├── models/        # Định nghĩa bảng dữ liệu ORM
│   ├── schemas/       # Kiểu dữ liệu Pydantic để trao đổi
│   ├── core/          # Cấu hình, bảo mật, ngoại lệ
│   ├── utils/         # Các hàm tiện ích
│   └── main.py        # Khởi tạo ứng dụng FastAPI
│
├── tests/             # Unit/integration test
└── requirements.txt   # Danh sách thư viện cần cài đặt
```
## Yêu cầu hệ thống

- Python 3.8+
- Pip (công cụ quản lý package Python)

## Hướng dẫn cài đặt & vận hành

```bash
# Clone repository
git clone https://github.com/LAMB-IS-ME/DOCTORIS-WEB-DEMO.git
cd DOCTORIS-WEB-DEMO/backend

# Tạo môi trường ảo
python -m venv venv
source venv/bin/activate      # Đối với Linux/MacOS
venv\Scripts\activate         # Đối với Windows

# Cài đặt các package từ requirements.txt
pip install -r requirements.txt

# Khởi chạy server FastAPI ở chế độ phát triển
uvicorn app.main:app --reload
```

Truy cập API docs tự động với Swagger tại địa chỉ:  
`http://localhost:8000/docs`

## Đóng góp & liên hệ

- Chủ sở hữu repo: [LAMB-IS-ME](https://github.com/LAMB-IS-ME)
- Mọi đóng góp, phản hồi có thể tạo issue trực tiếp trên GitHub.

---

> Vui lòng cập nhật requirements.txt với nội dung các thư viện bạn sử dụng cho dự án.