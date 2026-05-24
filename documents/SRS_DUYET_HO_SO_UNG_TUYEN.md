# SRS_DUYET_HO_SO_UNG_TUYEN - Đặc tả chức năng duyệt hồ sơ ứng tuyển

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 14/05/2026

---

## 1. Mô tả chức năng

Cho phép employer xem các hồ sơ ứng tuyển vào các job do mình tạo, lọc theo job/trạng thái/từ khóa, cập nhật trạng thái hồ sơ và gửi email thông báo khi trạng thái thay đổi sang `interview`, `accepted` hoặc `rejected`.

---

## 2. Điều kiện tiên quyết

| Điều kiện     | Mô tả                                             |
| ------------- | ------------------------------------------------- |
| Đăng nhập     | Có cookie admin `token`                           |
| Job ownership | Chỉ lấy job có `createdBy.account_id = user._id`  |
| Permission    | Cập nhật trạng thái cần `user-approval-edit`      |
| Email         | `EMAIL_USER`, `EMAIL_PASSWORD` hợp lệ để gửi mail |
| Application   | Hồ sơ có user và job liên quan                    |

---

## 3. Luồng xử lý chính

```text
Employer mở /admin/user-approval
        |
        v
Lấy danh sách job do employer tạo
        |
        v
Build filter application theo jobIds
        |
        v
Áp dụng jobId/status/keyword nếu có
        |
        v
Query applications, populate jobId và userId
        |
        v
Render danh sách và thống kê

Cập nhật trạng thái
        |
        v
PATCH /admin/user-approval/change-status/:id
        |
        v
Kiểm tra permission user-approval-edit
        |
        v
Cập nhật Application.status
        |
        v
Nếu status thay đổi -> gửi email nếu có template
```

---

## 4. Use Cases

### UC-01: Xem danh sách hồ sơ ứng tuyển

| Trường          | Nội dung                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Tác nhân**    | Employer                                                                                         |
| **Mục tiêu**    | Xem ứng viên ứng tuyển vào job của mình                                                          |
| **Luồng chính** | 1. Mở `/admin/user-approval` -> 2. Lấy jobIds của employer -> 3. Query applications -> 4. Render |
| **Kết quả**     | Danh sách hồ sơ có user/job được populate                                                        |

### UC-02: Lọc hồ sơ

| Trường          | Nội dung                                                                                |
| --------------- | --------------------------------------------------------------------------------------- |
| **Tác nhân**    | Employer                                                                                |
| **Luồng chính** | 1. Chọn job/status hoặc nhập keyword -> 2. Controller build filter -> 3. Render kết quả |
| **Kết quả**     | Danh sách hồ sơ theo điều kiện                                                          |

### UC-03: Cập nhật trạng thái hồ sơ

| Trường          | Nội dung                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Employer có quyền `user-approval-edit`                                                            |
| **Luồng chính** | 1. Chọn trạng thái -> 2. Submit PATCH -> 3. Update application -> 4. Gửi mail nếu status thay đổi |
| **Kết quả**     | Ứng viên nhận email với trạng thái mới nếu có template                                            |

---

## 5. Input / Output

### Input

| Trường    | Kiểu              | Bắt buộc            | Validate                                                    |
| --------- | ----------------- | ------------------- | ----------------------------------------------------------- |
| `jobId`   | query ObjectId    | Không               | Job thuộc employer                                          |
| `status`  | query/body string | Không/Có khi update | `pending`, `reviewing`, `interview`, `accepted`, `rejected` |
| `keyword` | query string      | Không               | Search user fullName/email                                  |
| `id`      | path ObjectId     | Có khi update       | Application tồn tại                                         |

### Output

| Kết quả              | Dạng trả về                              | Mô tả                                    |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| Danh sách            | Render `admin/pages/user-approval/index` | Applications, jobs, counters             |
| Update thành công    | Redirect referrer                        | Flash success                            |
| Không có quyền       | Redirect `/admin/user-approval`          | Flash lỗi                                |
| Không tìm thấy hồ sơ | Redirect referrer                        | Flash lỗi                                |
| Gửi email            | Nodemailer                               | Gửi thông báo trạng thái nếu có template |

---

## 6. Xử lý lỗi

| Tình huống                    | Xử lý                                  |
| ----------------------------- | -------------------------------------- |
| Không có quyền update         | Flash "Bạn không có quyền truy cập"    |
| Application không tồn tại     | Flash "Không tìm thấy hồ sơ ứng tuyển" |
| Lỗi DB khi update             | Flash lỗi và redirect                  |
| Status không có template mail | Chỉ update, không gửi mail             |
| Email user thiếu              | Không gửi mail                         |

---

## 7. Giao diện mô tả

```text
┌────────────────────────────────────────────┐
│ Duyệt ứng tuyển                            │
│ [Job] [Status] [Keyword]                   │
│ Total | Pending | Accepted                 │
├────────────────────────────────────────────┤
│ Candidate | Job | CV | Status | Action     │
│ Candidate | Job | CV | Status | Action     │
└────────────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                           | Vai trò                        |
| ---------------------------------------------- | ------------------------------ |
| `router/admin/user-approval.route.js`          | Route list/update application  |
| `controller/admin/user-approval.controller.js` | Logic lọc, cập nhật, gửi email |
| `models/application.model.js`                  | Schema application             |
| `models/user.model.js`                         | Thông tin ứng viên             |
| `models/jobs.model.js`                         | Job của employer               |
| `helpers/sendMail.js`                          | Gửi email kết quả              |
| `helpers/pagination.js`                        | Phân trang                     |
| `views/admin/pages/user-approval/index.pug`    | Giao diện duyệt hồ sơ          |
| `public/admin/js/user-approval.js`             | JS liên quan form trạng thái   |
