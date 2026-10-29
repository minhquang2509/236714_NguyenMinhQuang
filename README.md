# Đề tài: Hệ thống Quản lý Món ăn trên nền tảng Đám mây
- Họ và tên: Nguyễn Minh Quang
- MSSV: 236714

## Công nghệ sử dụng
- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Đóng gói & Triển khai: Docker, Docker Hub, Render

## Cấu trúc dự án
- `/backend`: Mã nguồn Backend API
- `/frontend`: Mã nguồn Frontend React

## Câu 5: Đóng gói Backend bằng Docker và Docker Hub
- **Docker Hub Image Link**: `minhquang2509/backend:latest`

### Hướng dẫn chạy Backend qua Docker:
docker pull minhquang2509/backend:latest
docker run -d -p 5000:5000 -e MONGO_URI="<chuoi_ket_noi_mongodb>" minhquang2509/backend:latest

## Câu 6: Đóng gói Frontend bằng Docker và Docker Hub
- **Docker Hub Image Link**: `minhquang2509/frontend:latest`

### Hướng dẫn chạy:
docker pull minhquang2509/frontend:latest
docker run -d -p 3000:80 minhquang2509/frontend:latest