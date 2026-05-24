# SRS_QUEN_MAT_KHAU - Đặc tả chức năng quên mật khẩu

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 24/05/2026

---

## 1. Mô tả chức năng

Cho phép ứng viên yêu cầu đặt lại mật khẩu bằng email. Hệ thống tạo OTP 8 chữ số, lưu vào collection `forgot-password` với thời hạn 3 phút, gửi OTP qua email và cho phép đặt lại mật khẩu sau khi xác minh OTP thành công.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả |
| ----------- | ------- |
| Người dùng | Email đã tồn tại trong collection `users` |
| Email service | `EMAIL_USER` và `EMAIL_PASSWORD` hợp lệ |
| Database | TTL index của `expireAt` trong model forgot password hoạt động |
| Cookie | Sau khi OTP đúng, hệ thống lưu `tokenUser` để cho phép reset password |

---

## 3. Luồng xử lý chính

```text
Người dùng mở /user/password/forgot
        |
        v
Nhập email và submit
        |
        v
Controller kiểm tra email trong users
        |
        v
Tạo OTP 8 số và lưu vào forgot-password
        |
        v
Gửi email chứa OTP
        |
        v
Redirect sang /user/password/otp?email=...
        |
        v
Người dùng nhập OTP
        |
        v
OTP đúng -> lưu cookie tokenUser
        |
        v
Nhập mật khẩu mới và xác nhận
        |
        v
Hash MD5 password mới, cập nhật User
        |
        v
Redirect về /
```

---

## 4. Use Cases

### UC-01: Gửi OTP thành công

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Ứng viên quên mật khẩu |
| **Mục tiêu** | Nhận OTP qua email |
| **Điều kiện trước** | Email tồn tại |
| **Luồng chính** | 1. Nhập email -> 2. Submit -> 3. Hệ thống tạo OTP -> 4. Gửi mail -> 5. Sang màn hình OTP |
| **Điều kiện sau** | OTP được lưu tạm trong DB và tự hết hạn sau 180 giây |

### UC-02: Xác minh OTP thành công

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Ứng viên đã nhận OTP |
| **Luồng chính** | 1. Nhập email + OTP -> 2. Hệ thống tìm bản ghi OTP -> 3. Lưu cookie `tokenUser` -> 4. Sang trang reset |
| **Kết quả** | Người dùng được phép đặt mật khẩu mới |

### UC-03: Đặt lại mật khẩu thành công

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Ứng viên đã xác minh OTP |
| **Luồng chính** | 1. Nhập password và confirmPassword -> 2. Validate -> 3. Update password MD5 -> 4. Redirect `/` |
| **Kết quả** | Mật khẩu mới được lưu trong collection `users` |

---

## 5. Input / Output

### Input

| Trường | Kiểu | Bắt buộc | Validate |
| -------- | ------ | ---------- | ---------- |
| `email` | string | Có | Không rỗng, email tồn tại |
| `otp` | string/number | Có | Không rỗng, trùng bản ghi trong DB |
| `password` | string | Có | Không rỗng, tối thiểu 8 ký tự |
| `confirmPassword` | string | Có | Trùng `password` |

### Output

| Kết quả | Dạng trả về | Mô tả |
| --------- | ------------- | ------- |
| Gửi OTP thành công | Redirect `/user/password/otp?email=...` | Email OTP được gửi |
| OTP đúng | Redirect `/user/password/reset` | Lưu cookie `tokenUser` |
| Reset thành công | Redirect `/` | Flash success |
| Lỗi validate | Redirect referrer | Flash lỗi |

---

## 6. Xử lý lỗi

| Tình huống | Xử lý |
| ------------ | ------- |
| Email không tồn tại | Flash "Email không tồn tại" |
| OTP rỗng | Flash "Mã OTP không được để trống" |
| OTP sai/hết hạn | Flash "Mã OTP không đúng" |
| Password rỗng | Flash "Mật khẩu không được để trống" |
| Password dưới 8 ký tự | Flash "Mật khẩu phải có ít nhất 8 ký tự" |
| Password không khớp | Flash "Mật khẩu không khớp" |
| Gửi email lỗi | Helper ghi log lỗi mail |

---

## 7. Giao diện mô tả

```text
┌──────────────────────────────┐
│      Lấy lại mật khẩu        │
│  Email                       │
│  [____________________]      │
│  [ Gửi mail xác nhận ]       │
└──────────────────────────────┘

┌──────────────────────────────┐
│       Xác nhận mã OTP        │
│  Email [readonly]            │
│  OTP                         │
│  [____________________]      │
│  [ Xác nhận OTP ]            │
└──────────────────────────────┘

┌──────────────────────────────┐
│       Đổi mật khẩu           │
│  Mật khẩu mới                │
│  Xác nhận mật khẩu           │
│  [ Đổi mật khẩu ]            │
└──────────────────────────────┘
```

---

## 8. File liên quan

| File | Vai trò |
| ------ | --------- |
| `router/client/user.route.js` | Route forgot/otp/reset password |
| `controller/client/user.controller.js` | Logic tạo OTP, gửi mail, reset password |
| `validates/client/user.validate.js` | Validate OTP và reset password |
| `models/forgot-password.model.js` | Schema OTP có TTL 180 giây |
| `models/user.model.js` | Cập nhật password user |
| `helpers/generate.js` | Tạo OTP 8 số |
| `helpers/sendMail.js` | Gửi email OTP |
| `views/client/pages/user/forgot-password.pug` | Form nhập email |
| `views/client/pages/user/otp-password.pug` | Form nhập OTP |
| `views/client/pages/user/reset-password.pug` | Form mật khẩu mới |
