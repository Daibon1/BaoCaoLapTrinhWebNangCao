# SRS_HO_SO_UNG_VIEN - Đặc tả chức năng hồ sơ ứng viên

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 16/05/2026

---

## 1. Mô tả chức năng

Cho phép ứng viên đã đăng nhập xem thông tin tài khoản và cập nhật hồ sơ cá nhân. Hệ thống bảo vệ route bằng cookie `tokenUser`, upload file qua Cloudinary nếu form có file và cập nhật dữ liệu vào collection `users`.

---

## 2. Điều kiện tiên quyết

| Điều kiện  | Mô tả                                                |
| ---------- | ---------------------------------------------------- |
| Người dùng | Đã đăng nhập bằng cookie `tokenUser`                 |
| Tài khoản  | User tồn tại trong database                          |
| Upload     | Cloudinary credentials hợp lệ nếu cập nhật avatar/CV |

---

## 3. Luồng xử lý chính

```text
Ứng viên mở /user/info
        |
        v
auth.middleware kiểm tra tokenUser
        |
        v
Nạp user vào res.locals.user
        |
        v
Render trang thông tin tài khoản
        |
        v
Ứng viên mở /user/info/edit
        |
        v
Submit form cập nhật
        |
        v
UploadCloudUser xử lý file nếu có
        |
        v
User.updateOne theo _id hiện tại
        |
        v
Flash success và redirect /user/info
```

---

## 4. Use Cases

### UC-01: Xem thông tin hồ sơ

| Trường              | Nội dung                                                                  |
| ------------------- | ------------------------------------------------------------------------- |
| **Tác nhân**        | Ứng viên đã đăng nhập                                                     |
| **Mục tiêu**        | Xem thông tin tài khoản cá nhân                                           |
| **Điều kiện trước** | Cookie `tokenUser` hợp lệ                                                 |
| **Luồng chính**     | 1. Truy cập `/user/info` -> 2. Middleware xác thực -> 3. Render thông tin |
| **Điều kiện sau**   | Không thay đổi dữ liệu                                                    |

### UC-02: Cập nhật hồ sơ thành công

| Trường            | Nội dung                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| **Tác nhân**      | Ứng viên đã đăng nhập                                                                                    |
| **Mục tiêu**      | Cập nhật họ tên, email, phone, avatar/CV hoặc trường hồ sơ                                               |
| **Luồng chính**   | 1. Mở `/user/info/edit` -> 2. Nhập dữ liệu -> 3. Submit PATCH -> 4. Upload file nếu có -> 5. Update user |
| **Điều kiện sau** | User trong DB được cập nhật                                                                              |

### UC-03: Truy cập khi chưa đăng nhập

| Trường          | Nội dung                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Khách chưa đăng nhập                                                                                    |
| **Luồng chính** | 1. Truy cập `/user/info` hoặc `/user/info/edit` -> 2. Middleware không thấy cookie -> 3. Redirect login |
| **Kết quả**     | Không xem/sửa được hồ sơ                                                                                |

---

## 5. Input / Output

### Input

| Trường            | Kiểu   | Bắt buộc               | Validate              |
| ----------------- | ------ | ---------------------- | --------------------- |
| Các field profile | string | Không bắt buộc toàn bộ | Theo form client      |
| File avatar/CV    | file   | Không                  | Upload qua Cloudinary |
| `tokenUser`       | cookie | Có                     | Phải tìm thấy user    |

### Output

| Kết quả             | Dạng trả về                     | Mô tả                      |
| ------------------- | ------------------------------- | -------------------------- |
| Xem hồ sơ           | Render `client/pages/user/info` | Hiển thị `res.locals.user` |
| Mở form sửa         | Render `client/pages/user/edit` | Form edit profile          |
| Cập nhật thành công | Redirect `/user/info`           | Flash success              |
| Chưa đăng nhập      | Redirect `/user/login`          | Flash lỗi                  |

---

## 6. Xử lý lỗi

| Tình huống                | Xử lý                                        |
| ------------------------- | -------------------------------------------- |
| Không có `tokenUser`      | Flash "Bạn chưa đăng nhập" và redirect login |
| Token không tìm thấy user | Flash "Bạn chưa đăng nhập" và redirect login |
| Lỗi upload                | Middleware chuyển lỗi cho Express            |
| Lỗi cập nhật DB           | Flash lỗi và redirect `/user/info/edit`      |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│         Thông tin tài khoản         │
│  Avatar                             │
│  Họ tên                             │
│  Email                              │
│  Số điện thoại                      │
│                                     │
│        [ Chỉnh sửa ]                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       Chỉnh sửa thông tin           │
│  [Các trường hồ sơ]                 │
│  [Upload avatar/CV nếu có]          │
│        [ Cập nhật ]                 │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                               | Vai trò                               |
| -------------------------------------------------- | ------------------------------------- |
| `router/client/user.route.js`                      | Route `/user/info`, `/user/info/edit` |
| `controller/client/user.controller.js`             | Logic xem/sửa hồ sơ                   |
| `middlewares/client/auth.middleware.js`            | Bảo vệ route hồ sơ                    |
| `middlewares/client/uploadCloudUser.middleware.js` | Upload nhiều file lên Cloudinary      |
| `models/user.model.js`                             | Schema user                           |
| `views/client/pages/user/info.pug`                 | Trang thông tin                       |
| `views/client/pages/user/edit.pug`                 | Trang chỉnh sửa                       |
