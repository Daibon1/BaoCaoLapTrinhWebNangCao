# SRS_API_ADMIN - Đặc tả API admin

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 24/05/2026

---

## 1. Mô tả chức năng

Hệ thống có một nhóm route API dưới prefix `/admin/api`. API hiện tại gồm API lấy danh sách job và API đăng nhập account admin/employer trả JSON đồng thời set cookie `token`.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả |
| ----------- | ------- |
| Database | MongoDB kết nối thành công |
| Account API login | Email/password thuộc collection `accounts` |
| Validate | Request body có `email`, `password` hợp lệ |

---

## 3. Luồng xử lý chính

```text
Client gọi /admin/api/auth/login
        |
        v
validatesapi/admin/auth.validate.js kiểm tra body
        |
        v
Tìm Account theo email, deleted=false
        |
        v
So sánh md5(password)
        |
        v
Kiểm tra status != inactive
        |
        v
Set cookie token và trả JSON success

Client gọi /admin/api/job
        |
        v
Query Job deleted=false
        |
        v
Trả JSON danh sách jobs
```

---

## 4. Use Cases

### UC-01: API đăng nhập thành công

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Client/API consumer |
| **Mục tiêu** | Đăng nhập account qua JSON |
| **Luồng chính** | 1. POST email/password -> 2. Validate -> 3. Xác thực -> 4. Set cookie -> 5. Trả token và user |
| **Kết quả** | Response `{ success: true, data: { token, user } }` |

### UC-02: API đăng nhập thất bại

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Client/API consumer |
| **Luồng chính** | 1. POST sai email/password hoặc account inactive -> 2. API trả status lỗi |
| **Kết quả** | JSON `success: false` |

### UC-03: Lấy danh sách job API

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Client/API consumer |
| **Luồng chính** | 1. GET `/admin/api/job` -> 2. Query jobs `deleted=false` -> 3. Trả JSON |
| **Kết quả** | Danh sách jobs |

---

## 5. Input / Output

### API: `POST /admin/api/auth/login`

| Trường | Kiểu | Bắt buộc | Validate |
| -------- | ------ | ---------- | ---------- |
| `email` | string | Có | Không rỗng, không khoảng trắng, tối đa 30 ký tự |
| `password` | string | Có | Không rỗng, không khoảng trắng, 8-30 ký tự |

| Kết quả | HTTP Code | Mô tả |
| --------- | ----------- | ------- |
| Thành công | 200 | `{ success: true, message, data: { token, user } }` |
| Email không tồn tại | 404 | `{ success: false, message }` |
| Sai mật khẩu | 401 | `{ success: false, message }` |
| Tài khoản bị khóa | 403 | `{ success: false, message }` |
| Lỗi server | 500 | `{ success: false, message }` |
| Validate lỗi | 200 theo code hiện tại | `{ success: false, message }` |

### API: `GET /admin/api/job`

| Kết quả | HTTP Code | Mô tả |
| --------- | ----------- | ------- |
| Thành công | 200 | JSON array jobs có `deleted = false` |

---

## 6. Xử lý lỗi

| Tình huống | Xử lý |
| ------------ | ------- |
| Email thiếu/rỗng/có khoảng trắng | Trả JSON `success: false` |
| Email quá 30 ký tự | Trả JSON lỗi |
| Password thiếu/rỗng/có khoảng trắng | Trả JSON lỗi |
| Password dưới 8 hoặc hơn 30 ký tự | Trả JSON lỗi |
| Account không tồn tại | HTTP 404 |
| Sai mật khẩu | HTTP 401 |
| Account inactive | HTTP 403 |
| Exception server | HTTP 500 |

---

## 7. Giao diện mô tả

```text
API không có giao diện Pug.

POST /admin/api/auth/login
Body JSON:
{
  "email": "admin@example.com",
  "password": "12345678"
}

GET /admin/api/job
Response:
[
  { "_id": "...", "title": "...", "status": "active" }
]
```

---

## 8. File liên quan

| File | Vai trò |
| ------ | --------- |
| `api/admin/index.route.js` | Gắn route `/admin/api/...` |
| `api/admin/auth.route.js` | API login admin |
| `api/admin/job.route.js` | API list job |
| `validatesapi/admin/auth.validate.js` | Validate API login |
| `models/account.model.js` | Xác thực account |
| `models/jobs.model.js` | Lấy danh sách job |
| `tests/unit/validatesApi.test.js` | Test validate API login |
