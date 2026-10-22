/* Sửa thông tin thiệp tại file này. Để trống trường chưa chốt; giao diện sẽ không hiển thị placeholder cho khách. */
window.WEDDING_CONFIG = {
  groomName: "Lưu Long Nhật",
  brideName: "Nguyễn Thảo My",
  groomInitial: "Nhật",
  brideInitial: "My",
  // HERO IMAGE: đặt ảnh ngang tại assets/images/wedding-hero.jpg rồi điền đúng đường dẫn dưới đây.
  heroImage: "assets/images/wedding-hero.jpg",
  // Ảnh dành riêng cho mobile, hiển thị phía trên nội dung thiệp.
  heroMobileImage: "assets/images/wedding-mobile.jpg",
  // Vị trí cô dâu/chú rể trong ảnh: "right" = ảnh người bên phải, thông tin bên trái;
  // "left" = ảnh người bên trái, thông tin tự chuyển sang bên phải.
  heroSubjectSide: "right",
  // Tỷ lệ chiều ngang dành cho thông tin (60%-80% hợp lý; mặc định 70%). Phần còn lại dành cho ảnh/chủ thể.
  heroInfoWidth: "70%",
  // Để trống để tự căn ảnh theo heroSubjectSide; có thể thử "70% center" nếu cần tinh chỉnh.
  heroBackgroundPosition: "left center",
  // Vị trí riêng trên mobile; để trống để tự căn theo heroSubjectSide.
  heroMobileBackgroundPosition: "center center",
  // Ba dòng thời gian ở khu vực thiệp chính.
  eventTimeDisplay: "Được tổ chức vào 10 giờ 30",
  dateDisplay: "CHỦ NHẬT, NGÀY 29 THÁNG 11 NĂM 2026",
  lunarDateDisplay: "Tức ngày 21 tháng 10 năm Bính Ngọ",
  // English versions displayed when the visitor selects EN.
  eventTimeDisplayEn: "The ceremony begins at 10:30 AM",
  dateDisplayEn: "SUNDAY, NOVEMBER 29, 2026",
  lunarDateDisplayEn: "Lunar date: the 21st day of the 10th lunar month, Year of the Horse",
  // Ngày minh họa để đồng hồ countdown chạy. Hãy thay khi đã chốt ngày cưới.
  weddingDateISO: "2026-11-29T10:00:00+07:00",
  venue: "",
  address: "",
  familyTime: "",
  familyVenue: "",
  familyAddress: "",
  ceremonyTime: "",
  ceremonyVenue: "",
  ceremonyAddress: "",
  receptionTime: "",
  receptionVenue: "",
  receptionAddress: "",
  // THÔNG TIN NHÀ GÁI TRÊN HERO: điền tên bố/mẹ và địa chỉ tại đây.
  // Khối NHÀ GÁI vẫn hiển thị sẵn; các giá trị đang để trống là chỗ chờ bạn cập nhật.
  // Nhãn Bố/Mẹ hoặc Dad/Mom nằm trong script.js và tự đổi theo ngôn ngữ.
  brideDad: "Nguyễn Minh Hồng",
  brideMom: "Thái Thị Khánh Hậu",
  brideFamilyAddress: "Xóm Hải Đông - Xã Diễn Châu - Tỉnh Nghệ An",
  groomDad: "Lưu Lương Điền",
  groomMom: "Phạm Thị Lý",
  groomFamilyAddress: "Xóm Tùng Lâm - Xã Tân Châu - Tỉnh Nghệ An",
  // ĐỊA ĐIỂM: chỉ điền tên địa danh vào hamlet / commune / province.
  // Không cần tự gõ nhãn "Xóm", "Xã", "Tỉnh"; website tự thêm và tự dịch VI/EN.
  // venue là tên địa điểm cụ thể nếu cần (ví dụ tên nhà hàng); có thể để trống.
  // address chỉ dành cho tương thích ngược với cấu hình cũ; ưu tiên ba trường địa danh bên dưới.
  // CẢ BA BOX LỊCH TRÌNH LUÔN HIỂN THỊ.
  // Điền time, venue, hamlet/commune/province hoặc address, mapUrl và mapEmbedUrl
  // vào từng box tương ứng; trường để trống sẽ không tạo placeholder giả trên giao diện.
  eventLocations: {
    groomReception: {
      time: "10:30 · 29/11/2026",
      venue: "",
      hamlet: "Tùng Lâm",
      commune: "Tân Châu",
      province: "Nghệ An",
      address: "",
      mapUrl: "https://maps.app.goo.gl/HqGPnARgWKSCpEuGA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d973.6642764518383!2d105.56728551625493!3d18.937481217129566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313763001b0a3075%3A0x8e496874cc82ccbe!2zU8OibiBiw7NuZyB4w7NtIDUgdMOieSB0aOG7jQ!5e0!3m2!1svi!2s!4v1792677919650!5m2!1svi!2s"
    },
    ceremony: {
      time: "09:30 - 28/10/2026",
      venue: "Tư gia nhà gái",
      hamlet: "Hải Đông",
      commune: "Diễn Châu",
      province: "Nghệ An",
      address: "",
      mapUrl: "",
      mapEmbedUrl: ""
    },
    brideReception: {
      time: "16:00 - 28/11/2026",
      venue: "Khách sạn Minh Phú Diamond Palace",
      hamlet: "Ngọc Tân",
      commune: "Diễn Châu",
      province: "Nghệ An",
      address: "",
      mapUrl: "https://maps.app.goo.gl/CQd5x6Jt7meJqwLy8",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.5005760703284!2d105.59355247564699!3d18.997651454426695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31377b46484a5c81%3A0x8d6520c10448cf80!2zS2jDoWNoIFPhuqFuIE1pbmggUGjDuiBEaWFtb25kIFBhbGFjZQ!5e0!3m2!1svi!2s!4v1792677860188!5m2!1svi!2s"
    }
  }

};
