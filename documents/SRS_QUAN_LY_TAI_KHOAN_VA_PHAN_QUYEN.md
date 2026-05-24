# SRS_QUAN_LY_TAI_KHOAN_VA_PHAN_QUYEN - Đặc tả chức năng tài khoản và phân quyền

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 24/05/2026

---

## 1. Mô tả chức năng

Cho phép admin quản lý tài khoản quản trị/nhà tuyển dụng, nhóm quyền, bảng phân quyền và tài khoản ứng viên phía client. Hệ thống dùng collection `accounts` cho admin/employer, `roles` cho nhóm quyền và `users` cho ứng viên.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả |
| ----------- | ------- |
| Đăng nhập | Có cookie admin `token` |
| Role | User hiện tại có role và permissions |
| Account | Collection `accounts` hoạt động |
| User client | Collection `users` hoạt động |

---

## 3. Luồng xử lý chính

```text
Admin vào /admin/account hoặc /admin/roles
        |
        v
Auth middleware nạp user/role
        |
        v
Controller build filter status/keyword/page
        |
        v
Query accounts/users/roles
        |
        v
Render danh sách

Phân quyền
        |
        v
Admin tick permission theo từng role
        |
        v
JS gom dữ liệu thành JSON permissions
        |
        v
PATCH /admin/roles/permissions
        |
        v
Cập nhật permissions cho từng role
```

---

## 4. Use Cases

### UC-01: Quản lý account admin/employer

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin |
| **Mục tiêu** | Tạo, sửa, khóa/mở khóa, xóa mềm account |
| **Luồng chính** | 1. Mở `/admin/account` -> 2. Search/filter/page -> 3. Tạo/sửa account -> 4. Gán role |
| **Kết quả** | Account được quản lý trong collection `accounts` |

### UC-02: Quản lý role

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin |
| **Mục tiêu** | Tạo, sửa, xem, xóa mềm nhóm quyền |
| **Luồng chính** | 1. Mở `/admin/roles` -> 2. Tạo/sửa role -> 3. Lưu title, description |
| **Kết quả** | Role được dùng để phân quyền account |

### UC-03: Cập nhật bảng phân quyền

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin |
| **Luồng chính** | 1. Mở `/admin/roles/permissions` -> 2. Tick permission -> 3. JS tạo JSON -> 4. PATCH -> 5. Update role.permissions |
| **Kết quả** | Middleware/controller dùng permission mới ở request sau |

### UC-04: Quản lý tài khoản ứng viên

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin có permission `client-users-view/edit/delete` |
| **Luồng chính** | 1. Mở `/admin/client-user` -> 2. Xem/search/filter -> 3. Khóa/mở khóa hoặc xóa mềm user |
| **Kết quả** | User client bị khóa hoặc ẩn khỏi danh sách |

### UC-05: Tài khoản của tôi

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin/employer đã đăng nhập |
| **Luồng chính** | 1. Mở `/admin/my-account` -> 2. Xem thông tin -> 3. Mở edit -> 4. Update account hiện tại |
| **Kết quả** | Thông tin account được cập nhật |

---

## 5. Input / Output

### Input

| Nhóm | Trường | Validate |
| ------ | -------- | ---------- |
| Account | `fullName`, `email`, `password`, `role_id`, `phone`, `status`, `avatar` | Tên/email không rỗng, password >= 8 khi tạo |
| Role | `title`, `description`, `permissions` | Trim khi edit, permissions là array |
| User client | `status`, `id` | ID user hợp lệ |
| Filter | `status`, `keyword`, `page` | Query string |

### Output

| Kết quả | Dạng trả về | Mô tả |
| --------- | ------------- | ------- |
| Account list | Render `admin/pages/account/index` | Có role đã populate thủ công |
| Role list | Render `admin/pages/roles/index` | Danh sách role |
| Permissions | Render/PATCH permissions | Cập nhật role.permissions |
| Client user list | Render `admin/pages/client-user/index` | Users không có password/token |
| My account | Render/PATCH | Account hiện tại |

---

## 6. Xử lý lỗi

| Tình huống | Xử lý |
| ------------ | ------- |
| Email account đã tồn tại | Flash lỗi |
| Password tạo account dưới 8 ký tự | Flash lỗi |
| Không có quyền xem/sửa/xóa user client | Flash lỗi và redirect |
| Lỗi parse JSON permissions | Flash lỗi phân quyền |
| Lỗi DB account/role/user | Flash lỗi và redirect |
| Xóa account/role/user | Xóa mềm bằng `deleted = true` |

---

## 7. Giao diện mô tả

```text
Quản lý tài khoản
┌─────────────────────────────────────┐
│ [Status] [Keyword] [Tạo tài khoản]  │
│ Name | Email | Role | Status | ...  │
└─────────────────────────────────────┘

Phân quyền
┌─────────────────────────────────────┐
│ Permission       | Admin | Employer │
│ jobs-create      |  [x]  |   [x]    │
│ client-users-view|  [x]  |   [ ]    │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File | Vai trò |
| ------ | --------- |
| `router/admin/account.route.js` | CRUD account |
| `controller/admin/account.controller.js` | Logic account |
| `validates/admin/account.validate.js` | Validate account |
| `router/admin/role.route.js` | CRUD role và permissions |
| `controller/admin/role.controller.js` | Logic role/permissions |
| `router/admin/client-user.route.js` | Quản lý user client |
| `controller/admin/client-user.controller.js` | Logic khóa/xóa user client |
| `router/admin/my-account.route.js` | Tài khoản của tôi |
| `controller/admin/my-account.controller.js` | Xem/sửa account hiện tại |
| `models/account.model.js` | Schema account |
| `models/role.model.js` | Schema role |
| `models/user.model.js` | Schema ứng viên |
| `public/admin/js/role.js` | Gom dữ liệu permissions |
| `public/admin/js/account.js` | Status/delete/toggle password/avatar preview |
| `views/admin/pages/account/` | Trang account |
| `views/admin/pages/roles/` | Trang role/permissions |
| `views/admin/pages/client-user/index.pug` | Trang user client |
| `views/admin/pages/my-account/` | Trang my account |
