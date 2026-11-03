/**
 * ADMIN DASHBOARD LOGIC - THIỆP CƯỚI ONLINE
 * Quản lý xác nhận tham dự (RSVP), kiểm duyệt sổ lưu bút, thống kê & xuất CSV.
 * Mọi thao tác được bảo vệ bằng Row Level Security (RLS) ở database.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. KHỞI TẠO CLIENT SUPABASE
  // --------------------------------------------------------------------------
  const supabaseConfig = window.SUPABASE_CONFIG || {};
  const supabaseClient = (() => {
    const sdk = window.supabase;
    if (!sdk || typeof sdk.createClient !== 'function') {
      console.error('[Admin] Không tìm thấy Supabase SDK. Vui lòng kiểm tra CDN.');
      return null;
    }

    const url = String(supabaseConfig.url || '').trim();
    const publishableKey = String(supabaseConfig.publishableKey || '').trim();

    if (!url.startsWith('https://') || !publishableKey || publishableKey.includes('DAN_PUBLISHABLE_KEY')) {
      console.error('[Admin] Thiếu URL hoặc Publishable key trong supabase-config.js.');
      return null;
    }

    try {
      return sdk.createClient(url, publishableKey);
    } catch (err) {
      console.error('[Admin] Lỗi khởi tạo Supabase client:', err);
      return null;
    }
  })();

  // --------------------------------------------------------------------------
  // 2. STATE ỨNG DỤNG
  // --------------------------------------------------------------------------
  let currentAdminUser = null;
  let allRsvps = [];
  let allWishes = [];
  let rsvpRealtimeChannel = null;
  let wishRealtimeChannel = null;
  let wishToDelete = null;

  // --------------------------------------------------------------------------
  // 3. THAM CHIẾU DOM ELEMENTS
  // --------------------------------------------------------------------------
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const loginAlert = document.getElementById('login-alert');
  const loginAlertText = document.getElementById('login-alert-text');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const togglePwdBtn = document.getElementById('toggle-pwd-btn');

  const adminUserProfile = document.getElementById('admin-user-profile');
  const adminUserInitial = document.getElementById('admin-user-initial');
  const adminUserEmail = document.getElementById('admin-user-email');
  const btnLogout = document.getElementById('btn-logout');

  // Metrics
  const metricTotalResponses = document.getElementById('metric-total-responses');
  const metricAttendingYes = document.getElementById('metric-attending-yes');
  const metricAttendingNo = document.getElementById('metric-attending-no');
  const metricTotalGuests = document.getElementById('metric-total-guests');
  const metricPendingWishes = document.getElementById('metric-pending-wishes');

  // Tabs
  const tabBtnRsvps = document.getElementById('tab-btn-rsvps');
  const tabBtnWishes = document.getElementById('tab-btn-wishes');
  const panelRsvps = document.getElementById('panel-rsvps');
  const panelWishes = document.getElementById('panel-wishes');
  const badgeRsvpsCount = document.getElementById('badge-rsvps-count');
  const badgeWishesPending = document.getElementById('badge-wishes-pending');

  // RSVP Controls
  const rsvpSearchInput = document.getElementById('rsvp-search-input');
  const rsvpFilterAttending = document.getElementById('rsvp-filter-attending');
  const rsvpSortOrder = document.getElementById('rsvp-sort-order');
  const btnExportRsvpsCsv = document.getElementById('btn-export-rsvps-csv');
  const btnRefreshRsvps = document.getElementById('btn-refresh-rsvps');
  const btnRetryRsvps = document.getElementById('btn-retry-rsvps');
  const rsvpLoadingState = document.getElementById('rsvp-loading-state');
  const rsvpErrorState = document.getElementById('rsvp-error-state');
  const rsvpErrorText = document.getElementById('rsvp-error-text');
  const rsvpEmptyState = document.getElementById('rsvp-empty-state');
  const rsvpTableWrapper = document.getElementById('rsvp-table-wrapper');
  const rsvpTableBody = document.getElementById('rsvp-table-body');
  const rsvpSummaryText = document.getElementById('rsvp-summary-text');

  // Wishes Controls
  const wishSearchInput = document.getElementById('wish-search-input');
  const wishFilterStatus = document.getElementById('wish-filter-status');
  const btnExportWishesCsv = document.getElementById('btn-export-wishes-csv');
  const btnRefreshWishes = document.getElementById('btn-refresh-wishes');
  const btnRetryWishes = document.getElementById('btn-retry-wishes');
  const wishesLoadingState = document.getElementById('wishes-loading-state');
  const wishesErrorState = document.getElementById('wishes-error-state');
  const wishesErrorText = document.getElementById('wishes-error-text');
  const wishesEmptyState = document.getElementById('wishes-empty-state');
  const wishesGrid = document.getElementById('wishes-grid');

  // Modal Confirm
  const confirmModal = document.getElementById('confirm-modal');
  const modalConfirmTitle = document.getElementById('modal-confirm-title');
  const modalConfirmMessage = document.getElementById('modal-confirm-message');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalConfirm = document.getElementById('btn-modal-confirm');

  // Toast
  const toastContainer = document.getElementById('admin-toast-container');

  // --------------------------------------------------------------------------
  // 4. TIỆN ÍCH HIỂN THỊ (TOAST & FORMAT)
  // --------------------------------------------------------------------------
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;

    const icon = document.createElement('span');
    icon.className = 'admin-toast-icon';
    icon.textContent = type === 'success' ? '🌿' : type === 'error' ? '⚠️' : 'ℹ️';

    const text = document.createElement('span');
    text.textContent = message;

    toast.append(icon, text);
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function formatDateTime(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return String(isoString);
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(date);
    } catch (_) {
      return date.toLocaleString();
    }
  }

  function showLoginError(msg) {
    if (!loginAlert || !loginAlertText) return;
    loginAlertText.textContent = msg;
    loginAlert.classList.add('show', 'error');
  }

  function hideLoginError() {
    if (!loginAlert) return;
    loginAlert.classList.remove('show', 'error');
  }

  // --------------------------------------------------------------------------
  // 5. XÁC THỰC & BẢO MẬT (SUPABASE AUTH + RLS ADMIN CHECK)
  // --------------------------------------------------------------------------
  async function checkAdminAuthorization(user) {
    if (!supabaseClient || !user) return false;

    try {
      // Bảo vệ RLS: Truy vấn bảng admin_users để kiểm tra allowlist admin
      const { data, error } = await supabaseClient
        .from('admin_users')
        .select('id, email')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('[Admin] Lỗi kiểm tra quyền admin:', error);
        return false;
      }

      // Có bản ghi trong admin_users nghĩa là tài khoản hợp lệ
      return Boolean(data && data.id === user.id);
    } catch (err) {
      console.error('[Admin] Lỗi ngoại lệ khi kiểm tra quyền:', err);
      return false;
    }
  }

  async function checkSessionAndRole() {
    if (!supabaseClient) {
      showLoginError('Không thể kết nối đến Supabase. Vui lòng cấu hình supabase-config.js.');
      return;
    }

    try {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error || !session || !session.user) {
        showLoginView();
        return;
      }

      // Đã có session, kiểm tra quyền admin trong database
      const isAllowedAdmin = await checkAdminAuthorization(session.user);
      if (!isAllowedAdmin) {
        console.warn('[Admin] Tài khoản đã đăng nhập nhưng không có quyền admin trong database.');
        showLoginError('Tài khoản này không có trong danh sách quản trị viên (admin_users).');
        await supabaseClient.auth.signOut();
        showLoginView();
        return;
      }

      // Đã xác thực thành công là admin
      currentAdminUser = session.user;
      showDashboardView(currentAdminUser);
    } catch (err) {
      console.error('[Admin] Lỗi kiểm tra phiên:', err);
      showLoginView();
    }
  }

  function showLoginView() {
    currentAdminUser = null;
    allRsvps = [];
    allWishes = [];
    if (loginView) loginView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
    if (adminUserProfile) adminUserProfile.style.display = 'none';
    cleanupRealtimeSubscriptions();
  }

  function showDashboardView(user) {
    hideLoginError();
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';

    if (adminUserProfile) {
      adminUserProfile.style.display = 'flex';
      const email = user.email || 'Admin';
      if (adminUserEmail) adminUserEmail.textContent = email;
      if (adminUserInitial) adminUserInitial.textContent = email.charAt(0).toUpperCase();
    }

    // Tải dữ liệu
    loadAllAdminData();
    setupRealtimeSubscriptions();
  }

  // --------------------------------------------------------------------------
  // 6. TÍNH TOÁN THỐNG KÊ (QUY TẮC CỐT LÕI: TỔNG NGƯỜI CHỈ TÍNH ATTENDING = TRUE)
  // --------------------------------------------------------------------------
  function updateMetrics() {
    const total = allRsvps.length;
    const yesCount = allRsvps.filter((r) => r.attending === true).length;
    const noCount = allRsvps.filter((r) => r.attending === false).length;

    // QUY TẮC BẮT BUỘC TỪ PROPOSAL VÀ USER:
    // Tổng người dự kiến = Tổng guest_count của các bản ghi CÓ attending = true.
    // Nếu attending = false thì TUYỆT ĐỐI KHÔNG CỘNG vào tổng người dù guest_count có giá trị.
    const totalGuests = allRsvps.reduce((acc, r) => {
      if (r.attending === true) {
        const count = Number(r.guest_count);
        return acc + (Number.isFinite(count) && count > 0 ? count : 1);
      }
      return acc;
    }, 0);

    const pendingWishesCount = allWishes.filter((w) => w.is_approved === false).length;

    if (metricTotalResponses) metricTotalResponses.textContent = String(total);
    if (metricAttendingYes) metricAttendingYes.textContent = String(yesCount);
    if (metricAttendingNo) metricAttendingNo.textContent = String(noCount);
    if (metricTotalGuests) metricTotalGuests.textContent = String(totalGuests);
    if (metricPendingWishes) metricPendingWishes.textContent = String(pendingWishesCount);

    if (badgeRsvpsCount) badgeRsvpsCount.textContent = String(total);
    if (badgeWishesPending) badgeWishesPending.textContent = String(pendingWishesCount);
  }

  // --------------------------------------------------------------------------
  // 7. QUẢN LÝ DỮ LIỆU RSVP
  // --------------------------------------------------------------------------
  async function loadRsvps(options = {}) {
    if (!supabaseClient) return;

    if (!options.quiet) {
      if (rsvpLoadingState) rsvpLoadingState.style.display = 'flex';
      if (rsvpErrorState) rsvpErrorState.style.display = 'none';
      if (rsvpEmptyState) rsvpEmptyState.style.display = 'none';
      if (rsvpTableWrapper) rsvpTableWrapper.style.display = 'none';
    }

    const sortAsc = rsvpSortOrder && rsvpSortOrder.value === 'asc';

    try {
      // Truy vấn bảo vệ bằng RLS: policy rsvps_admin_select chỉ cho phép admin
      const { data, error } = await supabaseClient
        .from('rsvps')
        .select('id, guest_name, phone, attending, guest_count, note, created_at')
        .order('created_at', { ascending: sortAsc });

      if (error) throw error;

      allRsvps = Array.isArray(data) ? data : [];
      if (rsvpLoadingState) rsvpLoadingState.style.display = 'none';
      updateMetrics();
      renderRsvps();
    } catch (err) {
      console.error('[Admin] Lỗi tải danh sách RSVP:', err);
      if (!options.quiet) {
        if (rsvpLoadingState) rsvpLoadingState.style.display = 'none';
        if (rsvpErrorState) rsvpErrorState.style.display = 'flex';
        if (rsvpErrorText) {
          rsvpErrorText.textContent = err.message || 'Không thể tải dữ liệu từ database.';
        }
        if (rsvpTableWrapper) rsvpTableWrapper.style.display = 'none';
      }
    }
  }

  function getFilteredRsvps() {
    const searchTerm = String(rsvpSearchInput?.value || '').trim().toLowerCase();
    const filterAttending = String(rsvpFilterAttending?.value || 'all');

    return allRsvps.filter((r) => {
      // Lọc trạng thái tham dự
      if (filterAttending === 'yes' && r.attending !== true) return false;
      if (filterAttending === 'no' && r.attending !== false) return false;

      // Tìm kiếm theo tên hoặc số điện thoại
      if (searchTerm) {
        const name = String(r.guest_name || '').toLowerCase();
        const phone = String(r.phone || '').toLowerCase();
        if (!name.includes(searchTerm) && !phone.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  function renderRsvps() {
    if (!rsvpTableBody) return;
    rsvpTableBody.replaceChildren();

    const filtered = getFilteredRsvps();

    if (rsvpSummaryText) {
      rsvpSummaryText.textContent = `Đang hiển thị ${filtered.length} / ${allRsvps.length} phản hồi`;
    }

    if (filtered.length === 0) {
      if (rsvpTableWrapper) rsvpTableWrapper.style.display = 'none';
      if (rsvpEmptyState) {
        rsvpEmptyState.style.display = 'flex';
        const title = rsvpEmptyState.querySelector('.state-title');
        const desc = rsvpEmptyState.querySelector('.state-desc');
        if (allRsvps.length === 0) {
          if (title) title.textContent = 'Chưa có phản hồi nào';
          if (desc) desc.textContent = 'Khi khách mời gửi xác nhận tham dự từ thiệp cưới, dữ liệu sẽ hiển thị tại đây.';
        } else {
          if (title) title.textContent = 'Không tìm thấy kết quả phù hợp';
          if (desc) desc.textContent = 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc trạng thái.';
        }
      }
      return;
    }

    if (rsvpEmptyState) rsvpEmptyState.style.display = 'none';
    if (rsvpTableWrapper) rsvpTableWrapper.style.display = 'block';

    filtered.forEach((r, index) => {
      const tr = document.createElement('tr');

      // 1. STT
      const tdIndex = document.createElement('td');
      tdIndex.style.color = 'var(--admin-ink-muted)';
      tdIndex.textContent = String(index + 1);

      // 2. Họ và tên
      const tdName = document.createElement('td');
      const strongName = document.createElement('strong');
      strongName.textContent = String(r.guest_name || '—');
      tdName.appendChild(strongName);

      // 3. Số điện thoại
      const tdPhone = document.createElement('td');
      if (r.phone) {
        const phoneLink = document.createElement('a');
        phoneLink.href = `tel:${encodeURIComponent(r.phone)}`;
        phoneLink.style.cssText = 'color:var(--admin-sage);text-decoration:none;font-weight:500;';
        phoneLink.textContent = String(r.phone);
        tdPhone.appendChild(phoneLink);
      } else {
        tdPhone.textContent = '—';
        tdPhone.style.color = 'var(--admin-ink-faint)';
      }

      // 4. Trạng thái tham dự
      const tdAttend = document.createElement('td');
      const badge = document.createElement('span');
      if (r.attending === true) {
        badge.className = 'badge badge-yes';
        badge.innerHTML = '<span>✓</span> Tham dự';
      } else {
        badge.className = 'badge badge-no';
        badge.innerHTML = '<span>✕</span> Không tham dự';
      }
      tdAttend.appendChild(badge);

      // 5. Số người
      const tdCount = document.createElement('td');
      tdCount.style.textAlign = 'center';
      if (r.attending === true) {
        const countSpan = document.createElement('span');
        countSpan.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:6px;background:var(--admin-sage-soft);color:var(--admin-sage);font-weight:700;';
        countSpan.textContent = String(r.guest_count || 1);
        tdCount.appendChild(countSpan);
      } else {
        tdCount.textContent = '0';
        tdCount.style.color = 'var(--admin-ink-faint)';
      }

      // 6. Ghi chú
      const tdNote = document.createElement('td');
      if (r.note) {
        tdNote.style.cssText = 'max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        tdNote.title = String(r.note);
        tdNote.textContent = String(r.note);
      } else {
        tdNote.textContent = '—';
        tdNote.style.color = 'var(--admin-ink-faint)';
      }

      // 7. Thời gian gửi
      const tdTime = document.createElement('td');
      tdTime.style.cssText = 'color:var(--admin-ink-muted);font-size:12px;white-space:nowrap;';
      tdTime.textContent = formatDateTime(r.created_at);

      tr.append(tdIndex, tdName, tdPhone, tdAttend, tdCount, tdNote, tdTime);
      rsvpTableBody.appendChild(tr);
    });
  }

  // --------------------------------------------------------------------------
  // 8. QUẢN LÝ DỮ LIỆU SỔ LƯU BÚT (WISHES)
  // --------------------------------------------------------------------------
  async function loadWishes(options = {}) {
    if (!supabaseClient) return;

    if (!options.quiet) {
      if (wishesLoadingState) wishesLoadingState.style.display = 'flex';
      if (wishesErrorState) wishesErrorState.style.display = 'none';
      if (wishesEmptyState) wishesEmptyState.style.display = 'none';
      if (wishesGrid) wishesGrid.style.display = 'none';
    }

    try {
      // Truy vấn bảo vệ bằng RLS: policy wishes_admin_select_all cho phép đọc cả chờ duyệt và đã duyệt
      const { data, error } = await supabaseClient
        .from('wishes')
        .select('id, guest_name, message, is_approved, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      allWishes = Array.isArray(data) ? data : [];
      if (wishesLoadingState) wishesLoadingState.style.display = 'none';
      updateMetrics();
      renderWishes();
    } catch (err) {
      console.error('[Admin] Lỗi tải danh sách lời chúc:', err);
      if (!options.quiet) {
        if (wishesLoadingState) wishesLoadingState.style.display = 'none';
        if (wishesErrorState) wishesErrorState.style.display = 'flex';
        if (wishesErrorText) {
          wishesErrorText.textContent = err.message || 'Không thể tải dữ liệu lời chúc từ database.';
        }
        if (wishesGrid) wishesGrid.style.display = 'none';
      }
    }
  }

  function getFilteredWishes() {
    const searchTerm = String(wishSearchInput?.value || '').trim().toLowerCase();
    const filterStatus = String(wishFilterStatus?.value || 'pending');

    return allWishes.filter((w) => {
      // Lọc trạng thái
      if (filterStatus === 'pending' && w.is_approved === true) return false;
      if (filterStatus === 'approved' && w.is_approved !== true) return false;

      // Tìm kiếm theo tên hoặc nội dung
      if (searchTerm) {
        const name = String(w.guest_name || '').toLowerCase();
        const msg = String(w.message || '').toLowerCase();
        if (!name.includes(searchTerm) && !msg.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  function renderWishes() {
    if (!wishesGrid) return;
    wishesGrid.replaceChildren();

    const filtered = getFilteredWishes();

    if (filtered.length === 0) {
      if (wishesGrid) wishesGrid.style.display = 'none';
      if (wishesEmptyState) {
        wishesEmptyState.style.display = 'flex';
        const title = wishesEmptyState.querySelector('.state-title');
        const desc = wishesEmptyState.querySelector('.state-desc');
        const filterStatus = String(wishFilterStatus?.value || 'pending');

        if (filterStatus === 'pending') {
          if (title) title.textContent = 'Không có lời chúc nào đang chờ duyệt';
          if (desc) desc.textContent = 'Tuyệt vời! Tất cả các lời chúc mới đều đã được xử lý.';
        } else {
          if (title) title.textContent = 'Không có lời chúc nào';
          if (desc) desc.textContent = 'Không tìm thấy lời chúc phù hợp với bộ lọc hiện tại.';
        }
      }
      return;
    }

    if (wishesEmptyState) wishesEmptyState.style.display = 'none';
    if (wishesGrid) wishesGrid.style.display = 'grid';

    filtered.forEach((w) => {
      const card = document.createElement('article');
      card.className = `wish-admin-card ${w.is_approved ? 'is-approved' : 'is-pending'}`;

      // 1. Header thẻ
      const cardTop = document.createElement('div');
      cardTop.className = 'wish-card-top';

      const senderInfo = document.createElement('div');
      senderInfo.className = 'wish-sender-info';

      const avatar = document.createElement('div');
      avatar.className = 'wish-avatar';
      const initial = Array.from(String(w.guest_name || '?').trim())[0] || '?';
      avatar.textContent = initial.toUpperCase();

      const senderMeta = document.createElement('div');
      const senderName = document.createElement('h4');
      senderName.className = 'wish-sender-name';
      senderName.textContent = String(w.guest_name || 'Khách');

      const timeText = document.createElement('p');
      timeText.className = 'wish-time';
      timeText.textContent = formatDateTime(w.created_at);

      senderMeta.append(senderName, timeText);
      senderInfo.append(avatar, senderMeta);

      const statusBadge = document.createElement('span');
      if (w.is_approved) {
        statusBadge.className = 'badge badge-approved';
        statusBadge.textContent = 'Đã duyệt';
      } else {
        statusBadge.className = 'badge badge-pending';
        statusBadge.textContent = 'Chờ duyệt';
      }

      cardTop.append(senderInfo, statusBadge);

      // 2. Nội dung lời chúc (textContent an toàn chống XSS)
      const messageBody = document.createElement('p');
      messageBody.className = 'wish-message-body';
      messageBody.textContent = String(w.message || '');

      // 3. Thanh hành động
      const cardActions = document.createElement('div');
      cardActions.className = 'wish-card-actions';

      // Nút Duyệt / Bỏ duyệt
      if (!w.is_approved) {
        const btnApprove = document.createElement('button');
        btnApprove.className = 'btn-action btn-approve';
        btnApprove.type = 'button';
        btnApprove.innerHTML = '<span>✓</span> Duyệt công khai';
        btnApprove.addEventListener('click', () => handleToggleApprove(w.id, true, btnApprove));
        cardActions.appendChild(btnApprove);
      } else {
        const btnUnapprove = document.createElement('button');
        btnUnapprove.className = 'btn-action btn-unapprove';
        btnUnapprove.type = 'button';
        btnUnapprove.innerHTML = '<span>↺</span> Bỏ duyệt (Ẩn)';
        btnUnapprove.addEventListener('click', () => handleToggleApprove(w.id, false, btnUnapprove));
        cardActions.appendChild(btnUnapprove);
      }

      // Nút Xóa (bắt buộc mở confirm dialog)
      const btnDelete = document.createElement('button');
      btnDelete.className = 'btn-action btn-delete';
      btnDelete.type = 'button';
      btnDelete.innerHTML = '<span>🗑️</span> Xóa';
      btnDelete.addEventListener('click', () => promptDeleteWish(w));
      cardActions.appendChild(btnDelete);

      card.append(cardTop, messageBody, cardActions);
      wishesGrid.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // 9. THAO TÁC DUYỆT & XÓA LỜI CHÚC
  // --------------------------------------------------------------------------
  async function handleToggleApprove(wishId, approveStatus, triggerButton) {
    if (!supabaseClient) return;

    if (triggerButton) {
      triggerButton.disabled = true;
      triggerButton.innerHTML = '<span class="spinner spinner-sm"></span> Đang xử lý...';
    }

    try {
      // Cập nhật bảo vệ bằng RLS: policy wishes_admin_update chỉ cho phép admin
      const { error } = await supabaseClient
        .from('wishes')
        .update({ is_approved: approveStatus })
        .eq('id', wishId);

      if (error) throw error;

      // Cập nhật mảng cục bộ
      const item = allWishes.find((w) => w.id === wishId);
      if (item) {
        item.is_approved = approveStatus;
      }

      updateMetrics();
      renderWishes();
      showToast(approveStatus ? 'Đã duyệt lời chúc thành công! Lời chúc đã hiển thị công khai.' : 'Đã bỏ duyệt lời chúc.');
    } catch (err) {
      console.error('[Admin] Lỗi cập nhật trạng thái lời chúc:', err);
      showToast(err.message || 'Không thể cập nhật lời chúc. Vui lòng thử lại.', 'error');
      if (triggerButton) {
        triggerButton.disabled = false;
        triggerButton.innerHTML = approveStatus ? '<span>✓</span> Duyệt công khai' : '<span>↺</span> Bỏ duyệt (Ẩn)';
      }
    }
  }

  function promptDeleteWish(wish) {
    wishToDelete = wish;
    if (!confirmModal) return;

    if (modalConfirmMessage) {
      const name = String(wish.guest_name || 'khách');
      modalConfirmMessage.textContent = `Bạn có chắc chắn muốn xóa lời chúc của "${name}" không? Hành động này sẽ xóa bản ghi khỏi cơ sở dữ liệu và không thể hoàn tác.`;
    }

    confirmModal.classList.add('show');
  }

  function closeDeleteModal() {
    wishToDelete = null;
    if (confirmModal) {
      confirmModal.classList.remove('show');
    }
    if (btnModalConfirm) {
      btnModalConfirm.disabled = false;
      btnModalConfirm.textContent = 'Xác nhận xóa';
    }
  }

  async function executeDeleteWish() {
    if (!supabaseClient || !wishToDelete) {
      closeDeleteModal();
      return;
    }

    const wishId = wishToDelete.id;
    if (btnModalConfirm) {
      btnModalConfirm.disabled = true;
      btnModalConfirm.textContent = 'Đang xóa...';
    }

    try {
      // Xóa bảo vệ bằng RLS: policy wishes_admin_delete chỉ cho phép admin
      const { error } = await supabaseClient
        .from('wishes')
        .delete()
        .eq('id', wishId);

      if (error) throw error;

      // Xóa khỏi state cục bộ
      allWishes = allWishes.filter((w) => w.id !== wishId);

      closeDeleteModal();
      updateMetrics();
      renderWishes();
      showToast('Đã xóa lời chúc thành công.', 'success');
    } catch (err) {
      console.error('[Admin] Lỗi xóa lời chúc:', err);
      showToast(err.message || 'Không thể xóa lời chúc. Vui lòng thử lại.', 'error');
      if (btnModalConfirm) {
        btnModalConfirm.disabled = false;
        btnModalConfirm.textContent = 'Xác nhận xóa';
      }
    }
  }

  // --------------------------------------------------------------------------
  // 10. XUẤT CSV CHUẨN UTF-8 (CÓ BOM \uFEFF CHO EXCEL)
  // --------------------------------------------------------------------------
  function escapeCsvCell(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  }

  function downloadCsvFile(csvContent, filename) {
    // Thêm BOM (\uFEFF) ở đầu chuỗi UTF-8 để Microsoft Excel trên Windows mở đúng tiếng Việt có dấu
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportRsvpsToCsv() {
    if (allRsvps.length === 0) {
      showToast('Chưa có dữ liệu phản hồi để xuất CSV.', 'info');
      return;
    }

    const headers = [
      'STT',
      'Họ và tên',
      'Số điện thoại',
      'Trạng thái tham dự',
      'Số người dự kiến',
      'Ghi chú',
      'Thời gian gửi'
    ];

    const rows = allRsvps.map((r, i) => [
      escapeCsvCell(i + 1),
      escapeCsvCell(r.guest_name),
      escapeCsvCell(r.phone || ''),
      escapeCsvCell(r.attending === true ? 'Có tham dự' : 'Không tham dự'),
      escapeCsvCell(r.attending === true ? (r.guest_count || 1) : 0),
      escapeCsvCell(r.note || ''),
      escapeCsvCell(formatDateTime(r.created_at))
    ]);

    const csvString = [headers.map(escapeCsvCell).join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    downloadCsvFile(csvString, `danh_sach_rsvp_thiep_cuoi_${timestamp}.csv`);
    showToast('Đã xuất file CSV thành công!', 'success');
  }

  function exportWishesToCsv() {
    if (allWishes.length === 0) {
      showToast('Chưa có lời chúc nào để xuất CSV.', 'info');
      return;
    }

    const headers = [
      'STT',
      'Họ và tên',
      'Trạng thái kiểm duyệt',
      'Nội dung lời chúc',
      'Thời gian gửi'
    ];

    const rows = allWishes.map((w, i) => [
      escapeCsvCell(i + 1),
      escapeCsvCell(w.guest_name),
      escapeCsvCell(w.is_approved ? 'Đã duyệt' : 'Chờ duyệt'),
      escapeCsvCell(w.message || ''),
      escapeCsvCell(formatDateTime(w.created_at))
    ]);

    const csvString = [headers.map(escapeCsvCell).join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    downloadCsvFile(csvString, `danh_sach_loi_chuc_thiep_cuoi_${timestamp}.csv`);
    showToast('Đã xuất file CSV lời chúc thành công!', 'success');
  }

  // --------------------------------------------------------------------------
  // 11. ĐỒNG BỘ REALTIME (SUPABASE REALTIME CHANNELS)
  // --------------------------------------------------------------------------
  function setupRealtimeSubscriptions() {
    if (!supabaseClient) return;
    cleanupRealtimeSubscriptions();

    // 1. Realtime cho bảng rsvps
    rsvpRealtimeChannel = supabaseClient
      .channel('admin-rsvps-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => {
        loadRsvps({ quiet: true });
      })
      .subscribe();

    // 2. Realtime cho bảng wishes
    wishRealtimeChannel = supabaseClient
      .channel('admin-wishes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wishes' }, () => {
        loadWishes({ quiet: true });
      })
      .subscribe();
  }

  function cleanupRealtimeSubscriptions() {
    if (rsvpRealtimeChannel && supabaseClient) {
      supabaseClient.removeChannel(rsvpRealtimeChannel);
      rsvpRealtimeChannel = null;
    }
    if (wishRealtimeChannel && supabaseClient) {
      supabaseClient.removeChannel(wishRealtimeChannel);
      wishRealtimeChannel = null;
    }
  }

  function loadAllAdminData() {
    loadRsvps();
    loadWishes();
  }

  // --------------------------------------------------------------------------
  // 12. GẮN SỰ KIỆN GIAO DIỆN (EVENT LISTENERS)
  // --------------------------------------------------------------------------
  function initEventListeners() {
    // Toggle mật khẩu
    if (togglePwdBtn && loginPassword) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = loginPassword.type === 'password';
        loginPassword.type = isPwd ? 'text' : 'password';
        togglePwdBtn.textContent = isPwd ? '🙈' : '👁️';
      });
    }

    // Submit form đăng nhập
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideLoginError();

        if (!supabaseClient) {
          showLoginError('Chưa cấu hình Supabase hợp lệ.');
          return;
        }

        const email = String(loginEmail?.value || '').trim();
        const password = String(loginPassword?.value || '').trim();

        if (!email || !password) {
          showLoginError('Vui lòng nhập đầy đủ email và mật khẩu.');
          return;
        }

        if (btnLoginSubmit) {
          btnLoginSubmit.disabled = true;
          btnLoginSubmit.innerHTML = '<span class="spinner spinner-sm"></span> Đang đăng nhập...';
        }

        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;
          if (!data || !data.user) throw new Error('Không nhận được thông tin người dùng.');

          // Kiểm tra quyền admin trong database
          const isAllowedAdmin = await checkAdminAuthorization(data.user);
          if (!isAllowedAdmin) {
            await supabaseClient.auth.signOut();
            throw new Error('Tài khoản này chưa được cấp quyền quản trị trong bảng admin_users.');
          }

          currentAdminUser = data.user;
          showDashboardView(currentAdminUser);
          showToast('Đăng nhập thành công! Chào mừng quản trị viên.', 'success');
        } catch (err) {
          console.error('[Admin] Đăng nhập thất bại:', err);
          showLoginError(err.message || 'Email hoặc mật khẩu không chính xác.');
        } finally {
          if (btnLoginSubmit) {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.innerHTML = '<span class="btn-text">Đăng nhập Dashboard</span>';
          }
        }
      });
    }

    // Nút đăng xuất
    if (btnLogout) {
      btnLogout.addEventListener('click', async () => {
        if (!supabaseClient) return;
        try {
          await supabaseClient.auth.signOut();
          showLoginView();
          showToast('Đã đăng xuất khỏi tài khoản quản trị.', 'info');
        } catch (err) {
          console.error('[Admin] Lỗi đăng xuất:', err);
          showLoginView();
        }
      });
    }

    // Chuyển đổi Tabs
    if (tabBtnRsvps && tabBtnWishes && panelRsvps && panelWishes) {
      tabBtnRsvps.addEventListener('click', () => {
        tabBtnRsvps.classList.add('active');
        tabBtnWishes.classList.remove('active');
        panelRsvps.style.display = 'block';
        panelWishes.style.display = 'none';
      });

      tabBtnWishes.addEventListener('click', () => {
        tabBtnWishes.classList.add('active');
        tabBtnRsvps.classList.remove('active');
        panelWishes.style.display = 'block';
        panelRsvps.style.display = 'none';
      });
    }

    // Tìm kiếm và lọc RSVP
    if (rsvpSearchInput) {
      rsvpSearchInput.addEventListener('input', () => renderRsvps());
    }
    if (rsvpFilterAttending) {
      rsvpFilterAttending.addEventListener('change', () => renderRsvps());
    }
    if (rsvpSortOrder) {
      rsvpSortOrder.addEventListener('change', () => loadRsvps());
    }
    if (btnRefreshRsvps) {
      btnRefreshRsvps.addEventListener('click', () => {
        loadRsvps();
        showToast('Đang làm mới danh sách RSVP...');
      });
    }
    if (btnRetryRsvps) {
      btnRetryRsvps.addEventListener('click', () => loadRsvps());
    }
    if (btnExportRsvpsCsv) {
      btnExportRsvpsCsv.addEventListener('click', exportRsvpsToCsv);
    }

    // Tìm kiếm và lọc Sổ lưu bút
    if (wishSearchInput) {
      wishSearchInput.addEventListener('input', () => renderWishes());
    }
    if (wishFilterStatus) {
      wishFilterStatus.addEventListener('change', () => renderWishes());
    }
    if (btnRefreshWishes) {
      btnRefreshWishes.addEventListener('click', () => {
        loadWishes();
        showToast('Đang làm mới danh sách lời chúc...');
      });
    }
    if (btnRetryWishes) {
      btnRetryWishes.addEventListener('click', () => loadWishes());
    }
    if (btnExportWishesCsv) {
      btnExportWishesCsv.addEventListener('click', exportWishesToCsv);
    }

    // Modal Confirm Actions
    if (btnModalCancel) {
      btnModalCancel.addEventListener('click', closeDeleteModal);
    }
    if (btnModalConfirm) {
      btnModalConfirm.addEventListener('click', executeDeleteWish);
    }
    if (confirmModal) {
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeDeleteModal();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 13. KHỞI CHẠY KHI TẢI TRANG
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkSessionAndRole();
  });

})();
