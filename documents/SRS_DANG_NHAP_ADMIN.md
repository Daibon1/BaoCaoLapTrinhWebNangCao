# SRS_DANG_NHAP_ADMIN - Đặc tả chức năng đăng nhập trang quản lý

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 29/04/2026

---

## 1. Mô tả chức năng

Cho phép admin và nhà tuyển dụng đăng nhập vào trang quản lý bằng email và mật khẩu. Khi xác thực thành công, hệ thống lưu cookie `token` dạng httpOnly trong 24 giờ, middleware admin nạp `res.locals.user` và `res.locals.role` để bảo vệ các route `/admin/...`.

---

## 2. Điều kiện tiên quyết

| Điều kiện  | Mô tả                                         |
| ---------- | --------------------------------------------- |
| Account    | Tài khoản tồn tại trong collection `accounts` |
| Trạng thái | `status` khác `inactive`                      |
| Mật khẩu   | Password nhập vào khớp MD5 trong DB           |
| Role       | Account có `role_id` trỏ tới role hợp lệ      |

---

## 3. Luồng xử lý chính

```text
Người dùng mở /admin/auth/login
        |
        v
Nhập email và mật khẩu
        |
        v
validates/admin/auth.validate.js kiểm tra input
        |
        v
AuthController tìm Account theo email, deleted=false
        |
        v
So sánh md5(password) với user.password
        |
        v
Kiểm tra user.status != inactive
        |
        v
Set cookie token httpOnly maxAge 24h
        |
        v
Redirect /admin/dashboard
```

---

## 4. Use Cases

### UC-01: Đăng nhập admin thành công

| Trường              | Nội dung                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| **Tác nhân**        | Admin hoặc employer đã được mở khóa                                                               |
| **Mục tiêu**        | Truy cập trang quản lý                                                                            |
| **Điều kiện trước** | Email/mật khẩu đúng, tài khoản active                                                             |
| **Luồng chính**     | 1. Mở login -> 2. Nhập thông tin -> 3. Xác thực -> 4. Set cookie `token` -> 5. Redirect dashboard |
| **Điều kiện sau**   | Các route admin đọc được user và role                                                             |

### UC-02: Đăng nhập thất bại do sai thông tin

| Trường          | Nội dung                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Tác nhân**    | Người dùng nhập sai email/mật khẩu                                                               |
| **Luồng chính** | 1. Submit form -> 2. Không tìm thấy email hoặc sai password -> 3. Flash lỗi -> 4. Quay lại login |
| **Kết quả**     | Không tạo cookie `token`                                                                         |

### UC-03: Tài khoản bị khóa/chưa duyệt

| Trường          | Nội dung                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Tác nhân**    | Account có `status = inactive`                                                                   |
| **Luồng chính** | 1. Submit đúng email/password -> 2. Controller kiểm tra status -> 3. Flash lỗi tài khoản bị khóa |
| **Kết quả**     | Không vào được admin                                                                             |

### UC-04: Đăng xuất admin

| Trường          | Nội dung                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| **Tác nhân**    | Admin/employer đã đăng nhập                                                          |
| **Luồng chính** | 1. Gọi `/admin/auth/logout` -> 2. Clear cookie `token` -> 3. Redirect login/referrer |
| **Kết quả**     | Phiên admin kết thúc                                                                 |

---

## 5. Input / Output

### Input

| Trường     | Kiểu   | Bắt buộc | Validate                                             |
| ---------- | ------ | -------- | ---------------------------------------------------- |
| `email`    | string | Có       | Không rỗng, không chứa khoảng trắng, tối đa 30 ký tự |
| `password` | string | Có       | Không rỗng, không chứa khoảng trắng, 8-30 ký tự      |

### Output

| Kết quả             | Dạng trả về                 | Mô tả                |
| ------------------- | --------------------------- | -------------------- |
| Thành công          | Redirect `/admin/dashboard` | Set cookie `token`   |
| Email không tồn tại | Redirect login/referrer     | Flash lỗi            |
| Sai mật khẩu        | Redirect login/referrer     | Flash lỗi            |
| Tài khoản inactive  | Redirect login/referrer     | Flash lỗi            |
| Logout              | Redirect login/referrer     | Clear cookie `token` |

---

## 6. Xử lý lỗi

| Tình huống                          | Xử lý                                        |
| ----------------------------------- | -------------------------------------------- |
| Email rỗng hoặc có khoảng trắng     | Flash lỗi validate                           |
| Email dài hơn 30 ký tự              | Flash lỗi validate                           |
| Password dưới 8 hoặc hơn 30 ký tự   | Flash lỗi validate                           |
| Không có cookie khi vào route admin | Flash "Bạn chưa đăng nhập" và redirect login |
| Token không tìm thấy account        | Flash lỗi và redirect login                  |
| Role không hợp lệ                   | Không đủ dữ liệu phân quyền cho route sau    |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│        Đăng nhập hệ thống           │
│  Email                              │
│  [____________________________]     │
│  Mật khẩu                           │
│  [________________________] [eye]   │
│                                     │
│        [ Đăng nhập ]                │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                   | Vai trò                           |
| -------------------------------------- | --------------------------------- |
| `router/admin/auth.route.js`           | Route login/logout admin          |
| `controller/admin/auth.controller.js`  | Logic xác thực account            |
| `validates/admin/auth.validate.js`     | Validate form login               |
| `middlewares/admin/auth.middleware.js` | Bảo vệ route admin, nạp user/role |
| `models/account.model.js`              | Schema tài khoản admin/employer   |
| `models/role.model.js`                 | Schema role và permissions        |
| `views/admin/pages/auth/login.pug`     | Giao diện đăng nhập               |
| `public/admin/js/auth.js`              | Enter focus và toggle password    |
