# SRS_TONG_QUAN_HE_THONG - Đặc tả tổng quan hệ thống

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 09/05/2026

---

## 1. Mô tả chức năng

Hệ thống cung cấp website tìm kiếm việc làm cho ứng viên và khu quản trị cho admin/nhà tuyển dụng. Ứng viên có thể tìm việc, lưu việc, ứng tuyển, quản lý hồ sơ. Nhà tuyển dụng đăng ký tài khoản, tạo hồ sơ công ty, đăng việc và duyệt hồ sơ ứng tuyển. Admin quản lý tài khoản, quyền, danh mục, việc làm, công ty và người dùng.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả                                                   |
| --------- | ------------------------------------------------------- |
| Runtime   | Node.js và npm đã được cài đặt                          |
| Database  | Có MongoDB hoặc MongoDB Atlas, cấu hình qua `MONGO_URL` |
| Email     | Có tài khoản Gmail/app password cho Nodemailer          |
| Upload    | Có Cloudinary credentials                               |
| Env       | File `.env` có đủ biến môi trường cần thiết             |

---

## 3. Luồng xử lý chính

```text
Người dùng truy cập website
        |
        v
index.js khởi tạo Express + middleware + view + static
        |
        v
Kết nối MongoDB qua config/database.js
        |
        v
Gắn route client, route admin và route API
        |
        v
Middleware đọc cookie, user, role, category, saved jobs
        |
        v
Controller xử lý nghiệp vụ
        |
        v
Model Mongoose thao tác MongoDB
        |
        v
Render Pug hoặc trả JSON API
```

---

## 4. Use Cases

### UC-01: Ứng viên sử dụng website

| Trường            | Nội dung                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **Tác nhân**      | Ứng viên/người xem việc                                                                          |
| **Mục tiêu**      | Tìm việc, lưu việc, ứng tuyển, theo dõi hồ sơ                                                    |
| **Luồng chính**   | 1. Truy cập trang chủ -> 2. Tìm kiếm/lọc việc -> 3. Xem chi tiết -> 4. Đăng nhập -> 5. Ứng tuyển |
| **Điều kiện sau** | Hồ sơ ứng tuyển/lưu việc được ghi vào database                                                   |

### UC-02: Nhà tuyển dụng sử dụng trang quản lý

| Trường            | Nội dung                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| **Tác nhân**      | Nhà tuyển dụng đã được admin duyệt                                               |
| **Mục tiêu**      | Tạo công ty, đăng việc, quản lý hồ sơ ứng tuyển                                  |
| **Luồng chính**   | 1. Đăng nhập admin -> 2. Tạo công ty -> 3. Tạo việc chờ duyệt -> 4. Xem ứng viên |
| **Điều kiện sau** | Việc làm/hồ sơ ứng tuyển được quản lý theo tài khoản employer                    |

### UC-03: Admin quản lý hệ thống

| Trường            | Nội dung                                                                |
| ----------------- | ----------------------------------------------------------------------- |
| **Tác nhân**      | Admin                                                                   |
| **Mục tiêu**      | Quản lý account, role, việc làm, danh mục, user, công ty                |
| **Luồng chính**   | 1. Đăng nhập -> 2. Vào dashboard -> 3. Thực hiện các nghiệp vụ quản trị |
| **Điều kiện sau** | Dữ liệu hệ thống được cập nhật theo quyền                               |

---

## 5. Input / Output

### Input

| Nguồn       | Dữ liệu                                        |
| ----------- | ---------------------------------------------- |
| Form client | Đăng ký, đăng nhập, tìm kiếm, ứng tuyển, hồ sơ |
| Form admin  | Việc làm, danh mục, tài khoản, quyền, công ty  |
| Cookie      | `tokenUser`, `token`, `saveJobId`              |
| File upload | Avatar, logo, thumbnail, CV PDF                |
| Env         | Port, database, Cloudinary, email, OAuth       |

### Output

| Kết quả        | Mô tả                                     |
| -------------- | ----------------------------------------- |
| Render HTML    | Trang Pug phía client/admin               |
| Redirect       | Chuyển hướng sau khi submit form          |
| Flash message  | Thông báo thành công/lỗi                  |
| JSON           | API admin trả dữ liệu jobs hoặc đăng nhập |
| Database state | Tạo/cập nhật/xóa mềm bản ghi MongoDB      |

---

## 6. Xử lý lỗi

| Tình huống                  | Xử lý                                   |
| --------------------------- | --------------------------------------- |
| Chưa đăng nhập route bảo vệ | Redirect về trang login tương ứng       |
| Token cookie không hợp lệ   | Flash lỗi và redirect login             |
| Lỗi validate form           | Flash lỗi và quay lại referrer          |
| Lỗi database                | Ghi log server, flash lỗi hoặc redirect |
| Upload lỗi                  | Middleware chuyển lỗi cho Express       |
| Email lỗi                   | Ghi log trong helper gửi mail           |

---

## 7. Giao diện mô tả

```text
Client website
  Header + menu danh mục
  Trang chủ / Việc làm / Công ty / Ứng tuyển / Hồ sơ

Admin website
  Sidebar + header
  Dashboard
  Quản lý việc làm, danh mục, tài khoản, quyền, công ty, ứng tuyển
```

---

## 8. File liên quan

| File/Thư mục                  | Vai trò                            |
| ----------------------------- | ---------------------------------- |
| `index.js`                    | Entry chạy server thật             |
| `app.js`                      | App Express dùng cho test          |
| `config/database.js`          | Kết nối MongoDB                    |
| `config/passport.js`          | Google/Facebook OAuth cho user     |
| `router/client/`              | Route phía client                  |
| `router/admin/`               | Route phía admin                   |
| `api/admin/`                  | API admin                          |
| `controller/`                 | Logic nghiệp vụ                    |
| `models/`                     | Schema Mongoose                    |
| `middlewares/`                | Auth, upload, category, saved jobs |
| `validates/`, `validatesapi/` | Validate request                   |
| `views/`                      | Template Pug                       |
| `public/`                     | CSS, JS, image, upload static      |
| `tests/`                      | Unit/integration tests             |
