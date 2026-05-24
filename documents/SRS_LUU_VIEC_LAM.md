# SRS_LUU_VIEC_LAM - Đặc tả chức năng lưu việc làm

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 24/05/2026

---

## 1. Mô tả chức năng

Cho phép người dùng lưu hoặc bỏ lưu việc làm. Hệ thống dùng cookie `saveJobId` để định danh danh sách lưu. Khi ứng viên đăng nhập, danh sách lưu có thể được gắn với `userId` để duy trì dữ liệu theo tài khoản.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả |
| ----------- | ------- |
| Middleware | `savejob.middleware.js` tạo/đọc cookie `saveJobId` |
| Dữ liệu | Collection `saved-jobs` tồn tại |
| Job | Job được lưu có `_id` hợp lệ |
| Cookie | `saveJobId` hợp lệ hoặc được tạo mới |

---

## 3. Luồng xử lý chính

```text
Người dùng truy cập website
        |
        v
saveJob middleware kiểm tra cookie saveJobId
        |
        v
Không có cookie -> tạo SavedJob mới và set cookie
        |
        v
Người dùng bấm lưu việc
        |
        v
POST /saved-jobs/add/:jobId
        |
        v
Nếu jobId đã có -> $pull khỏi jobIds
Nếu chưa có -> $push vào jobIds
        |
        v
Flash message và redirect referrer
```

---

## 4. Use Cases

### UC-01: Lưu việc thành công

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Khách hoặc ứng viên |
| **Mục tiêu** | Lưu job để xem lại |
| **Điều kiện trước** | Cookie `saveJobId` hợp lệ |
| **Luồng chính** | 1. Bấm lưu -> 2. Controller tìm SavedJob -> 3. Job chưa có trong `jobIds` -> 4. `$push` jobId |
| **Điều kiện sau** | Job xuất hiện trong danh sách đã lưu |

### UC-02: Bỏ lưu việc

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Người dùng đã lưu job |
| **Luồng chính** | 1. Bấm lại nút lưu hoặc xóa -> 2. Controller `$pull` jobId khỏi `jobIds` -> 3. Redirect |
| **Kết quả** | Job không còn trong danh sách đã lưu |

### UC-03: Xem danh sách việc đã lưu

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Khách hoặc ứng viên |
| **Luồng chính** | 1. Truy cập `/saved-jobs` -> 2. Lấy saved job theo cookie -> 3. Query jobs nằm trong `jobIds` -> 4. Render |
| **Kết quả** | Hiển thị các job đã lưu |

---

## 5. Input / Output

### Input

| Trường | Kiểu | Bắt buộc | Validate |
| -------- | ------ | ---------- | ---------- |
| `jobId` | path string | Có | Dùng để push/pull trong `jobIds` |
| `saveJobId` | cookie | Có | Phải là Mongo ObjectId hợp lệ |
| `tokenUser` | cookie | Không | Dùng để gắn `userId` khi đăng nhập |

### Output

| Kết quả | Dạng trả về | Mô tả |
| --------- | ------------- | ------- |
| Lưu thành công | Redirect referrer | Flash success |
| Bỏ lưu thành công | Redirect referrer | Flash success |
| Xem danh sách | Render `client/pages/saved-jobs/index` | `savedJobs` |
| Không tìm thấy saved list | Redirect referrer | Flash lỗi |

---

## 6. Xử lý lỗi

| Tình huống | Xử lý |
| ------------ | ------- |
| Không có cookie `saveJobId` | Middleware tạo bản ghi mới |
| Cookie không phải ObjectId | Middleware tạo bản ghi mới |
| Bản ghi saved job đã bị xóa | Clear cookie và request tiếp tục |
| Không tìm thấy saved job khi add | Flash lỗi |
| Lỗi DB khi lưu/xóa | Flash lỗi và redirect |

---

## 7. Giao diện mô tả

```text
Job card
┌──────────────────────────────────┐
│ Backend Developer                │
│ Company - Location - Salary      │
│ [Xem chi tiết]      [Lưu/Bỏ lưu] │
└──────────────────────────────────┘

Trang việc đã lưu
┌──────────────────────────────────┐
│ Việc làm đã lưu                  │
│ - Job 1               [Xóa]      │
│ - Job 2               [Xóa]      │
└──────────────────────────────────┘
```

---

## 8. File liên quan

| File | Vai trò |
| ------ | --------- |
| `router/client/saved-job.route.js` | Route add/list/delete saved jobs |
| `controller/client/saved-job.controller.js` | Logic lưu, bỏ lưu, list saved jobs |
| `middlewares/client/savejob.middleware.js` | Tạo/đọc cookie `saveJobId` |
| `controller/client/user.controller.js` | Gắn saved jobs với user khi login |
| `models/saved-jobs.model.js` | Schema saved jobs |
| `models/jobs.model.js` | Lấy thông tin job đã lưu |
| `views/client/pages/saved-jobs/index.pug` | Trang danh sách việc đã lưu |
