-- ==============================================================================
-- THIỆP CƯỚI ONLINE - SCRIPT KHỞI TẠO CƠ SỞ DỮ LIỆU & BẢO MẬT ROW LEVEL SECURITY (RLS)
-- File: supabase-admin-setup.sql
-- Mục tiêu: Bảo vệ toàn bộ dữ liệu ở cấp Database, chỉ cho phép Admin có trong admin_users
--          thực hiện các quyền quản trị (SELECT rsvps, duyệt/xóa wishes).
-- ==============================================================================

-- 1. TẠO BẢNG RSVPS (Xác nhận tham dự) NẾU CHƯA CÓ
CREATE TABLE IF NOT EXISTS public.rsvps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL,
  phone text,
  attending boolean NOT NULL DEFAULT true,
  guest_count integer NOT NULL DEFAULT 1,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ràng buộc dữ liệu hợp lệ cho rsvps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rsvps_guest_count_check'
  ) THEN
    ALTER TABLE public.rsvps
      ADD CONSTRAINT rsvps_guest_count_check
      CHECK (guest_count >= 0 AND guest_count <= 20);
  END IF;
END $$;

-- 2. TẠO BẢNG WISHES (Sổ lưu bút) NẾU CHƯA CÓ
CREATE TABLE IF NOT EXISTS public.wishes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL,
  message text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. TẠO BẢNG ADMIN_USERS (Danh sách tài khoản có quyền Quản trị)
-- Liên kết khóa ngoại với auth.users của Supabase Authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. HÀM KIỂM TRA QUYỀN ADMIN (SECURITY DEFINER FUNCTION)
-- Hàm này chạy với quyền của database owner (bỏ qua RLS khi kiểm tra chính admin_users)
-- Giúp kiểm tra tài khoản đang gửi request có nằm trong danh sách admin_users hay không.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- Cấp quyền gọi hàm cho người dùng đã đăng nhập (authenticated) và khách (anon)
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ==============================================================================
-- 5. KÍCH HOẠT ROW LEVEL SECURITY (RLS) TRÊN TẤT CẢ CÁC BẢNG
-- ==============================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Bật Realtime cho bảng wishes và rsvps (nếu chưa bật)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'wishes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rsvps'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Bỏ qua nếu publication không tồn tại trong môi trường cục bộ
    NULL;
END $$;

-- ==============================================================================
-- 6. THIẾT LẬP CHÍNH SÁCH BẢO MẬT (POLICIES) CHO BẢNG ADMIN_USERS
-- ==============================================================================
DROP POLICY IF EXISTS "admin_users_select_own" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_deny_anon" ON public.admin_users;

-- Người dùng đã đăng nhập chỉ có thể đọc bản ghi của chính họ (hoặc nếu là admin)
CREATE POLICY "admin_users_select_own" ON public.admin_users
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_admin());

-- Khách vãng lai (anon) hoàn toàn KHÔNG có quyền truy cập bảng admin_users

-- ==============================================================================
-- 7. THIẾT LẬP CHÍNH SÁCH BẢO MẬT (POLICIES) CHO BẢNG RSVPS
-- ==============================================================================
DROP POLICY IF EXISTS "rsvps_public_insert" ON public.rsvps;
DROP POLICY IF EXISTS "rsvps_admin_select" ON public.rsvps;
DROP POLICY IF EXISTS "rsvps_admin_update" ON public.rsvps;
DROP POLICY IF EXISTS "rsvps_admin_delete" ON public.rsvps;

-- A. Khách công khai (anon và authenticated) ĐƯỢC PHÉP gửi xác nhận tham dự (INSERT)
CREATE POLICY "rsvps_public_insert" ON public.rsvps
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- B. CHỈ ADMIN mới được quyền xem danh sách phản hồi RSVP (SELECT)
-- Khách vãng lai tuyệt đối KHÔNG THỂ đọc dữ liệu thông tin cá nhân/số điện thoại của người khác
CREATE POLICY "rsvps_admin_select" ON public.rsvps
FOR SELECT
TO authenticated
USING (public.is_admin());

-- C. CHỈ ADMIN mới được cập nhật hoặc xóa bản ghi RSVP
CREATE POLICY "rsvps_admin_update" ON public.rsvps
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "rsvps_admin_delete" ON public.rsvps
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ==============================================================================
-- 8. THIẾT LẬP CHÍNH SÁCH BẢO MẬT (POLICIES) CHO BẢNG WISHES
-- ==============================================================================
DROP POLICY IF EXISTS "wishes_public_select_approved" ON public.wishes;
DROP POLICY IF EXISTS "wishes_public_insert_pending" ON public.wishes;
DROP POLICY IF EXISTS "wishes_admin_select_all" ON public.wishes;
DROP POLICY IF EXISTS "wishes_admin_update" ON public.wishes;
DROP POLICY IF EXISTS "wishes_admin_delete" ON public.wishes;

-- A. Khách công khai (anon) CHỈ ĐƯỢC XEM những lời chúc ĐÃ ĐƯỢC DUYỆT (is_approved = true)
CREATE POLICY "wishes_public_select_approved" ON public.wishes
FOR SELECT
TO anon
USING (is_approved = true);

-- B. Khách công khai được gửi lời chúc mới, NHƯNG BẮT BUỘC is_approved = false (chờ duyệt)
-- Ngăn chặn kẻ xấu cố tình can thiệp gửi is_approved = true trực tiếp lên database
CREATE POLICY "wishes_public_insert_pending" ON public.wishes
FOR INSERT
TO anon, authenticated
WITH CHECK (is_approved = false);

-- C. ADMIN ĐƯỢC XEM TẤT CẢ lời chúc (cả đã duyệt và đang chờ duyệt)
CREATE POLICY "wishes_admin_select_all" ON public.wishes
FOR SELECT
TO authenticated
USING (public.is_admin());

-- D. CHỈ ADMIN mới được duyệt/bỏ duyệt lời chúc (UPDATE)
CREATE POLICY "wishes_admin_update" ON public.wishes
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- E. CHỈ ADMIN mới được xóa lời chúc không phù hợp (DELETE)
CREATE POLICY "wishes_admin_delete" ON public.wishes
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ==============================================================================
-- HƯỚNG DẪN THỰC HIỆN TẠO TÀI KHOẢN ADMIN ĐẦU TIÊN TRÊN SUPABASE:
-- ==============================================================================
-- Bước 1: Vào Supabase Dashboard -> Authentication -> Users -> Nhấn "Add user" -> "Create user".
--         Nhập Email và Password (ví dụ: admin@thiepcuoi.local / matkhaumanh123).
--         Sao chép mã UUID (User UID) vừa tạo.
--
-- Bước 2: Vào SQL Editor và chạy câu lệnh sau (thay thế UUID và Email tương ứng):
--
-- INSERT INTO public.admin_users (id, email)
-- VALUES ('<DAN_UUID_CUA_BAN_VAO_DAY>', 'admin@thiepcuoi.local')
-- ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
--
-- Bước 3: Đăng nhập vào trang admin.html bằng Email và Mật khẩu trên!
-- ==============================================================================
