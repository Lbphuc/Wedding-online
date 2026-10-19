(function () {
  // Supabase client: uses the public publishable key; never put service_role/secret keys here.
  const supabaseConfig = window.SUPABASE_CONFIG || {};
  const supabaseClient = (() => {
    const sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function') {
      console.error('[Supabase] SDK chưa tải được. Hãy kiểm tra kết nối mạng và script CDN.');
      return null;
    }

    const url = String(supabaseConfig.url || '').trim();
    const publishableKey = String(supabaseConfig.publishableKey || '').trim();
    if (!url.startsWith('https://') || !publishableKey || publishableKey.includes('DAN_PUBLISHABLE_KEY')) {
      console.error('[Supabase] Thiếu Project URL hoặc Publishable key trong supabase-config.js.');
      return null;
    }

    try {
      return sdk.createClient(url, publishableKey);
    } catch (error) {
      console.error('[Supabase] Không khởi tạo được client:', error);
      return null;
    }
  })();

  // Cấu hình song ngữ Anh / Việt
  const i18n = {
    vi: {
      docTitle: "Thiệp cưới | Trang chủ",
      // topNote: "BẢN THỬ NGHIỆM · RSVP ĐÃ KẾT NỐI, SỔ LƯU BÚT ĐANG KIỂM THỬ",
      navHome: "Trang chủ",
      navCountdown: "Đếm ngược",
      navSchedule: "Lịch trình",
      navStory: "Câu chuyện",
      navGallery: "Album ảnh",
      navRsvp: "Xác nhận tham dự <span>↓</span>",
      navGuestbook: "Sổ lưu bút",
      heroEyebrow: "LỄ THÀNH HÔN",
      heroIntro: "Chúng tôi rất hân hạnh được đón tiếp<br class=\"desktop-break\"> và chia sẻ niềm vui trong ngày trọng đại của mình!",
      heroScroll: "Cuộn xuống <span>↓</span>",
      heroPhotoTitle: "VÙNG ẢNH NỀN HERO",
      heroPhotoSub: "Thêm ảnh ngang tại assets/images/wedding-hero.jpg",
      heroPhotoCaption: "Một hành trình, hai trái tim",
      heroGroomFamilyLabel: "NHÀ TRAI",
      heroBrideFamilyLabel: "NHÀ GÁI",
      countdownKicker: "CÙNG ĐẾM NGƯỢC ĐẾN NGÀY VUI",
      countdownTitle: "Thời gian còn lại",
      unitDays: "Ngày",
      unitHours: "Giờ",
      unitMinutes: "Phút",
      unitSeconds: "Giây",
      countdownNote: "Ngày đếm ngược được cấu hình trong <code>tệp thiết lập ngày cưới</code>.",
      storyKicker: "CHUYỆN TÌNH YÊU",
      storyTitle: "<span class=\"title-part\">Câu chuyện</span> <span class=\"title-part\">của chúng tôi</span>",
      storyText1: "Từ những người xa lạ, chúng tôi đã gặp nhau, trở thành bạn, rồi yêu nhau và cùng nhau viết tiếp câu chuyện thanh xuân. Bây giờ, chúng tôi muốn bắt đầu một chương mới — chương của gia đình.",
      storyText2: "Bạn có thể thay đoạn này bằng câu chuyện thật của hai người.",
      storyCta: "Xem album ảnh <span>→</span>",
      storyPhotoBig: "ẢNH KỶ NIỆM",
      storyPhotoSmall: "ẢNH NHỎ",
      storyPhotoSub: "Thay ảnh sau",
      storyGalleryHint: "Nhấn vào hình để mở album ảnh <span aria-hidden=\"true\">↗</span>",
      scheduleKicker: "THỜI GIAN & ĐỊA ĐIỂM",
      scheduleTitle: "Lịch trình & địa điểm",
      groomReceptionTitle: "Tiệc đám vui nhà trai",
      brideReceptionTitle: "Tiệc nhà gái",
      weddingCeremony: "Lễ thành hôn",
      mapPlaceholderTitle: "BẢN ĐỒ ĐỊA ĐIỂM",
      mapPlaceholderSub: "Chọn một địa điểm phía trên để xem bản đồ và hướng dẫn đường đi.",
      mapSelectedKicker: "ĐỊA ĐIỂM ĐANG CHỌN",
      mapDirectionsText: "Bản đồ và đường dẫn sẽ thay đổi theo địa điểm bạn chọn phía trên.",
      mapNotConfigured: "Hãy bổ sung địa chỉ trong site-config.js để hiển thị bản đồ và tạo đường dẫn chỉ đường.",
      mapBtn: "Mở Google Maps <span>↗</span>",
      galleryKicker: "KHOẢNH KHẮC KỶ NIỆM",
      galleryTitle: "Album ảnh cưới",
      gallerySub: "Những khoảnh khắc chúng mình muốn lưu giữ.",
      galleryPhoto1: "ẢNH 01",
      galleryPhoto2: "ẢNH 02",
      galleryPhoto3: "ẢNH 03",
      galleryPhoto4: "ẢNH 04",
      galleryPhoto5: "ẢNH 05",
      galleryPhoto6: "ẢNH 06",
      galleryPhoto7: "ẢNH 07",
      galleryPhoto8: "ẢNH 08",
      galleryPhoto9: "ẢNH 09",
      galleryPhoto10: "ẢNH 10",
      galleryPhotoSub: "Thêm ảnh sau",
      galleryFooterNote: "Tất cả khoảnh khắc được sắp xếp trong cùng một album.",
      rsvpKicker: "PHẢN HỒI THAM DỰ",
      rsvpTitle: "Xác nhận tham dự",
      rsvpSubtitle: "Vui lòng điền thông tin bên dưới để chúng tôi chuẩn bị chu đáo nhất.",
      rsvpLabelName: "Họ và tên <span>*</span>",
      rsvpPhName: "Nhập họ và tên của bạn",
      rsvpLabelPhone: "Số điện thoại <small>(không bắt buộc)</small>",
      rsvpPhPhone: "Nhập số điện thoại",
      rsvpLegendAttend: "Bạn có tham dự không? <span>*</span>",
      rsvpAttendYes: "Có, tôi sẽ tham dự",
      rsvpAttendNo: "Rất tiếc, tôi không thể tham dự",
      rsvpLabelGuests: "Số người đi cùng (bao gồm bạn)",
      rsvpLabelNote: "Ghi chú <small>(tùy chọn)</small>",
      rsvpPhNote: "Lời nhắn, yêu cầu đặc biệt...",
      rsvpBtnSubmit: "Gửi xác nhận <span>→</span>",
      rsvpDisclaimer: "Thông tin của bạn sẽ được gửi để chúng tôi chuẩn bị cho ngày cưới.",
      thankyouTitle: "Cảm ơn bạn",
      thankyouText: "đã dành thời gian<br>để gửi lời chúc và xác nhận tham dự!",
      guestbookKicker: "LỜI CHÚC TỪ TRÁI TIM",
      guestbookTitle: "Sổ lưu bút",
      guestbookSubtitle: "Những lời chúc chân thành của bạn sẽ là món quà vô giá dành cho chúng tôi.",
      guestbookStatus: "<i></i> Đang kết nối sổ lưu bút",
      wishLabelName: "Họ và tên <span>*</span>",
      wishPhName: "Nhập họ tên của bạn",
      wishLabelMessage: "Lời chúc <span>*</span>",
      wishPhMessage: "Gửi lời chúc của bạn...",
      wishBtnSubmit: "Gửi lời chúc <span>→</span>",
      approvedTitle: "Những lời chúc yêu thương",
      approvedSub: "◉ Tự động cập nhật lời chúc đã duyệt",
      wishCard1: "Chúc hai bạn trăm năm hạnh phúc, luôn vui vẻ và thành công trong cuộc sống! <span class=\"wish-heart\">♥</span>",
      wishCard2: "Chúc anh chị luôn yêu thương và đồng hành cùng nhau nhé! <span class=\"wish-heart\">♥</span>",
      wishCard3: "Chúc hai bạn có một khởi đầu thật đẹp và một cuộc sống viên mãn!",
      wishCard4: "Chúc mừng trăm năm hạnh phúc! Chúc hai bạn luôn bên nhau, an yên và bền lâu! <span class=\"wish-heart\">♥</span>",
      realtimeNote: "<span>◉</span> Lời chúc sẽ hiển thị sau khi được duyệt và tự động cập nhật khi có lời chúc mới.",
      footerIntro: "Trân trọng · ",
      footerSub: "RSVP đã kết nối · Lời chúc sẽ hiển thị sau khi được duyệt",
      toastMap: "Vui lòng bổ sung địa chỉ hoặc link Google Maps cho địa điểm đã chọn.",
      toastMusic: "Nút nhạc đang là thành phần giao diện minh họa; chưa có bản nhạc được gắn vào.",
      toastRsvp: "Đã lưu xác nhận tham dự thành công. Cảm ơn bạn!",
      toastRsvpNotConnected: "Chưa kết nối được cơ sở dữ liệu. Vui lòng kiểm tra cấu hình Supabase.",
      toastRsvpFailed: "Chưa lưu được xác nhận. Vui lòng thử lại sau.",
      toastWish: "Lời chúc đã được gửi và đang chờ duyệt. Cảm ơn bạn!",
      toastWishNotConnected: "Chưa kết nối được cơ sở dữ liệu. Vui lòng thử lại sau.",
      toastWishFailed: "Chưa gửi được lời chúc. Vui lòng kiểm tra kết nối và thử lại.",
      toastWishInvalid: "Họ tên cần từ 2–120 ký tự và lời chúc không quá 500 ký tự."
    },
    en: {
      docTitle: "Wedding Invitation | Home",
      topNote: "TEST BUILD · RSVP CONNECTED, GUESTBOOK UNDER TEST",
      navHome: "Home",
      navCountdown: "Countdown",
      navSchedule: "Schedule",
      navStory: "Our Story",
      navGallery: "Gallery",
      navRsvp: "RSVP Now <span>↓</span>",
      navGuestbook: "Guestbook",
      heroEyebrow: "WEDDING INVITATION",
      heroIntro: "We joyfully invite you to join us<br class=\"desktop-break\"> and share the happiness of our special day!",
      heroScroll: "Scroll down <span>↓</span>",
      heroPhotoTitle: "HERO BACKGROUND PHOTO",
      heroPhotoSub: "Add a landscape photo at assets/images/wedding-hero.jpg",
      heroPhotoCaption: "One journey, two hearts",
      heroBrideFamilyLabel: "BRIDE'S FAMILY",
      heroGroomFamilyLabel: "GROOM'S FAMILY",
      countdownKicker: "COUNTING DOWN TO OUR SPECIAL DAY",
      countdownTitle: "Time Remaining",
      unitDays: "Days",
      unitHours: "Hours",
      unitMinutes: "Mins",
      unitSeconds: "Secs",
      countdownNote: "Countdown date is configured in the <code>wedding configuration file</code>.",
      storyKicker: "OUR STORY",
      storyTitle: "<span class=\"title-part\">Our Love</span> <span class=\"title-part\">Story</span>",
      storyText1: "From two strangers who met by chance, we became close friends, fell in love, and shared a beautiful youth together. Today, we are ready to turn the page and begin a brand new chapter — building a loving family.",
      storyText2: "You can replace this section with the couple's real love story.",
      storyCta: "View Photo Gallery <span>→</span>",
      storyPhotoBig: "MEMORIES PHOTO",
      storyPhotoSmall: "MOMENT PHOTO",
      storyPhotoSub: "Replace photo later",
      storyGalleryHint: "Select the photos to open the gallery <span aria-hidden=\"true\">↗</span>",
      scheduleKicker: "SAVE THE DATE",
      scheduleTitle: "Schedule & Locations",
      groomReceptionTitle: "Groom's Family Reception",
      brideReceptionTitle: "Bride's Family Reception",
      weddingCeremony: "Wedding Ceremony",
      mapPlaceholderTitle: "LOCATION MAP",
      mapPlaceholderSub: "Choose a location above to view its map and directions.",
      mapSelectedKicker: "SELECTED LOCATION",
      mapDirectionsText: "The map and directions link update when you choose a location above.",
      mapNotConfigured: "Add the venue address in site-config.js to display the map and directions link.",
      mapBtn: "Open Google Maps <span>↗</span>",
      galleryKicker: "OUR MEMORIES",
      galleryTitle: "Wedding Photo Gallery",
      gallerySub: "Precious moments we cherish forever.",
      galleryPhoto1: "PHOTO 01",
      galleryPhoto2: "PHOTO 02",
      galleryPhoto3: "PHOTO 03",
      galleryPhoto4: "PHOTO 04",
      galleryPhoto5: "PHOTO 05",
      galleryPhoto6: "PHOTO 06",
      galleryPhoto7: "PHOTO 07",
      galleryPhoto8: "PHOTO 08",
      galleryPhoto9: "PHOTO 09",
      galleryPhoto10: "PHOTO 10",
      galleryPhotoSub: "Add photo later",
      galleryFooterNote: "All memories are arranged inside one album.",
      rsvpKicker: "KINDLY REPLY",
      rsvpTitle: "RSVP Confirmation",
      rsvpSubtitle: "Please let us know your attendance so we can welcome you warmly.",
      rsvpLabelName: "Full Name <span>*</span>",
      rsvpPhName: "Enter your full name",
      rsvpLabelPhone: "Phone Number <small>(optional)</small>",
      rsvpPhPhone: "Enter your phone number",
      rsvpLegendAttend: "Will you be attending? <span>*</span>",
      rsvpAttendYes: "Joyfully accept",
      rsvpAttendNo: "Regretfully decline",
      rsvpLabelGuests: "Party size (including yourself)",
      rsvpLabelNote: "Special Notes <small>(optional)</small>",
      rsvpPhNote: "Wishes, dietary restrictions, questions...",
      rsvpBtnSubmit: "Send Confirmation <span>→</span>",
      rsvpDisclaimer: "Your response will be sent to help us prepare for the wedding day.",
      thankyouTitle: "Thank You",
      thankyouText: "for taking the time<br>to send your warm wishes and RSVP!",
      guestbookKicker: "WORDS FROM THE HEART",
      guestbookTitle: "Wedding Guestbook",
      guestbookSubtitle: "Your heartfelt wishes and blessings are the most precious gift to us.",
      guestbookStatus: "<i></i> Connecting guestbook",
      wishLabelName: "Full Name <span>*</span>",
      wishPhName: "Enter your name",
      wishLabelMessage: "Blessing Message <span>*</span>",
      wishPhMessage: "Write your heartfelt wedding wishes...",
      wishBtnSubmit: "Send Wishes <span>→</span>",
      approvedTitle: "Approved Wedding Wishes",
      approvedSub: "◉ Approved wishes update automatically",
      wishCard1: "Wishing you both a lifetime of happiness, joyful laughter, and everlasting love! <span class=\"wish-heart\">♥</span>",
      wishCard2: "May your journey ahead be filled with wonderful adventures and companionship! <span class=\"wish-heart\">♥</span>",
      wishCard3: "Congratulations! Wishing you a splendid wedding and an inspiring life together!",
      wishCard4: "Warmest congratulations on your wedding! May your marriage be blessed with lasting joy! <span class=\"wish-heart\">♥</span>",
      realtimeNote: "<span>◉</span> Wishes appear after approval and update automatically when new approved messages arrive.",
      footerIntro: "With Love · ",
      footerSub: "RSVP connected · Wishes appear after approval",
      toastMap: "Please add the selected location address or Google Maps link in site-config.js.",
      toastMusic: "The music button is an interactive demo; audio track not attached yet.",
      toastRsvp: "Your RSVP has been saved successfully. Thank you!",
      toastRsvpNotConnected: "The database connection is not ready. Please check the Supabase configuration.",
      toastRsvpFailed: "We could not save your RSVP. Please try again later.",
      toastWish: "Your wish was submitted and is awaiting approval. Thank you!",
      toastWishNotConnected: "The database connection is not ready. Please try again later.",
      toastWishFailed: "We could not send your wish. Please check your connection and try again.",
      toastWishInvalid: "Name must be 2–120 characters and the wish must be no longer than 500 characters."
    }
  };

  // Quản lý trạng thái ngôn ngữ
  let currentLang = 'vi';
  try {
    const saved = localStorage.getItem('wedding_lang');
    if (saved === 'vi' || saved === 'en') {
      currentLang = saved;
    }
  } catch (e) {
    // localStorage có thể bị chặn trên iframe / sandbox
  }

  let refreshLocationUI = null;

  function setLanguage(lang) {
    if (!i18n[lang]) return;
    currentLang = lang;
    try {
      localStorage.setItem('wedding_lang', lang);
    } catch (e) { }

    document.documentElement.lang = lang;
    const dict = i18n[lang];

    // Cập nhật tiêu đề trang
    if (dict.docTitle) {
      document.title = dict.docTitle;
    }

    // Cập nhật trạng thái active của nút chuyển đổi
    document.querySelectorAll('.lang-opt').forEach((opt) => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // Cập nhật textContent
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Cập nhật innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Cập nhật placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    if (typeof refreshLocationUI === 'function') refreshLocationUI();
  }

  // Bắt sự kiện chuyển đổi ngôn ngữ
  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const clickedOpt = event.target.closest('.lang-opt');
      if (clickedOpt && clickedOpt.getAttribute('data-lang')) {
        const targetLang = clickedOpt.getAttribute('data-lang');
        if (targetLang !== currentLang) {
          setLanguage(targetLang);
        }
      } else {
        setLanguage(currentLang === 'vi' ? 'en' : 'vi');
      }
    });
  }

  // Đồng bộ cấu hình từ site-config.js
  const config = window.WEDDING_CONFIG || {};
  document.querySelectorAll('[data-config]').forEach((element) => {
    const key = element.getAttribute('data-config');
    if (config[key] !== undefined && config[key] !== null) {
      element.textContent = config[key];
    }
  });

  // HERO CONFIG: đảo layout bằng một biến, không cần sửa HTML/CSS.
  const hero = document.getElementById('hero');
  if (hero) {
    const subjectSide = config.heroSubjectSide === 'left' ? 'left' : 'right';
    hero.dataset.subjectSide = subjectSide;

    // Keep Hero layout configurable without editing CSS: use a validated 60%-80% info width.
    const configuredInfoWidth = String(config.heroInfoWidth || '70%').trim();
    const parsedInfoWidth = Number.parseFloat(configuredInfoWidth);
    const infoWidth = /^\d+(?:\.\d+)?%$/.test(configuredInfoWidth) &&
      parsedInfoWidth >= 60 && parsedInfoWidth <= 80
      ? configuredInfoWidth
      : '70%';
    hero.style.setProperty('--hero-info-width', infoWidth);

    const desktopPosition = String(
      config.heroBackgroundPosition || `${subjectSide} center`
    ).trim();
    const mobilePosition = String(
      config.heroMobileBackgroundPosition || `${subjectSide} center`
    ).trim();
    hero.style.setProperty('--hero-bg-position', desktopPosition);
    hero.style.setProperty('--hero-bg-position-mobile', mobilePosition);

    const heroImagePath = String(config.heroImage || '').trim();
    if (heroImagePath) {
      const heroImage = new Image();
      heroImage.onload = () => {
        // JSON.stringify safely wraps the resolved URL as a CSS url() string.
        hero.style.setProperty('--hero-image', `url(${JSON.stringify(heroImage.src)})`);
        hero.classList.add('has-hero-image');
      };
      heroImage.onerror = () => {
        console.warn(`[Hero] Không tải được ảnh nền "${heroImagePath}". Kiểm tra lại heroImage trong site-config.js.`);
      };
      try {
        heroImage.src = new URL(heroImagePath, document.baseURI).href;
      } catch (error) {
        console.warn('[Hero] Đường dẫn heroImage không hợp lệ:', error);
      }
    }
  }

  // Khởi tạo ngôn ngữ ban đầu
  setLanguage(currentLang);

  // Đồng hồ đếm ngược
  const countdownKeys = ['days', 'hours', 'minutes', 'seconds'];
  const target = new Date(config.weddingDateISO || '').getTime();
  function updateCountdown() {
    if (!Number.isFinite(target)) return;
    const left = Math.max(0, target - Date.now());
    const values = [
      Math.floor(left / 86400000),
      Math.floor((left % 86400000) / 3600000),
      Math.floor((left % 3600000) / 60000),
      Math.floor((left % 60000) / 1000)
    ];
    countdownKeys.forEach((key, i) => {
      const node = document.getElementById(key);
      if (node) node.textContent = String(values[i]).padStart(2, '0');
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Toast thông báo minh họa
  const toast = document.getElementById('toast');
  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = `<span class="toast-icon">🌿</span><span>${message}</span>`;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  }

  // Chọn một trong ba địa điểm; bản đồ và link Google Maps đổi theo lựa chọn.
  const locationCards = Array.from(document.querySelectorAll('[data-location-option]'));
  const mapDisplay = document.getElementById('map-display');
  const mapIframe = document.getElementById('map-iframe');
  const mapPlaceholderState = document.getElementById('map-placeholder-state');
  const mapPlaceholderTitle = document.getElementById('map-placeholder-title');
  const mapPlaceholderSub = document.getElementById('map-placeholder-sub');
  const mapBtn = document.getElementById('map-btn');
  const mapLocationTitle = document.getElementById('map-location-title');
  const mapLocationTime = document.getElementById('map-location-time');
  const mapLocationVenue = document.getElementById('map-location-venue');
  const mapLocationAddress = document.getElementById('map-location-address');
  const mapDirectionsText = document.getElementById('map-directions-text');
  let activeLocationKey = 'groomReception';

  function isPlaceholderValue(value) {
    const text = String(value || '').trim();
    return !text || /^\[.*\]$/.test(text) || /địa chỉ chi tiết|địa điểm tổ chức|thêm địa chỉ/i.test(text);
  }

  function safeHttpsUrl(value) {
    try {
      const parsed = new URL(String(value || '').trim());
      return parsed.protocol === 'https:' ? parsed.href : '';
    } catch (_) {
      return '';
    }
  }

  function buildGoogleMapsDirectionsUrl(placeText) {
    const query = String(placeText || '').trim();
    if (!query || isPlaceholderValue(query)) return '';
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  function buildLegacyGoogleEmbedUrl(placeText) {
    const query = String(placeText || '').trim();
    if (!query || isPlaceholderValue(query)) return '';
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  }

  function getLocationConfig(key) {
    const all = config.eventLocations || {};
    const current = all[key] || {};
    const legacy = {
      groomReception: {
        time: config.groomReceptionTime || config.familyTime,
        venue: config.groomReceptionVenue || config.familyVenue,
        address: config.groomReceptionAddress || config.familyAddress,
        mapUrl: config.groomReceptionMapUrl || config.familyMapUrl,
        mapEmbedUrl: config.groomReceptionMapEmbedUrl || config.familyMapEmbedUrl
      },
      brideReception: {
        time: config.brideReceptionTime || config.receptionTime,
        venue: config.brideReceptionVenue || config.receptionVenue,
        address: config.brideReceptionAddress || config.receptionAddress,
        mapUrl: config.brideReceptionMapUrl || config.receptionMapUrl,
        mapEmbedUrl: config.brideReceptionMapEmbedUrl || config.receptionMapEmbedUrl
      },
      ceremony: {
        time: config.ceremonyTime,
        venue: config.ceremonyVenue,
        address: config.ceremonyAddress,
        mapUrl: config.ceremonyMapUrl,
        mapEmbedUrl: config.ceremonyMapEmbedUrl
      }
    }[key] || {};

    return {
      time: current.time || legacy.time || '',
      venue: current.venue || legacy.venue || '',
      address: current.address || legacy.address || '',
      mapUrl: current.mapUrl || legacy.mapUrl || '',
      mapEmbedUrl: current.mapEmbedUrl || legacy.mapEmbedUrl || ''
    };
  }

  function configureMapFrame(location) {
    if (!mapDisplay || !mapIframe || !mapPlaceholderState) return;

    const mapSearchText = [location.venue, location.address].filter((value) => !isPlaceholderValue(value)).join(', ');
    const explicitEmbed = safeHttpsUrl(location.mapEmbedUrl);
    let embedUrl = '';
    if (explicitEmbed) {
      try {
        const parsed = new URL(explicitEmbed);
        const allowedHost = parsed.hostname === 'maps.google.com' || parsed.hostname === 'www.google.com' || parsed.hostname === 'google.com';
        const allowedPath = parsed.pathname.startsWith('/maps') || parsed.pathname.startsWith('/maps/embed');
        if (allowedHost && allowedPath) embedUrl = parsed.href;
      } catch (_) { }
    }
    if (!embedUrl) embedUrl = buildLegacyGoogleEmbedUrl(mapSearchText);

    if (embedUrl) {
      if (mapIframe.src !== embedUrl) mapIframe.src = embedUrl;
      mapIframe.hidden = false;
      mapPlaceholderState.hidden = true;
      mapDisplay.dataset.mapState = 'loaded';
    } else {
      mapIframe.removeAttribute('src');
      mapIframe.hidden = true;
      mapPlaceholderState.hidden = false;
      mapDisplay.dataset.mapState = 'placeholder';
      if (mapPlaceholderTitle) mapPlaceholderTitle.textContent = i18n[currentLang]?.mapPlaceholderTitle || i18n.vi.mapPlaceholderTitle;
      if (mapPlaceholderSub) mapPlaceholderSub.textContent = i18n[currentLang]?.mapNotConfigured || i18n.vi.mapNotConfigured;
    }

    const customMapUrl = safeHttpsUrl(location.mapUrl);
    const finalMapUrl = customMapUrl || buildGoogleMapsDirectionsUrl(mapSearchText);
    if (mapBtn) {
      if (finalMapUrl) {
        mapBtn.href = finalMapUrl;
        mapBtn.removeAttribute('aria-disabled');
        mapBtn.removeAttribute('tabindex');
        mapBtn.classList.remove('is-disabled');
      } else {
        mapBtn.removeAttribute('href');
        mapBtn.setAttribute('aria-disabled', 'true');
        mapBtn.setAttribute('tabindex', '-1');
        mapBtn.classList.add('is-disabled');
      }
    }
  }

  function renderSelectedLocation(key) {
    const options = {
      groomReception: 'groomReceptionTitle',
      brideReception: 'brideReceptionTitle',
      ceremony: 'weddingCeremony'
    };
    const location = getLocationConfig(key);
    const dict = i18n[currentLang] || i18n.vi;
    activeLocationKey = key;

    locationCards.forEach((card) => {
      const cardKey = card.dataset.locationOption;
      const selected = cardKey === key;
      const cardLocation = getLocationConfig(cardKey);
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', String(selected));

      const timeNode = card.querySelector('[data-location-field="time"]');
      const venueNode = card.querySelector('[data-location-field="venue"]');
      const addressNode = card.querySelector('[data-location-field="address"]');
      const fallbackVenue = cardKey === 'groomReception' ? '[Địa điểm nhà trai]' : cardKey === 'brideReception' ? '[Địa điểm nhà gái]' : '[Địa điểm lễ thành hôn]';
      if (timeNode) timeNode.textContent = cardLocation.time && !isPlaceholderValue(cardLocation.time) ? cardLocation.time : (currentLang === 'en' ? 'Time to be confirmed' : '[Giờ] · [Ngày cưới]');
      if (venueNode) venueNode.textContent = cardLocation.venue && !isPlaceholderValue(cardLocation.venue) ? cardLocation.venue : (currentLang === 'en' ? 'Venue to be updated' : fallbackVenue);
      if (addressNode) addressNode.textContent = cardLocation.address && !isPlaceholderValue(cardLocation.address) ? cardLocation.address : (currentLang === 'en' ? 'Address to be updated' : '[Địa chỉ chi tiết]');
    });

    if (mapLocationTitle) mapLocationTitle.textContent = dict[options[key]] || dict.mapDirectionsTitle;
    if (mapLocationTime) mapLocationTime.textContent = location.time && !isPlaceholderValue(location.time) ? location.time : '';
    if (mapLocationVenue) {
      const venue = location.venue && !isPlaceholderValue(location.venue) ? location.venue : '';
      mapLocationVenue.textContent = venue;
      mapLocationVenue.hidden = !venue;
    }
    if (mapLocationAddress) {
      const address = location.address && !isPlaceholderValue(location.address) ? location.address : '';
      mapLocationAddress.textContent = address;
      mapLocationAddress.hidden = !address;
    }
    if (mapDirectionsText) {
      const hasLocation = [location.venue, location.address].some((value) => value && !isPlaceholderValue(value));
      mapDirectionsText.textContent = hasLocation
        ? dict.mapDirectionsText
        : (dict.mapNotConfigured || dict.mapDirectionsText);
    }

    if (mapPlaceholderTitle) mapPlaceholderTitle.textContent = dict.mapPlaceholderTitle;
    configureMapFrame(location);
  }

  refreshLocationUI = () => renderSelectedLocation(activeLocationKey);
  locationCards.forEach((card) => {
    card.addEventListener('click', () => renderSelectedLocation(card.dataset.locationOption));
  });
  if (mapBtn) {
    mapBtn.addEventListener('click', (event) => {
      if (mapBtn.getAttribute('aria-disabled') === 'true' || !mapBtn.href) {
        event.preventDefault();
        showToast(i18n[currentLang]?.toastMap || i18n.vi.toastMap);
      }
    });
  }
  renderSelectedLocation(activeLocationKey);

  // Xử lý nút nhạc minh họa
  document.querySelectorAll('.music-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const pill = button.querySelector('.toggle-pill');
      if (pill) pill.classList.toggle('active');
      const msg = i18n[currentLang]?.toastMusic || i18n.vi.toastMusic;
      showToast(msg);
    });
  });

  // Form RSVP (xác nhận tham dự)
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    const guestGroup = document.getElementById('guest-count-group');
    const guestSelect = document.getElementById('guest-count-select');

    function updateGuestCountState() {
      const selected = rsvpForm.querySelector('input[name="attending"]:checked');
      const isAttending = selected ? selected.value === 'yes' : true;
      if (guestGroup) {
        guestGroup.classList.toggle('is-disabled', !isAttending);
      }
      if (guestSelect) {
        guestSelect.disabled = !isAttending;
      }
    }

    rsvpForm.querySelectorAll('input[name="attending"]').forEach((radio) => {
      radio.addEventListener('change', updateGuestCountState);
    });
    updateGuestCountState();

    rsvpForm.addEventListener('reset', () => {
      setTimeout(updateGuestCountState, 0);
    });

    rsvpForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!rsvpForm.reportValidity()) return;

      if (!supabaseClient) {
        showToast(i18n[currentLang]?.toastRsvpNotConnected || i18n.vi.toastRsvpNotConnected);
        return;
      }

      const guestName = String(rsvpForm.elements.namedItem('guestName')?.value || '').trim();
      const phone = String(rsvpForm.elements.namedItem('phone')?.value || '').trim();
      const note = String(rsvpForm.elements.namedItem('note')?.value || '').trim();
      const attendanceInput = rsvpForm.querySelector('input[name="attending"]:checked');
      const attending = attendanceInput ? attendanceInput.value === 'yes' : true;
      const guestCount = attending ? Number(guestSelect?.value || 1) : 0;

      if (guestName.length < 2 || guestName.length > 120) {
        showToast(currentLang === 'en' ? 'Please enter a name between 2 and 120 characters.' : 'Họ tên phải có từ 2 đến 120 ký tự.');
        return;
      }
      if (phone.length > 30 || note.length > 1000) {
        showToast(currentLang === 'en' ? 'Please check the phone number and note length.' : 'Vui lòng kiểm tra độ dài số điện thoại và ghi chú.');
        return;
      }
      if (attending && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 5)) {
        showToast(currentLang === 'en' ? 'Party size must be between 1 and 5.' : 'Số người tham dự phải từ 1 đến 5.');
        return;
      }

      const payload = {
        guest_name: guestName,
        phone: phone || null,
        attending,
        guest_count: guestCount,
        note: note || null
      };

      const submitButton = rsvpForm.querySelector('button[type="submit"]');
      const originalButtonHTML = submitButton ? submitButton.innerHTML : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
      }

      try {
        // Do not request returned rows: anonymous guests are intentionally not allowed to read RSVPs.
        const { error } = await supabaseClient.from('rsvps').insert(payload);
        if (error) throw error;

        showToast(i18n[currentLang]?.toastRsvp || i18n.vi.toastRsvp);
        rsvpForm.reset();
        updateGuestCountState();
      } catch (error) {
        console.error('[RSVP] Supabase insert failed:', error);
        showToast(i18n[currentLang]?.toastRsvpFailed || i18n.vi.toastRsvpFailed);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.innerHTML = originalButtonHTML;
        }
      }
    });
  }

  // Sổ lưu bút: gửi lời chúc, đọc lời chúc đã duyệt và đồng bộ realtime.
  const wishForm = document.getElementById('wish-form');
  const wishMessage = wishForm && wishForm.elements.namedItem('wishMessage');
  const wishCount = document.getElementById('char-count');
  const wishesGrid = document.getElementById('wishes-grid');
  const guestbookStatus = document.querySelector('.guestbook-heading .status-pill');
  const realtimeNote = document.querySelector('.realtime-note');
  let latestApprovedWishes = [];
  let wishRealtimeChannel = null;

  function setGuestbookStatus(label, state) {
    if (!guestbookStatus) return;
    // Use only static labels authored in this script; never inject user-provided text.
    guestbookStatus.replaceChildren();
    const dot = document.createElement('i');
    dot.style.backgroundColor = state === 'live' ? '#6e9b7a' : state === 'offline' ? '#cf7777' : '#d99b9c';
    guestbookStatus.append(dot, document.createTextNode(` ${label}`));
  }

  function formatWishDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    try {
      return new Intl.DateTimeFormat(currentLang === 'en' ? 'en-US' : 'vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch (_) {
      return date.toLocaleString();
    }
  }

  function renderApprovedWishes(wishes) {
    if (!wishesGrid) return;
    wishesGrid.replaceChildren();

    if (!wishes.length) {
      const empty = document.createElement('div');
      empty.className = 'wish-empty';
      empty.style.cssText = 'width:100%;box-sizing:border-box;padding:28px 18px;text-align:center;border:1px dashed #ddd6cb;border-radius:12px;color:#78877c;font-size:13px;background:rgba(255,253,249,.6);';
      empty.textContent = currentLang === 'en'
        ? 'There are no approved wishes yet. Be the first to leave a message!'
        : 'Chưa có lời chúc nào được duyệt. Hãy gửi lời chúc đầu tiên nhé!';
      wishesGrid.appendChild(empty);
      return;
    }

    const avatarClasses = ['avatar-one', 'avatar-two', 'avatar-three', 'avatar-four'];
    wishes.forEach((wish, index) => {
      const card = document.createElement('article');
      card.className = 'wish-card';

      const meta = document.createElement('div');
      meta.className = 'wish-meta';
      const avatar = document.createElement('span');
      avatar.className = `avatar ${avatarClasses[index % avatarClasses.length]}`;
      avatar.textContent = Array.from(String(wish.guest_name || '?').trim())[0] || '?';
      avatar.setAttribute('aria-hidden', 'true');

      const details = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = String(wish.guest_name || '');
      const time = document.createElement('small');
      time.textContent = formatWishDate(wish.created_at);
      details.append(name, time);
      meta.append(avatar, details);

      const message = document.createElement('p');
      // textContent prevents HTML entered in a wish from being executed as markup.
      message.textContent = String(wish.message || '');
      const heart = document.createElement('span');
      heart.className = 'wish-heart';
      heart.textContent = ' ♥';
      heart.setAttribute('aria-hidden', 'true');
      message.appendChild(heart);

      card.append(meta, message);
      wishesGrid.appendChild(card);
    });
  }

  async function loadApprovedWishes(options = {}) {
    if (!supabaseClient || !wishesGrid) return;
    const quiet = options.quiet === true;
    try {
      const { data, error } = await supabaseClient
        .from('wishes')
        .select('id, guest_name, message, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      latestApprovedWishes = Array.isArray(data) ? data : [];
      renderApprovedWishes(latestApprovedWishes);
      if (!quiet) {
        const label = currentLang === 'en' ? 'Guestbook connected' : 'Đã tải lời chúc';
        setGuestbookStatus(label, 'live');
      }
    } catch (error) {
      console.error('[Guestbook] Không tải được lời chúc đã duyệt:', error);
      if (!quiet) {
        const label = currentLang === 'en' ? 'Could not load wishes' : 'Chưa tải được lời chúc';
        setGuestbookStatus(label, 'offline');
        wishesGrid.replaceChildren();
        const errorState = document.createElement('div');
        errorState.className = 'wish-empty';
        errorState.style.cssText = 'width:100%;box-sizing:border-box;padding:28px 18px;text-align:center;border:1px dashed #ddd6cb;border-radius:12px;color:#78877c;font-size:13px;';
        errorState.textContent = currentLang === 'en'
          ? 'Wishes could not be loaded. Please refresh the page later.'
          : 'Chưa tải được lời chúc. Vui lòng tải lại trang sau.';
        wishesGrid.appendChild(errorState);
      }
    }
  }

  function startWishRealtime() {
    if (!supabaseClient || wishRealtimeChannel) return;
    wishRealtimeChannel = supabaseClient
      .channel('public-wishes-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wishes'
      }, async () => {
        // Only query rows allowed by the public SELECT policy (approved wishes).
        await loadApprovedWishes({ quiet: true });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setGuestbookStatus(
            currentLang === 'en' ? 'Realtime connected' : 'Chúc bạn vui vẻ',
            'live'
          );
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setGuestbookStatus(
            currentLang === 'en' ? 'Realtime unavailable' : 'Realtime chưa khả dụng',
            'offline'
          );
          console.warn('[Guestbook] Realtime status:', status);
        }
      });
  }

  if (wishMessage && wishCount) {
    wishMessage.addEventListener('input', () => {
      wishCount.textContent = String(wishMessage.value.length);
    });
  }

  if (wishForm) {
    wishForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!wishForm.reportValidity()) return;

      if (!supabaseClient) {
        showToast(i18n[currentLang]?.toastWishNotConnected || i18n.vi.toastWishNotConnected);
        return;
      }

      const nameInput = wishForm.elements.namedItem('wishName');
      const messageInput = wishForm.elements.namedItem('wishMessage');
      const wishName = String(nameInput?.value || '').trim();
      const messageText = String(messageInput?.value || '').trim();

      if (wishName.length < 2 || wishName.length > 120 || messageText.length < 1 || messageText.length > 500) {
        showToast(i18n[currentLang]?.toastWishInvalid || i18n.vi.toastWishInvalid);
        return;
      }

      const submitButton = wishForm.querySelector('button[type="submit"]');
      const originalButtonHTML = submitButton ? submitButton.innerHTML : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
      }

      try {
        // is_approved is intentionally omitted; the database default is false.
        // Do not use .select(): anonymous guests cannot read unapproved wishes.
        const { error } = await supabaseClient.from('wishes').insert({
          guest_name: wishName,
          message: messageText
        });
        if (error) throw error;

        showToast(i18n[currentLang]?.toastWish || i18n.vi.toastWish);
        wishForm.reset();
        if (wishCount) wishCount.textContent = '0';
      } catch (error) {
        console.error('[Guestbook] Supabase insert failed:', error);
        showToast(i18n[currentLang]?.toastWishFailed || i18n.vi.toastWishFailed);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.innerHTML = originalButtonHTML;
        }
      }
    });
  }

  if (supabaseClient && wishesGrid) {
    // Replace illustrative design cards with database-backed content.
    const loading = document.createElement('div');
    loading.className = 'wish-empty';
    loading.style.cssText = 'width:100%;box-sizing:border-box;padding:28px 18px;text-align:center;color:#78877c;font-size:13px;';
    loading.textContent = currentLang === 'en' ? 'Loading approved wishes…' : 'Đang tải lời chúc đã duyệt…';
    wishesGrid.replaceChildren(loading);
    setGuestbookStatus(currentLang === 'en' ? 'Connecting…' : 'Đang kết nối…');
    loadApprovedWishes().then(startWishRealtime);
  }

  // Keep both complete names on one line without clipping, including narrow Android screens.
  const coupleHeading = document.querySelector('.hero h1.couple-names');
  if (coupleHeading) {
    const fitCoupleNames = () => {
      const names = [...coupleHeading.querySelectorAll('.couple-name')];
      const ampersand = coupleHeading.querySelector('.ampersand');
      if (names.length !== 2 || !ampersand) return;
      names.forEach((name) => { name.style.fontSize = ''; });
      const styles = getComputedStyle(coupleHeading);
      const baseSize = parseFloat(getComputedStyle(names[0]).fontSize) || 16;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      const fontFamily = getComputedStyle(names[0]).fontFamily;
      const fontWeight = getComputedStyle(names[0]).fontWeight;
      const fontStyle = getComputedStyle(names[0]).fontStyle;
      context.font = `${fontStyle} ${fontWeight} ${baseSize}px ${fontFamily}`;
      const naturalNamesWidth = names.reduce((sum, name) => sum + context.measureText(name.textContent.trim()).width, 0);
      const ampWidth = ampersand.getBoundingClientRect().width || baseSize * .7;
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      const available = coupleHeading.clientWidth - ampWidth - gap * 2 - 8;
      if (naturalNamesWidth > available) {
        const minSize = window.matchMedia('(max-width: 350px)').matches ? 13 : (window.matchMedia('(max-width: 720px)').matches ? 14 : 18);
        const fittedSize = Math.max(minSize, baseSize * available / naturalNamesWidth);
        names.forEach((name) => { name.style.fontSize = `${fittedSize}px`; });
      }
    };
    fitCoupleNames();
    if ('ResizeObserver' in window) new ResizeObserver(fitCoupleNames).observe(coupleHeading);
    window.addEventListener('resize', fitCoupleNames, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCoupleNames);
  }

  // Gallery is initially hidden; reveal it from the story photo area, story CTA, or header nav.
  const gallerySection = document.getElementById('gallery');
  const storyGalleryTrigger = document.getElementById('story-gallery-trigger');

  function revealGallery({ scroll = true, updateHash = true } = {}) {
    if (!gallerySection) return;
    gallerySection.hidden = false;
    if (storyGalleryTrigger) storyGalleryTrigger.setAttribute('aria-expanded', 'true');
    if (updateHash && window.location.hash !== '#gallery') {
      try { history.replaceState(null, '', '#gallery'); } catch (error) { /* Some embedded previews block history changes. */ }
    }
    if (scroll) {
      requestAnimationFrame(() => gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  if (storyGalleryTrigger) {
    storyGalleryTrigger.addEventListener('click', () => revealGallery());
    storyGalleryTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        revealGallery();
      }
    });
  }

  // The header and text link can also reveal the gallery, even while it is hidden.
  document.querySelectorAll('a[href="#gallery"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      revealGallery();
    });
  });

  // If a visitor opens a copied #gallery link, reveal the section on initial load.
  if (window.location.hash === '#gallery') {
    revealGallery({ scroll: true, updateHash: false });
  }

  // Highlight thanh điều hướng theo scroll vị trí trên trang chủ
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta)');
  if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}` || (id === 'hero' && href === '#hero')) {
              navLinks.forEach((l) => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    sections.forEach((s) => observer.observe(s));
  }
})();
