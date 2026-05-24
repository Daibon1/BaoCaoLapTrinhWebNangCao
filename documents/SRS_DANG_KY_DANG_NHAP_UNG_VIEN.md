# SRS_DANG_KY_DANG_NHAP_UNG_VIEN - Đặc tả chức năng tài khoản ứng viên

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 10/05/2026

---

## 1. Mô tả chức năng

Cho phép ứng viên đăng ký tài khoản, đăng nhập bằng email/mật khẩu, đăng nhập bằng Google/Facebook và đăng xuất. Sau khi xác thực thành công, hệ thống lưu cookie `tokenUser`, nạp thông tin user vào `res.locals.user` và chuyển về trang chủ.

---

## 2. Điều kiện tiên quyết

| Điều kiện    | Mô tả                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------- |
| Database     | Collection `users` hoạt động                                                                        |
| Đăng ký      | Email chưa tồn tại trong hệ thống                                                                   |
| Đăng nhập    | Tài khoản tồn tại, mật khẩu đúng, `status = active`                                                 |
| Social login | Có `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `BASE_URL` |

---

## 3. Luồng xử lý chính

```text
Người dùng mở /user/login hoặc /user/register
        |
        v
Nhập thông tin và submit form
        |
        v
Validate dữ liệu trong validates/client/user.validate.js
        |
        v
Controller kiểm tra email / password / trạng thái
        |
        v
Tạo hoặc tìm User trong MongoDB
        |
        v
Lưu cookie tokenUser
        |
        v
Gắn/đồng bộ saved job theo saveJobId nếu có
        |
        v
Flash success và redirect về /
```

---

## 4. Use Cases

### UC-01: Đăng ký ứng viên thành công

| Trường              | Nội dung                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Tác nhân**        | Ứng viên mới                                                                                                       |
| **Mục tiêu**        | Tạo tài khoản để lưu việc và ứng tuyển                                                                             |
| **Điều kiện trước** | Email chưa được sử dụng                                                                                            |
| **Luồng chính**     | 1. Mở `/user/register` -> 2. Nhập họ tên, email, mật khẩu -> 3. Submit -> 4. Tạo user -> 5. Lưu cookie `tokenUser` |
| **Điều kiện sau**   | User mới có `status = active`, `deleted = false`                                                                   |

### UC-02: Đăng nhập ứng viên thành công

| Trường              | Nội dung                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân**        | Ứng viên đã có tài khoản                                                                                                  |
| **Mục tiêu**        | Vào hệ thống để dùng chức năng cá nhân                                                                                    |
| **Điều kiện trước** | Email tồn tại, mật khẩu đúng                                                                                              |
| **Luồng chính**     | 1. Mở `/user/login` -> 2. Nhập email/mật khẩu -> 3. Kiểm tra MD5 password -> 4. Lưu cookie `tokenUser` -> 5. Redirect `/` |
| **Điều kiện sau**   | `res.locals.user` có thông tin user ở các request sau                                                                     |

### UC-03: Đăng nhập Google/Facebook

| Trường          | Nội dung                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Ứng viên có tài khoản Google/Facebook                                                                                                  |
| **Luồng chính** | 1. Click Google/Facebook -> 2. OAuth callback -> 3. Tìm user theo provider id/email -> 4. Tạo hoặc cập nhật user -> 5. Lưu `tokenUser` |
| **Kết quả**     | Đăng nhập thành công hoặc quay lại `/user/login`                                                                                       |

### UC-04: Đăng xuất

| Trường          | Nội dung                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| **Tác nhân**    | Ứng viên đã đăng nhập                                                                |
| **Luồng chính** | 1. Gọi `/user/logout` -> 2. Xóa cookie `tokenUser` và `saveJobId` -> 3. Redirect `/` |
| **Kết quả**     | Không còn phiên đăng nhập ứng viên                                                   |

---

## 5. Input / Output

### Input

| Trường        | Kiểu   | Bắt buộc            | Validate                                         |
| ------------- | ------ | ------------------- | ------------------------------------------------ |
| `fullName`    | string | Có khi đăng ký      | Không rỗng                                       |
| `email`       | string | Có                  | Không rỗng, input HTML type email                |
| `password`    | string | Có                  | Tối thiểu 8 ký tự                                |
| OAuth profile | object | Có khi social login | Có provider id, email/avatar nếu provider trả về |

### Output

| Kết quả                 | Dạng trả về       | Mô tả                                       |
| ----------------------- | ----------------- | ------------------------------------------- |
| Đăng ký thành công      | Redirect `/`      | Tạo user, cookie `tokenUser`, flash success |
| Đăng nhập thành công    | Redirect `/`      | Cookie `tokenUser`, flash success           |
| Social login thành công | Redirect `/`      | Cookie `tokenUser`, flash success           |
| Đăng xuất               | Redirect `/`      | Xóa cookie liên quan                        |
| Lỗi                     | Redirect referrer | Flash message lỗi                           |

---

## 6. Xử lý lỗi

| Tình huống                        | Xử lý                                    |
| --------------------------------- | ---------------------------------------- |
| Họ tên rỗng                       | Flash "Tên không được để trống"          |
| Email rỗng                        | Flash "Email không được để trống"        |
| Mật khẩu dưới 8 ký tự             | Flash "Mật khẩu phải có ít nhất 8 ký tự" |
| Email đã được sử dụng             | Flash "Email đã được sử dụng"            |
| Email không tồn tại khi đăng nhập | Flash "Email không tồn tại"              |
| Sai mật khẩu                      | Flash "Mật khẩu không đúng"              |
| User bị khóa                      | Flash "Tài khoản đã bị khóa"             |
| OAuth thất bại                    | Redirect `/user/login` và flash lỗi      |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│        Đăng nhập ứng viên           │
│                                     │
│  Email                              │
│  [____________________________]     │
│                                     │
│  Mật khẩu                           │
│  [____________________________]     │
│                                     │
│  Quên mật khẩu?                     │
│                                     │
│        [ Đăng nhập ]                │
│                                     │
│  Hoặc đăng nhập với Google/Facebook │
│  Chưa có tài khoản? Đăng ký         │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                    | Vai trò                                                       |
| --------------------------------------- | ------------------------------------------------------------- |
| `router/client/user.route.js`           | Khai báo route `/user/register`, `/user/login`, OAuth, logout |
| `controller/client/user.controller.js`  | Logic đăng ký, đăng nhập, logout, OAuth callback              |
| `validates/client/user.validate.js`     | Validate form đăng ký/đăng nhập                               |
| `middlewares/client/user.middleware.js` | Nạp user từ cookie `tokenUser`                                |
| `middlewares/client/auth.middleware.js` | Bảo vệ route cần đăng nhập                                    |
| `models/user.model.js`                  | Schema user                                                   |
| `models/saved-jobs.model.js`            | Đồng bộ saved jobs khi login                                  |
| `config/passport.js`                    | Cấu hình Google/Facebook Strategy                             |
| `views/client/pages/user/login.pug`     | Giao diện đăng nhập                                           |
| `views/client/pages/user/register.pug`  | Giao diện đăng ký                                             |
