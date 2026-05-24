# SRS_DANG_KY_NHA_TUYEN_DUNG - Đặc tả chức năng đăng ký nhà tuyển dụng

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 24/05/2026

---

## 1. Mô tả chức năng

Cho phép nhà tuyển dụng gửi yêu cầu đăng ký tài khoản quản lý. Hệ thống tạo bản ghi trong collection `accounts`, gán role có title `Employer`, đặt `status = inactive` để chờ admin mở khóa/duyệt trước khi đăng nhập trang quản lý.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả |
| ----------- | ------- |
| Role | Phải có role `Employer` trong collection `roles` |
| Email | Chưa tồn tại trong `accounts` với `deleted = false` |
| Password | Tối thiểu 8 ký tự |
| Admin | Admin cần mở khóa tài khoản sau khi đăng ký |

---

## 3. Luồng xử lý chính

```text
Nhà tuyển dụng mở /employer/register
        |
        v
Nhập fullName, email, phone, password
        |
        v
Validate dữ liệu
        |
        v
Kiểm tra email đã dùng chưa
        |
        v
Tìm role title = Employer
        |
        v
Tạo Account:
  password = md5(password)
  role_id = Employer.id
  status = inactive
        |
        v
Flash success và redirect /admin/auth/login
```

---

## 4. Use Cases

### UC-01: Đăng ký nhà tuyển dụng thành công

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Nhà tuyển dụng mới |
| **Mục tiêu** | Tạo tài khoản quản lý tuyển dụng |
| **Điều kiện trước** | Có role Employer, email chưa dùng |
| **Luồng chính** | 1. Mở form -> 2. Nhập thông tin -> 3. Submit -> 4. Tạo account inactive -> 5. Redirect login admin |
| **Điều kiện sau** | Tài khoản chờ admin duyệt/mở khóa |

### UC-02: Email đã tồn tại

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Nhà tuyển dụng |
| **Luồng chính** | 1. Nhập email đã có -> 2. Controller phát hiện trùng -> 3. Flash lỗi -> 4. Quay lại form |
| **Kết quả** | Không tạo tài khoản mới |

### UC-03: Chưa cấu hình role Employer

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Nhà tuyển dụng |
| **Luồng chính** | 1. Submit form -> 2. Không tìm thấy role Employer -> 3. Flash lỗi liên hệ admin |
| **Kết quả** | Không tạo account |

---

## 5. Input / Output

### Input

| Trường | Kiểu | Bắt buộc | Validate |
| -------- | ------ | ---------- | ---------- |
| `fullName` | string | Có | Trim, không rỗng |
| `email` | string | Có | Trim, không rỗng, không trùng |
| `phone` | string | Không | Trim nếu có |
| `password` | string | Có | Tối thiểu 8 ký tự |

### Output

| Kết quả | Dạng trả về | Mô tả |
| --------- | ------------- | ------- |
| Thành công | Redirect `/admin/auth/login` | Flash tài khoản đang chờ admin duyệt |
| Email trùng | Redirect referrer | Flash lỗi |
| Thiếu role Employer | Redirect referrer | Flash lỗi |
| Lỗi server | Redirect referrer | Flash lỗi |

---

## 6. Xử lý lỗi

| Tình huống | Xử lý |
| ------------ | ------- |
| Tên rỗng | Flash "Tên không được để trống" |
| Email rỗng | Flash "Email không được để trống" |
| Password dưới 8 ký tự | Flash "Mật khẩu phải có ít nhất 8 ký tự" |
| Email đã được sử dụng | Flash "Email đã được sử dụng" |
| Không có role Employer | Flash yêu cầu liên hệ quản trị viên |
| Lỗi tạo account | Flash lỗi chung |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│      Đăng ký nhà tuyển dụng         │
│  Tên người liên hệ *                │
│  [____________________________]     │
│  Email công việc *                  │
│  [____________________________]     │
│  Số điện thoại                      │
│  [____________________________]     │
│  Mật khẩu *                         │
│  [____________________________]     │
│  Tài khoản sẽ chờ admin duyệt       │
│        [ Gửi đăng ký ]              │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File | Vai trò |
| ------ | --------- |
| `router/client/employer.route.js` | Route `/employer/register` |
| `controller/client/employer.controller.js` | Logic đăng ký employer |
| `validates/client/employer.validate.js` | Validate form employer |
| `models/account.model.js` | Schema account admin/employer |
| `models/role.model.js` | Tìm role `Employer` |
| `views/client/pages/employer/register.pug` | Giao diện đăng ký employer |
