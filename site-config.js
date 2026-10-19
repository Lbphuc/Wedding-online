/* Sửa thông tin thiệp tại file này; các trường chưa có thông tin giữ nguyên dạng mẫu. */
window.WEDDING_CONFIG = {
  groomName: "Lưu Long Nhật",
  brideName: "Nguyễn Thảo My",
  groomInitial: "Nhật",
  brideInitial: "My",
  // HERO IMAGE: đặt ảnh ngang tại assets/images/wedding-hero.jpg rồi điền đúng đường dẫn dưới đây.
  heroImage: "",
  // Vị trí cô dâu/chú rể trong ảnh: "right" = ảnh người bên phải, thông tin bên trái;
  // "left" = ảnh người bên trái, thông tin tự chuyển sang bên phải.
  heroSubjectSide: "right",
  // Tỷ lệ chiều ngang dành cho thông tin (60%-80% hợp lý; mặc định 70%). Phần còn lại dành cho ảnh/chủ thể.
  heroInfoWidth: "70%",
  // Để trống để tự căn ảnh theo heroSubjectSide; có thể thử "70% center" nếu cần tinh chỉnh.
  heroBackgroundPosition: "",
  // Vị trí riêng trên mobile; để trống để tự căn theo heroSubjectSide.
  heroMobileBackgroundPosition: "",
  dateDisplay: "NGÀY 29 THÁNG 11 NĂM 2026",
  // Ngày minh họa để đồng hồ countdown chạy. Hãy thay khi đã chốt ngày cưới.
  weddingDateISO: "2026-11-29T10:00:00+07:00",
  venue: "[Tên địa điểm tổ chức]",
  address: "[Địa chỉ chi tiết]",
  familyTime: "[Giờ] · [Ngày cưới]",
  familyVenue: "[Địa điểm lễ gia tiên]",
  familyAddress: "[Địa chỉ chi tiết]",
  ceremonyTime: "[Giờ] · [Ngày cưới]",
  ceremonyVenue: "[Địa điểm lễ thành hôn]",
  ceremonyAddress: "[Địa chỉ chi tiết]",
  receptionTime: "[Giờ] · [Ngày cưới]",
  receptionVenue: "[Tên nhà hàng]",
  receptionAddress: "[Địa chỉ chi tiết]",
  brideDad: "Bố: ",
  brideMom: "Mẹ: ",
  brideFamilyAddress: "[Địa chỉ nhà gái]",
  groomDad: "Bố: Lưu Lương Điền ",
  groomMom: "Mẹ: Phạm Thị Lý ",
  groomFamilyAddress: "Xóm Tùng Lâm - xã tân Châu - tỉnh Nghệ An",
  // Thêm tiếp eventLocations để cấu hình ba địa điểm.
  // Để chuỗi rỗng thì code có thể dùng các trường tương thích cũ (familyTime/receptionTime/ceremonyTime).
  eventLocations: {
    groomReception: {
      time: "10:00 · 29/11/2026",
      venue: "Xóm Tùng Lâm",
      address: "Xã Tân Châu - Nghệ An",
      mapUrl: "https://maps.app.goo.gl/3XKnttL4RPGCPNcYA",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d276.11420006183016!2d105.56943191722083!3d18.934885059615347!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDU2JzA1LjgiTiAxMDXCsDM0JzEwLjQiRQ!5e0!3m2!1svi!2s!4v1791895921286!5m2!1svi!2s"
    },
    ceremony: {
      time: "",
      venue: "",
      address: "",
      mapUrl: "",
      mapEmbedUrl: ""
    },
    brideReception: {
      time: "",
      venue: "",
      address: "",
      mapUrl: "",
      mapEmbedUrl: ""
    }
  }

};
