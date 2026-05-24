# SRS_DASHBOARD_ADMIN - Đặc tả chức năng dashboard quản trị

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 15/05/2026

---

## 1. Mô tả chức năng

Hiển thị thống kê tổng quan trong trang quản lý. Admin xem thống kê toàn hệ thống; employer chỉ xem thống kê liên quan tới các việc làm do chính tài khoản đó tạo.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả                                                      |
| --------- | ---------------------------------------------------------- |
| Đăng nhập | Có cookie `token` hợp lệ                                   |
| Role      | Middleware đã nạp `res.locals.role`                        |
| Dữ liệu   | Có collection jobs, job categories, accounts, applications |

---

## 3. Luồng xử lý chính

```text
Người dùng truy cập /admin/dashboard
        |
        v
Auth middleware kiểm tra token
        |
        v
Dashboard controller kiểm tra role.title
        |
        v
Nếu Employer -> lọc job theo createdBy.account_id
Nếu Admin -> lấy toàn bộ job chưa deleted
        |
        v
Đếm total/active/inactive/category/account/application
        |
        v
Aggregate job theo category và tháng
        |
        v
Render dashboard
```

---

## 4. Use Cases

### UC-01: Admin xem dashboard toàn hệ thống

| Trường          | Nội dung                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Admin                                                                                          |
| **Mục tiêu**    | Nắm số liệu tổng quan                                                                          |
| **Luồng chính** | 1. Đăng nhập -> 2. Mở dashboard -> 3. Controller đếm toàn bộ job/account/category -> 4. Render |
| **Kết quả**     | Thống kê toàn hệ thống                                                                         |

### UC-02: Employer xem dashboard của mình

| Trường          | Nội dung                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Employer                                                                                      |
| **Mục tiêu**    | Xem số liệu các job mình tạo                                                                  |
| **Luồng chính** | 1. Đăng nhập -> 2. Mở dashboard -> 3. Lọc job theo account -> 4. Đếm application thuộc job đó |
| **Kết quả**     | Thống kê giới hạn theo employer                                                               |

### UC-03: Lỗi khi lấy dữ liệu dashboard

| Trường          | Nội dung                                                                    |
| --------------- | --------------------------------------------------------------------------- |
| **Tác nhân**    | Admin/employer                                                              |
| **Luồng chính** | 1. Truy cập dashboard -> 2. Query lỗi -> 3. Ghi log -> 4. Redirect `/admin` |
| **Kết quả**     | Không render dữ liệu lỗi                                                    |

---

## 5. Input / Output

### Input

| Trường       | Kiểu   | Bắt buộc | Validate                    |
| ------------ | ------ | -------- | --------------------------- |
| `token`      | cookie | Có       | Account hợp lệ              |
| `role.title` | string | Có       | Xác định admin hay Employer |

### Output

| Dữ liệu            | Mô tả                                                |
| ------------------ | ---------------------------------------------------- |
| `totalJob`         | Tổng job theo filter                                 |
| `activeJob`        | Job active                                           |
| `inactiveJob`      | Job inactive                                         |
| `totalCategory`    | Tổng danh mục                                        |
| `totalAccount`     | Tổng account, employer nhận 0                        |
| `totalApplication` | Tổng hồ sơ của employer, admin hiện nhận 0 theo code |
| `newJobWeek`       | Job mới trong 7 ngày                                 |
| `percentActive`    | Tỷ lệ job active                                     |
| `jobByCategory`    | Aggregate job theo category                          |
| `jobByMonth`       | Aggregate job theo tháng                             |

---

## 6. Xử lý lỗi

| Tình huống     | Xử lý                                      |
| -------------- | ------------------------------------------ |
| Chưa đăng nhập | Auth middleware redirect login             |
| Không có role  | Dữ liệu role không đủ để xác định employer |
| Lỗi MongoDB    | Ghi log và redirect `/admin`               |
| Không có job   | Các số đếm về 0, `percentActive = 0`       |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│ Dashboard                           │
│ [Total Jobs] [Active] [Inactive]    │
│ [Categories] [Accounts] [Apps]      │
├─────────────────────────────────────┤
│ Chart: Jobs by category             │
│ Chart: Status / monthly jobs        │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                       | Vai trò                  |
| ------------------------------------------ | ------------------------ |
| `router/admin/dashboard.route.js`          | Route `/admin/dashboard` |
| `controller/admin/dashboard.controller.js` | Logic thống kê           |
| `middlewares/admin/auth.middleware.js`     | Bảo vệ dashboard         |
| `models/jobs.model.js`                     | Dữ liệu job              |
| `models/jobs-category.model.js`            | Dữ liệu category         |
| `models/account.model.js`                  | Dữ liệu account          |
| `models/application.model.js`              | Dữ liệu application      |
| `views/admin/pages/dashboard/index.pug`    | Giao diện dashboard      |
| `public/admin/js/dashboard.js`             | Render chart             |
