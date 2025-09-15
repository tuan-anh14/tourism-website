# Hà Nội Tourism - Admin Panel

## Tổng quan

Website Cẩm nang du lịch Hà Nội được xây dựng bằng Node.js với EJS template engine và MongoDB database. Hệ thống bao gồm trang client cho du khách và trang admin để quản lý nội dung.

## Cấu trúc Database MongoDB

### 1. Collections chính:

#### **Attractions (Điểm tham quan)**
- Thông tin cơ bản: tên, địa chỉ, giờ mở cửa, giá vé
- Phân loại: di tích lịch sử, bảo tàng, làng nghề, phố cổ, khu vui chơi, lễ hội
- Hình ảnh, đánh giá, trải nghiệm du khách
- Hỗ trợ đa ngôn ngữ (Tiếng Việt - Tiếng Anh)

#### **Accommodations (Lưu trú)**
- Thông tin khách sạn, resort, homestay
- Xếp hạng sao, giá cả, tiện ích
- Vị trí, liên hệ, đánh giá

#### **Foods (Ẩm thực)**
- Món ăn đặc sản Hà Nội
- Thông tin nhà hàng, quán ăn
- Nguyên liệu, cách chế biến
- Giá cả, đánh giá

#### **Transportation (Di chuyển)**
- Phương tiện đến Hà Nội và trong thành phố
- Thông tin tuyến đường, giá vé
- Giờ hoạt động, liên hệ

#### **Entertainment (Giải trí)**
- Nhà hát, khu vui chơi, spa
- Thông tin biểu diễn, giá vé
- Dịch vụ, tiện ích

#### **Tours (Tour du lịch)**
- Tour 1 ngày, 2 ngày, 3 ngày
- Lịch trình chi tiết, giá cả
- Điểm tham quan, ẩm thực, giải trí

#### **News (Tin tức)**
- Tin tức du lịch, sự kiện
- Hướng dẫn, kinh nghiệm
- Hỗ trợ đa ngôn ngữ

#### **Reviews (Đánh giá)**
- Đánh giá của du khách
- Xếp hạng sao, nội dung
- Xác thực, hữu ích

#### **Users (Người dùng)**
- Tài khoản admin, editor
- Phân quyền, bảo mật
- Quản lý người dùng

## Cài đặt và Chạy

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Cấu hình môi trường:
- Copy file `env.example` thành `.env`
- Cập nhật các thông tin cấu hình:
  - `MONGO_URL`: Đường dẫn MongoDB
  - `PORT`: Cổng server (mặc định 3000)
  - `SESSION_SECRET`: Khóa bảo mật session

### 3. Chạy seed data:
```bash
npm run seed
```

### 4. Khởi động server:
```bash
npm start
```

## Truy cập Admin Panel

### URL: `http://localhost:3000/admin`

### Tài khoản mặc định:
- **Admin**: 
  - Username: `admin`
  - Password: `admin123`
- **Editor**: 
  - Username: `editor`
  - Password: `editor123`

## Tính năng Admin Panel

### 1. Dashboard
- Thống kê tổng quan
- Đánh giá gần đây
- Thao tác nhanh

### 2. Quản lý Điểm tham quan
- CRUD operations
- Upload hình ảnh
- Phân loại, đánh giá
- Tìm kiếm, lọc

### 3. Quản lý Lưu trú
- Thông tin khách sạn
- Giá cả, tiện ích
- Vị trí, liên hệ

### 4. Quản lý Ẩm thực
- Món ăn đặc sản
- Nhà hàng, quán ăn
- Nguyên liệu, giá cả

### 5. Quản lý Di chuyển
- Phương tiện giao thông
- Tuyến đường, giá vé
- Thông tin liên hệ

### 6. Quản lý Giải trí
- Nhà hát, khu vui chơi
- Dịch vụ, tiện ích
- Giá vé, lịch trình

### 7. Quản lý Tours
- Tour du lịch
- Lịch trình chi tiết
- Giá cả, đặt tour

### 8. Quản lý Tin tức
- Tin tức, sự kiện
- Hướng dẫn du lịch
- Hỗ trợ đa ngôn ngữ

### 9. Quản lý Đánh giá
- Xem, duyệt đánh giá
- Xác thực, quản lý

### 10. Quản lý Người dùng
- Tài khoản admin/editor
- Phân quyền
- Bảo mật

## Tính năng kỹ thuật

### 1. Bảo mật
- Authentication với session
- Authorization theo role
- Hash password với bcrypt
- CSRF protection

### 2. Upload File
- Hỗ trợ upload hình ảnh
- Giới hạn kích thước file
- Validation file type
- Tự động resize

### 3. Responsive Design
- Bootstrap 5
- Mobile-friendly
- Modern UI/UX
- Dark/Light theme

### 4. Performance
- Pagination
- Search & Filter
- Image optimization
- Caching

### 5. Internationalization
- Hỗ trợ Tiếng Việt - Tiếng Anh
- Dynamic language switching
- SEO-friendly URLs

## API Endpoints

### Admin Routes:
- `GET /admin/login` - Trang đăng nhập
- `POST /admin/login` - Xử lý đăng nhập
- `GET /admin/dashboard` - Dashboard
- `GET /admin/attractions` - Danh sách điểm tham quan
- `GET /admin/attractions/create` - Form tạo mới
- `POST /admin/attractions` - Tạo điểm tham quan
- `GET /admin/attractions/:id` - Chi tiết
- `GET /admin/attractions/:id/edit` - Form chỉnh sửa
- `PUT /admin/attractions/:id` - Cập nhật
- `DELETE /admin/attractions/:id` - Xóa

## Cấu trúc thư mục

```
tourism-website/
├── config/
│   ├── database.js
│   └── system.js
├── controller/
│   ├── admin/
│   │   ├── auth.controller.js
│   │   └── attraction.controller.js
│   └── client/
├── middleware/
│   ├── auth.js
│   └── upload.js
├── model/
│   ├── Attraction.js
│   ├── Accommodation.js
│   ├── Food.js
│   ├── Transportation.js
│   ├── Entertainment.js
│   ├── Tour.js
│   ├── News.js
│   ├── Review.js
│   └── User.js
├── public/
│   ├── admin/
│   │   ├── css/
│   │   └── js/
│   ├── client/
│   └── uploads/
├── routes/
│   ├── admin/
│   └── client/
├── scripts/
│   └── seed.js
├── views/
│   ├── admin/
│   └── client/
├── server.js
└── package.json
```

## Hướng dẫn sử dụng

### 1. Đăng nhập Admin
- Truy cập `/admin/login`
- Nhập username/password
- Chọn role phù hợp

### 2. Quản lý nội dung
- Sử dụng sidebar để điều hướng
- CRUD operations cho từng module
- Upload hình ảnh cho nội dung
- Thiết lập trạng thái active/inactive

### 3. Quản lý người dùng
- Tạo tài khoản admin/editor
- Phân quyền theo module
- Quản lý bảo mật

### 4. Cấu hình hệ thống
- Thiết lập thông tin website
- Cấu hình email, API keys
- Backup/restore database

## Troubleshooting

### 1. Lỗi kết nối database
- Kiểm tra MongoDB đang chạy
- Xác nhận MONGO_URL trong .env
- Kiểm tra firewall, network

### 2. Lỗi upload file
- Kiểm tra quyền ghi thư mục uploads
- Xác nhận kích thước file
- Kiểm tra file type

### 3. Lỗi session
- Xác nhận SESSION_SECRET
- Kiểm tra cookie settings
- Clear browser cache

## Liên hệ hỗ trợ

- Email: admin@hanoitourism.com
- Phone: +84 24 1234 5678
- Website: https://hanoitourism.com

---

**Lưu ý**: Đây là hệ thống quản lý nội dung cho website du lịch Hà Nội. Vui lòng bảo mật thông tin đăng nhập và thường xuyên backup dữ liệu.
