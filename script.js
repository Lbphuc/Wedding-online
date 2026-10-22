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
      docTitle: "Thiệp cưới Nhật & My | Lưu Long Nhật & Nguyễn Thảo My",
      navHome: "Trang chủ",
      navCountdown: "Đếm ngược",
      navSchedule: "Lịch trình",
      navStory: "Câu chuyện",
      navGallery: "Album ảnh",
      navRsvp: "Xác nhận tham dự <span>↓</span>",
      navGuestbook: "Sổ lưu bút",
      heroRsvp: "Xác nhận tham dự <span aria-hidden=\"true\">↓</span>",
      heroEyebrow: "LỄ THÀNH HÔN",
      heroIntro: "Chúng tôi rất hân hạnh được đón tiếp<br class=\"desktop-break\"> và chia sẻ niềm vui trong ngày trọng đại của mình!",
      heroGroomFamilyLabel: "NHÀ TRAI",
      heroBrideFamilyLabel: "NHÀ GÁI",
      groomDadLabel: "Bố:",
      groomMomLabel: "Mẹ:",
      brideDadLabel: "Bố:",
      brideMomLabel: "Mẹ:",
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

      storyCta: "Xem album ảnh <span>→</span>",
      storyGalleryHint: "Nhấn vào hình để mở album ảnh <span aria-hidden=\"true\">↗</span>",
      scheduleKicker: "THỜI GIAN & ĐỊA ĐIỂM",
      scheduleTitle: "Lịch trình & địa điểm",
      groomReceptionTitle: "Tiệc đám vui nhà trai",
      brideReceptionTitle: "Tiệc đám vui nhà gái",
      weddingCeremony: "Lễ ăn hỏi",
      mapPlaceholderTitle: "BẢN ĐỒ ĐỊA ĐIỂM",
      mapPlaceholderSub: "Chọn một địa điểm phía trên để xem bản đồ và hướng dẫn đường đi.",
      mapSelectedKicker: "ĐỊA ĐIỂM ĐANG CHỌN",
      mapDirectionsText: "Bản đồ và đường dẫn sẽ thay đổi theo địa điểm bạn chọn phía trên.",
      mapNotConfigured: "Hãy điền Xóm, Xã, Tỉnh hoặc địa chỉ trong site-config.js để hiển thị bản đồ và đường dẫn chỉ đường.",
      locationHamletLabel: "Xóm",
      locationCommuneLabel: "Xã",
      locationProvinceLabel: "Tỉnh",
      mapBtn: "Mở Google Maps <span>↗</span>",
      galleryKicker: "KHOẢNH KHẮC KỶ NIỆM",
      galleryTitle: "Album ảnh cưới",
      gallerySub: "Những khoảnh khắc chúng mình muốn lưu giữ.",
      galleryFooterNote: "Tất cả khoảnh khắc được sắp xếp trong cùng một album.",
      rsvpKicker: "PHẢN HỒI THAM DỰ",
      rsvpTitle: "Quý khách sẽ đến chứ ?",
      rsvpSubtitle: "Sự hiện diện của Quý khách sẽ làm ngày vui của chúng tôi thêm trọn vẹn. Xin vui lòng xác nhận tham dự bên dưới.",
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
      thankyouTitle: "Cảm ơn bạn",
      thankyouText: "đã dành thời gian<br>để gửi lời chúc và xác nhận tham dự!",
      guestbookKicker: "LỜI CHÚC TỪ TRÁI TIM",
      guestbookTitle: "Sổ lưu bút",
      guestbookSubtitle: "Những lời chúc chân thành của bạn sẽ là món quà vô giá dành cho chúng tôi.",
      guestbookStatus: "<i></i> Đang tải lời chúc đã duyệt…",
      wishLabelName: "Họ và tên <span>*</span>",
      wishPhName: "Nhập họ tên của bạn",
      wishLabelMessage: "Lời chúc <span>*</span>",
      wishPhMessage: "Gửi lời chúc của bạn...",
      wishBtnSubmit: "Gửi lời chúc <span>→</span>",
      approvedTitle: "Lời chúc phúc yêu thương được gửi tới Dâu Rể",
      approvedSub: "◉ Tự động cập nhật lời chúc đã duyệt",
      footerIntro: "Trân trọng · ",
      toastMap: "Vui lòng bổ sung địa chỉ hoặc link Google Maps cho địa điểm đã chọn.",
      toastMusic: "Không phát được nhạc. Vui lòng thử lại sau.",
      toastRsvp: "Đã lưu xác nhận tham dự thành công. Cảm ơn bạn!",
      toastRsvpNotConnected: "Chưa kết nối được cơ sở dữ liệu. Vui lòng kiểm tra cấu hình Supabase.",
      toastRsvpFailed: "Chưa lưu được xác nhận. Vui lòng thử lại sau.",
      toastWish: "Lời chúc đã được gửi và đang chờ duyệt. Cảm ơn bạn!",
      toastWishNotConnected: "Chưa kết nối được cơ sở dữ liệu. Vui lòng thử lại sau.",
      toastWishFailed: "Chưa gửi được lời chúc. Vui lòng kiểm tra kết nối và thử lại.",
      toastWishInvalid: "Họ tên cần từ 2–120 ký tự và lời chúc không quá 500 ký tự."
    },
    en: {
      docTitle: "Wedding Invitation | Nhat & My",
      navHome: "Home",
      navCountdown: "Countdown",
      navSchedule: "Schedule",
      navStory: "Our Story",
      navGallery: "Gallery",
      navRsvp: "RSVP Now <span>↓</span>",
      navGuestbook: "Guestbook",
      heroRsvp: "Confirm attendance <span aria-hidden=\"true\">↓</span>",
      heroEyebrow: "WEDDING CEREMONY",
      heroIntro: "We joyfully invite you to join us<br class=\"desktop-break\"> and share the happiness of our special day!",
      heroBrideFamilyLabel: "BRIDE'S FAMILY",
      heroGroomFamilyLabel: "GROOM'S FAMILY",
      groomDadLabel: "Dad:",
      groomMomLabel: "Mom:",
      brideDadLabel: "Dad:",
      brideMomLabel: "Mom:",
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

      storyCta: "View Photo Gallery <span>→</span>",
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
      mapNotConfigured: "Fill in Hamlet, Commune, Province, or the full address in site-config.js to display the map and directions link.",
      locationHamletLabel: "Hamlet",
      locationCommuneLabel: "Commune",
      locationProvinceLabel: "Province",
      mapBtn: "Open Google Maps <span>↗</span>",
      galleryKicker: "OUR MEMORIES",
      galleryTitle: "Wedding Photo Gallery",
      gallerySub: "Precious moments we cherish forever.",
      galleryFooterNote: "All memories are arranged inside one album.",
      rsvpKicker: "KINDLY REPLY",
      rsvpTitle: "Will you be coming ?",
      rsvpSubtitle: "Your presence will make our wedding day even more special. Please confirm your attendance below.",
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
      thankyouTitle: "Thank You",
      thankyouText: "for taking the time<br>to send your warm wishes and RSVP!",
      guestbookKicker: "WORDS FROM THE HEART",
      guestbookTitle: "Wedding Guestbook",
      guestbookSubtitle: "Your heartfelt wishes and blessings are the most precious gift to us.",
      guestbookStatus: "<i></i> Loading approved wishes…",
      wishLabelName: "Full Name <span>*</span>",
      wishPhName: "Enter your name",
      wishLabelMessage: "Blessing Message <span>*</span>",
      wishPhMessage: "Write your heartfelt wedding wishes...",
      wishBtnSubmit: "Send Wishes <span>→</span>",
      approvedTitle: "Loving wishes sent to the bride and groom",
      approvedSub: "◉ Approved wishes update automatically",
      footerIntro: "With Love · ",
      toastMap: "Please add the selected location address or Google Maps link in site-config.js.",
      toastMusic: "Music could not be played. Please try again.",
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

    // Localized fields from site-config.js (English uses a separate *En key).
    document.querySelectorAll('[data-config][data-config-en]').forEach((el) => {
      const key = lang === 'en'
        ? el.getAttribute('data-config-en')
        : el.getAttribute('data-config');
      if (config[key] !== undefined && config[key] !== null) {
        el.textContent = config[key];
      }
    });

    const emptyWishState = document.getElementById('wish-empty-state');
    if (emptyWishState) emptyWishState.textContent = lang === 'en'
      ? 'Approved wishes will appear here once the guestbook is connected.'
      : 'Lời chúc đã được duyệt sẽ hiển thị tại đây khi kết nối sổ lưu bút.';
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
    hero.style.setProperty('--hero-photo-position', desktopPosition);
    hero.style.setProperty('--hero-photo-position-mobile', mobilePosition);

    // The image now lives in its own semantic block. Keep both picture sources configurable
    // from site-config.js instead of relying on CSS background images.
    const heroPicture = hero.querySelector('.hero-media-picture');
    const heroMediaElement = hero.querySelector('.hero-media-image');
    const heroMobileSource = heroPicture ? heroPicture.querySelector('source[media]') : null;
    const heroImagePath = String(config.heroImage || '').trim();
    const heroMobileImagePath = String(config.heroMobileImage || '').trim();
    if (heroMobileImagePath) {
      const mobileImage = new Image();
      mobileImage.onload = () => {
        const resolved = mobileImage.src;
        hero.style.setProperty('--hero-mobile-image', `url(${JSON.stringify(resolved)})`);
        if (heroMobileSource) heroMobileSource.srcset = resolved;
      };
      mobileImage.onerror = () => console.warn('[Hero] Không tải được ảnh mobile:', heroMobileImagePath);
      try { mobileImage.src = new URL(heroMobileImagePath, document.baseURI).href; } catch (error) { console.warn('[Hero] Đường dẫn ảnh mobile không hợp lệ:', error); }
    }
    if (heroImagePath) {
      const heroImage = new Image();
      heroImage.onload = () => {
        const resolved = heroImage.src;
        hero.style.setProperty('--hero-image', `url(${JSON.stringify(resolved)})`);
        if (heroMediaElement) heroMediaElement.src = resolved;
        hero.classList.add('has-hero-image');
      };
      heroImage.onerror = () => {
        console.warn(`[Hero] Không tải được ảnh cưới desktop "${heroImagePath}". Kiểm tra lại heroImage trong site-config.js.`);
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

  // Toast: create DOM nodes and insert all messages as text, never as HTML.
  const toast = document.getElementById('toast');
  function showToast(message) {
    if (!toast) return;
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '🌿';
    const text = document.createElement('span');
    text.textContent = String(message ?? '');
    toast.replaceChildren(icon, text);
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
  let activeLocationKey = null;

  function isPlaceholderValue(value) {
    const text = String(value || '').trim();
    return !text || /^\[.*\]$/.test(text) || /\[[^\]]+\]/.test(text) || /địa chỉ chi tiết|địa điểm tổ chức|thêm địa chỉ/i.test(text);
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

    const structuredAddress = ['hamlet', 'commune', 'province'].some((field) =>
      Object.prototype.hasOwnProperty.call(current, field)
    );

    return {
      time: current.time || legacy.time || '',
      venue: current.venue || legacy.venue || '',
      hamlet: current.hamlet || '',
      commune: current.commune || '',
      province: current.province || '',
      structuredAddress,
      address: current.address || legacy.address || '',
      mapUrl: current.mapUrl || legacy.mapUrl || '',
      mapEmbedUrl: current.mapEmbedUrl || legacy.mapEmbedUrl || ''
    };
  }

  function isLocationConfigured(location) {
    return [location.time, location.venue, location.hamlet, location.commune, location.province, location.address]
      .some((value) => Boolean(value && !isPlaceholderValue(value)));
  }

  // The bride-family block stays visible as an editable slot even before names/address are finalized.
  // Other family blocks continue to hide empty detail rows to avoid exposing placeholders to guests.
  document.querySelectorAll('.hero-family-parents').forEach((row) => {
    const value = row.querySelector('[data-config]');
    const family = row.closest('.hero-family-item');
    const isBrideFamily = Boolean(family && family.classList.contains('hero-family-bride'));
    row.hidden = isBrideFamily ? false : (!value || isPlaceholderValue(value.textContent));
  });
  document.querySelectorAll('.hero-family-address').forEach((row) => {
    row.hidden = isPlaceholderValue(row.textContent);
  });
  document.querySelectorAll('.hero-family-item').forEach((family) => {
    const isBrideFamily = family.classList.contains('hero-family-bride');
    const hasVisibleDetails = [...family.querySelectorAll('.hero-family-parents, .hero-family-address')]
      .some((row) => !row.hidden);
    family.hidden = isBrideFamily ? false : !hasVisibleDetails;
  });

  function configureMapFrame(location) {
    if (!mapDisplay || !mapIframe || !mapPlaceholderState) return;

    const mapSearchText = [location.venue, location.hamlet, location.commune, location.province, location.address].filter((value) => !isPlaceholderValue(value)).join(', ');
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
    const allLocationKeys = locationCards.map((card) => card.dataset.locationOption);
    const configuredKeys = allLocationKeys.filter((locationKey) => isLocationConfigured(getLocationConfig(locationKey)));
    if (!allLocationKeys.includes(key)) key = configuredKeys[0] || allLocationKeys[0] || null;

    locationCards.forEach((card) => {
      const cardKey = card.dataset.locationOption;
      const cardLocation = getLocationConfig(cardKey);
      // Keep every location card present as a logical/content slot; blank details are hidden individually.
      card.hidden = false;
      const selected = cardKey === key;
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', String(selected));

      const timeNode = card.querySelector('[data-location-field="time"]');
      const venueNode = card.querySelector('[data-location-field="venue"]');
      const addressNode = card.querySelector('[data-location-field="address"]');
      const addressPartsNode = card.querySelector('[data-location-address-parts]');
      if (timeNode) {
        timeNode.textContent = cardLocation.time && !isPlaceholderValue(cardLocation.time) ? cardLocation.time : '';
        timeNode.hidden = !timeNode.textContent;
      }

      const venue = cardLocation.venue && !isPlaceholderValue(cardLocation.venue) ? cardLocation.venue : '';
      if (venueNode) {
        venueNode.textContent = venue;
        venueNode.hidden = !venue;
      }

      if (cardLocation.structuredAddress) {
        if (addressPartsNode) addressPartsNode.hidden = false;
        if (addressNode) addressNode.hidden = true;
        ['hamlet', 'commune', 'province'].forEach((field) => {
          const valueNode = card.querySelector(`[data-location-field="${field}"]`);
          const part = valueNode ? valueNode.closest('.event-address-part') : null;
          const value = cardLocation[field] && !isPlaceholderValue(cardLocation[field]) ? cardLocation[field] : '';
          if (valueNode) valueNode.textContent = value;
          if (part) part.hidden = !value;
        });
        if (addressPartsNode) {
          addressPartsNode.hidden = ![cardLocation.hamlet, cardLocation.commune, cardLocation.province]
            .some((value) => value && !isPlaceholderValue(value));
        }
      } else {
        if (addressPartsNode) addressPartsNode.hidden = true;
        if (addressNode) {
          const address = cardLocation.address && !isPlaceholderValue(cardLocation.address) ? cardLocation.address : '';
          addressNode.textContent = address;
          addressNode.hidden = !address;
        }
      }
    });

    if (!allLocationKeys.length || !key) {
      activeLocationKey = null;
      if (mapDisplay) mapDisplay.hidden = true;
      const mapRow = document.querySelector('.map-row');
      if (mapRow) mapRow.hidden = true;
      return;
    }

    activeLocationKey = key;
    const location = getLocationConfig(key);
    const dict = i18n[currentLang] || i18n.vi;
    const selectedTitle = dict[options[key]] || dict.scheduleTitle;

    const selectedCard = locationCards.find((card) => card.dataset.locationOption === key);
    if (selectedCard) {
      selectedCard.classList.add('is-selected');
      selectedCard.setAttribute('aria-pressed', 'true');
    }
    if (mapDisplay) mapDisplay.hidden = false;
    const mapRow = document.querySelector('.map-row');
    if (mapRow) mapRow.hidden = false;
    if (mapLocationTitle) mapLocationTitle.textContent = selectedTitle;
    if (mapLocationTime) {
      mapLocationTime.textContent = location.time && !isPlaceholderValue(location.time) ? location.time : '';
      mapLocationTime.hidden = !mapLocationTime.textContent;
    }
    if (mapLocationVenue) {
      const venue = location.venue && !isPlaceholderValue(location.venue) ? location.venue : '';
      mapLocationVenue.textContent = venue;
      mapLocationVenue.hidden = !venue;
    }

    const mapLocationAddressParts = document.getElementById('map-location-address-parts');
    if (location.structuredAddress) {
      if (mapLocationAddress) mapLocationAddress.hidden = true;
      if (mapLocationAddressParts) mapLocationAddressParts.hidden = false;
      ['hamlet', 'commune', 'province'].forEach((field) => {
        const valueNode = document.querySelector(`[data-location-detail="${field}"]`);
        const part = valueNode ? valueNode.closest('.map-location-address-part') : null;
        const value = location[field] && !isPlaceholderValue(location[field]) ? location[field] : '';
        if (valueNode) valueNode.textContent = value;
        if (part) part.hidden = !value;
      });
      if (mapLocationAddressParts) {
        mapLocationAddressParts.hidden = ![location.hamlet, location.commune, location.province]
          .some((value) => value && !isPlaceholderValue(value));
      }
    } else {
      if (mapLocationAddressParts) mapLocationAddressParts.hidden = true;
      if (mapLocationAddress) {
        const address = location.address && !isPlaceholderValue(location.address) ? location.address : '';
        mapLocationAddress.textContent = address;
        mapLocationAddress.hidden = !address;
      }
    }

    if (mapDirectionsText) {
      const hasLocation = [location.venue, location.hamlet, location.commune, location.province, location.address]
        .some((value) => value && !isPlaceholderValue(value));
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

  // Trình phát nhạc nền cho thiệp cưới
  const bgMusic = document.getElementById('background-music');

  function syncMusicButtons(isPlaying) {
    document.querySelectorAll('.music-toggle').forEach((button) => {
      const pill = button.querySelector('.toggle-pill');

      if (pill) {
        pill.classList.toggle('active', isPlaying);
      }

      button.setAttribute('aria-pressed', String(isPlaying));
      button.setAttribute(
        'aria-label',
        isPlaying ? 'Tắt nhạc / Stop music' : 'Bật nhạc / Play music'
      );
    });
  }

  document.querySelectorAll('.music-toggle').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');

    button.addEventListener('click', async () => {
      if (!bgMusic) {
        showToast('Không tìm thấy trình phát nhạc.');
        return;
      }

      try {
        if (bgMusic.paused) {
          bgMusic.volume = 0.35;
          await bgMusic.play();
          syncMusicButtons(true);
        } else {
          bgMusic.pause();
          syncMusicButtons(false);
        }
      } catch (error) {
        console.error('Không thể phát nhạc:', error);

        showToast(i18n[currentLang]?.toastMusic || i18n.vi.toastMusic);

        syncMusicButtons(false);
      }
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
      if (String(rsvpForm.elements.namedItem('website')?.value || '').trim()) {
        rsvpForm.reset();
        updateGuestCountState();
        return;
      }

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

        const thankyouCard = document.getElementById('rsvp-thankyou');
        if (thankyouCard) thankyouCard.hidden = false;
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
            currentLang === 'en' ? 'Realtime connected' : 'Realtime đã kết nối',
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
      if (String(wishForm.elements.namedItem('website')?.value || '').trim()) {
        wishForm.reset();
        if (wishCount) wishCount.textContent = '0';
        return;
      }

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
  } else if (wishesGrid) {
    wishesGrid.replaceChildren();
    setGuestbookStatus(currentLang === 'en' ? 'Guestbook unavailable' : 'Sổ lưu bút chưa kết nối', 'offline');
    const empty = document.createElement('p');
    empty.id = 'wish-empty-state';
    empty.className = 'wish-empty';
    empty.textContent = currentLang === 'en'
      ? 'Approved wishes will appear here once the guestbook is connected.'
      : 'Lời chúc đã được duyệt sẽ hiển thị tại đây khi kết nối sổ lưu bút.';
    wishesGrid.appendChild(empty);
  }

  // Fit both names into one row only on wider screens. On phones the same logical
  // name block becomes a three-row CSS grid (groom / ampersand / bride), so fitting
  // the combined width would incorrectly shrink both names and defeat the design.
  const coupleHeading = document.querySelector('.hero h1.couple-names');
  if (coupleHeading) {
    const fitCoupleNames = () => {
      const names = [...coupleHeading.querySelectorAll('.couple-name')];
      const ampersand = coupleHeading.querySelector('.ampersand');
      if (names.length !== 2 || !ampersand) return;
      names.forEach((name) => { name.style.fontSize = ''; });
      if (window.matchMedia('(max-width: 550px)').matches) return;
      const styles = getComputedStyle(coupleHeading);
      const baseSize = parseFloat(getComputedStyle(names[0]).fontSize) || 16;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      const fontFamily = getComputedStyle(names[0]).fontFamily;
      const fontWeight = getComputedStyle(names[0]).fontWeight;
      const fontStyle = getComputedStyle(names[0]).fontStyle;
      context.font = `${fontStyle} ${fontWeight} ${baseSize}px ${fontFamily}`;
      const wordSpacing = parseFloat(getComputedStyle(names[0]).wordSpacing) || 0;
      const naturalNamesWidth = names.reduce((sum, name) => {
        const text = name.textContent.trim();
        const spaces = (text.match(/\s+/g) || []).length;
        return sum + context.measureText(text).width + spaces * wordSpacing;
      }, 0);
      const ampWidth = ampersand.getBoundingClientRect().width || baseSize * .7;
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      const available = coupleHeading.clientWidth - ampWidth - gap * 2 - 8;
      if (naturalNamesWidth > available) {
        const minSize = window.matchMedia('(max-width: 350px)').matches ? 13 : (window.matchMedia('(max-width: 550px)').matches ? 14 : 18);
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
