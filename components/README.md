# Components

Thư mục này chứa các component có thể tái sử dụng cho website.

## Cấu trúc

```
components/
├── header.html      # Header component với navigation
├── footer.html      # Footer component với social links
└── README.md        # File hướng dẫn này
```

## Cách sử dụng

### 1. Thêm placeholder vào HTML

```html
<!-- Header Component Placeholder -->
<div id="header-placeholder"></div>

<!-- Footer Component Placeholder -->
<div id="footer-placeholder"></div>
```

### 2. Include JavaScript

```html
<script src="js/components.js"></script>
```

### 3. Components sẽ tự động load

Components sẽ được load tự động khi trang được tải.

## Tính năng

### Header Component
- Navigation menu
- Dark mode toggle
- Mobile responsive menu
- Active page highlighting

### Footer Component
- Copyright information
- Social media links
- Consistent styling

## Tùy chỉnh

Để tùy chỉnh components:

1. Chỉnh sửa file HTML tương ứng trong thư mục `components/`
2. Các thay đổi sẽ áp dụng cho tất cả các trang sử dụng component

## Lưu ý

- Components sử dụng fetch API để load, cần chạy trên web server
- Đảm bảo đường dẫn đến components chính xác
- JavaScript components.js phải được include trước các script khác
