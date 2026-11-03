THIỆP CƯỚI NHẬT & MY — BẢN ĐẦY ĐỦ NHÀ GÁI

Bản này giữ nguyên HTML/CSS/JavaScript và nội dung giao diện khách mời từ website đầy đủ đã duyệt. Chỉ phạm vi file triển khai được thu gọn để không phân phối công cụ quản trị trên VM nhà gái.

PHẠM VI TRIỂN KHAI
- Triển khai nội dung thư mục bride-full/ lên document root của VM nhà gái.
- Không có admin.html, admin.js, admin.css, qr-code.html hoặc SQL quản trị.
- Admin và tiện ích tạo QR chỉ có trong thư mục groom-simple/ trên VM nhà trai.
- File SQL cài đặt quản trị nằm tại ../database/supabase-admin-setup.sql ở gói hai phiên bản; không đưa file này vào document root.

CHẠY LOCAL
Mở thư mục này bằng VS Code/Live Server. Kiểm tra desktop, tablet, mobile, RSVP, bản đồ và sổ lưu bút.

DEPLOY
Dùng job Jenkins riêng cho nhà gái, chỉ đồng bộ nội dung trong thư mục bride-full/. Trước khi phát hành, kiểm tra hostname, HTTPS, cấu hình Supabase và các URL Open Graph/canonical theo domain chính thức.


TRANG PHONG BÌ
- Xem `envelope.html` khi chạy local. Khi deploy qua Nginx, dùng `index envelope.html index.html;` để phong bì là trang mặc định. Nút Mở thiệp chuyển sang `index.html`.
- RSVP ghi `invitation_site = 'bride'` vào bảng `public.rsvps`.
