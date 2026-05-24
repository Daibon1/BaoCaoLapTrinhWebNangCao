# SRS_QUAN_LY_CONG_TY - Đặc tả chức năng quản lý công ty

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 20/05/2026

---

## 1. Mô tả chức năng

Cho phép tài khoản admin/employer xem công ty của mình, tạo hồ sơ công ty và cập nhật thông tin công ty. Sau khi tạo công ty thành công, hệ thống gắn `company_id` vào account hiện tại để account có thể tạo job.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả                                     |
| --------- | ----------------------------------------- |
| Đăng nhập | Có cookie admin `token`                   |
| Account   | Account hiện tại tồn tại trong `accounts` |
| Tạo mới   | Account chưa có `company_id`              |
| Upload    | Cloudinary hoạt động nếu upload logo      |

---

## 3. Luồng xử lý chính

```text
Người dùng vào /admin/company/my-company
        |
        v
Tìm Company theo res.locals.user.company_id
        |
        v
Render thông tin công ty

Tạo công ty
        |
        v
Người dùng nhập name, email, phone, website, address, description, size, logo
        |
        v
Upload logo lên Cloudinary nếu có
        |
        v
Kiểm tra các field bắt buộc trong controller
        |
        v
Tạo Company với createdBy.account_id
        |
        v
Update Account.company_id = newCompany._id
```

---

## 4. Use Cases

### UC-01: Tạo hồ sơ công ty thành công

| Trường            | Nội dung                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân**      | Employer/admin chưa có công ty                                                                                       |
| **Mục tiêu**      | Hoàn thiện công ty trước khi đăng việc                                                                               |
| **Luồng chính**   | 1. Mở `/admin/company/create` -> 2. Nhập thông tin -> 3. Upload logo -> 4. Tạo company -> 5. Gắn company vào account |
| **Điều kiện sau** | Account có `company_id`, có thể tạo job                                                                              |

### UC-02: Xem công ty của tôi

| Trường          | Nội dung                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| **Tác nhân**    | Account đã có công ty                                                                |
| **Luồng chính** | 1. Mở `/admin/company/my-company` -> 2. Query company theo `company_id` -> 3. Render |
| **Kết quả**     | Hiển thị hồ sơ công ty                                                               |

### UC-03: Cập nhật công ty

| Trường          | Nội dung                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Tác nhân**    | Account có quyền truy cập form edit                                                       |
| **Luồng chính** | 1. Mở `/admin/company/edit/:id` -> 2. Sửa thông tin/logo -> 3. PATCH -> 4. Update company |
| **Kết quả**     | Dữ liệu công ty được cập nhật                                                             |

---

## 5. Input / Output

### Input

| Trường        | Kiểu   | Bắt buộc khi tạo   | Validate                                               |
| ------------- | ------ | ------------------ | ------------------------------------------------------ |
| `name`        | string | Có                 | Không rỗng                                             |
| `email`       | string | Có theo controller | Không rỗng khi tạo                                     |
| `phone`       | string | Có theo controller | Không rỗng khi tạo                                     |
| `website`     | string | Không              | Lưu text                                               |
| `address`     | string | Có                 | Không rỗng                                             |
| `description` | string | Có                 | Không rỗng                                             |
| `size`        | string | Có                 | Một trong `1-10`, `10-50`, `50-100`, `100-500`, `500+` |
| `logo`        | file   | Có theo controller | Upload Cloudinary                                      |

### Output

| Kết quả        | Dạng trả về                        | Mô tả                                |
| -------------- | ---------------------------------- | ------------------------------------ |
| Xem công ty    | Render `admin/pages/company/index` | `company`                            |
| Tạo thành công | Redirect `/admin/company/create`   | Flash success, account có company_id |
| Sửa thành công | Redirect `/admin/company/edit/:id` | Flash success                        |
| Thiếu dữ liệu  | Redirect create                    | Flash lỗi                            |

---

## 6. Xử lý lỗi

| Tình huống               | Xử lý                                        |
| ------------------------ | -------------------------------------------- |
| Account đã có công ty    | View create hiển thị cảnh báo đã tạo công ty |
| Thiếu thông tin bắt buộc | Flash "Vui lòng điền các thông tin công ty"  |
| Lỗi tạo công ty          | Flash lỗi và redirect create                 |
| Lỗi cập nhật             | Flash lỗi và redirect edit                   |
| Lỗi upload logo          | Middleware chuyển lỗi                        |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│       Tạo hồ sơ công ty             │
│  Tên công ty *                      │
│  Email / Phone / Website            │
│  Quy mô công ty                     │
│  Địa chỉ                            │
│  Mô tả công ty                      │
│  Logo công ty                       │
│        [ Tạo công ty ]              │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                          | Vai trò                      |
| --------------------------------------------- | ---------------------------- |
| `router/admin/company.route.js`               | Route my-company/create/edit |
| `controller/admin/company.controller.js`      | Logic quản lý công ty        |
| `models/company.model.js`                     | Schema company               |
| `models/account.model.js`                     | Gắn `company_id` cho account |
| `middlewares/admin/uploadCloud.middleware.js` | Upload logo                  |
| `views/admin/pages/company/index.pug`         | Trang công ty của tôi        |
| `views/admin/pages/company/create.pug`        | Form tạo công ty             |
| `views/admin/pages/company/edit.pug`          | Form sửa công ty             |
