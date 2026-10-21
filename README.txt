THIỆP CƯỚI ONLINE NHẬT & MY — HƯỚNG DẪN CẬP NHẬT

CẤU TRÚC
- index.html: trang thiệp chính.
- styles.css, design-system.css, responsive.css, layout-system.css: CSS nguồn để chỉnh sửa.
- site.min.css: CSS build dùng khi chạy website; được ghép theo đúng thứ tự styles -> design-system -> responsive -> layout-system.
- site-config.js: nơi chỉnh tên, ngày cưới, ảnh hero, thông tin gia đình và dữ liệu ba địa điểm.
- script.js: tương tác, RSVP, sổ lưu bút, chọn địa điểm/bản đồ, đổi ngôn ngữ.
- supabase-config.js: URL và publishable key của Supabase (chỉ dùng key public/publishable, không dùng service_role).

LAYOUT LOGIC
Các section mang data-layout-block; các khối không tạo border nhìn thấy trên UI. Thứ tự responsive được cấu hình trong layout-system.css qua grid-template-areas.
Breakpoint chính được căn về các ngưỡng 1100, 850, 650, 550 và 350px. Hãy kiểm tra tablet tại 768/820px và 1024px khi duyệt cuối.

DỮ LIỆU HIỆN CÓ
- Ngày cưới đang dùng: 29/11/2026, 10:00 (theo site-config.js).
- Tiệc nhà trai đã có giờ, xóm/xã/tỉnh và Google Maps.
- Lịch trình luôn có đủ 3 box: tiệc nhà trai, tiệc nhà gái và lễ thành hôn. Hai box chưa chốt giờ/địa điểm vẫn hiện tên và biểu tượng, còn các dòng thông tin trống được ẩn; điền eventLocations.ceremony và eventLocations.brideReception khi có thông tin thật.
- Chưa có ảnh album riêng ngoài hai ảnh demo hiện có. Album hiện chỉ hiển thị hai ảnh này, không tạo 10 ô giả. Thay hai src trong index.html bằng ảnh thật khi chốt album.
- Khối NHÀ GÁI trong hero luôn hiển thị để làm chỗ điền sau; cập nhật brideDad, brideMom và brideFamilyAddress trong site-config.js. Khi chưa có tên, nhãn Bố/Mẹ vẫn hiển thị nhưng không có placeholder giả.

SEO/CHIA SẺ
index.html đã có title, description, Open Graph, Twitter Card và favicon. Canonical/og:url/og:image hiện dùng URL tương đối vì hostname triển khai chưa có trong gói nguồn. Trước khi gửi link chính thức qua Zalo/Messenger, thay canonical, og:url, og:image và twitter:image bằng URL tuyệt đối (https://ten-mien-cua-ban/...) của website đã triển khai.

TỐI ƯU
- assets/flowers/*.png và assets/fonts/AngelineVintage.ttf đã được gỡ sau khi xác nhận không còn tham chiếu.
- Nhạc nền đã được nén xuống MP3 96 kbps; vẫn dùng preload="none" để tránh tải trước không cần thiết.
- Supabase JS được ghim phiên bản 2.118.0 và nạp bằng defer theo thứ tự phụ thuộc.
- Lời chúc demo tĩnh đã được gỡ: chỉ hiển thị lời chúc được duyệt từ Supabase. Hai form có honeypot phía client; đây là lớp giảm spam cơ bản, không thay thế RLS/giới hạn phía backend.
- Các source CSS được giữ để dễ bảo trì; website công khai chỉ nạp site.min.css. Hệ màu công khai dùng token --ds-* cho palette và các vai trò màu chính; một số sắc độ dùng riêng cho thành phần/gradient trang trí vẫn được giữ trong source để không làm mất sắc độ thiết kế.

CHẠY THỬ
Mở thư mục bằng VS Code/Live Server hoặc máy chủ static. Kiểm tra desktop, 768px, 820px, 1024px, mobile 390px/360px, iPhone Safari, Samsung Internet và trình duyệt trong Zalo/Facebook trước khi gửi khách.
