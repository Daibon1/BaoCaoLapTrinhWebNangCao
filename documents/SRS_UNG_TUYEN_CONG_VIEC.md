# SRS_UNG_TUYEN_CONG_VIEC - Đặc tả chức năng ứng tuyển công việc

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 22/04/2026

---

## 1. Mô tả chức năng

Cho phép ứng viên đã đăng nhập nộp hồ sơ ứng tuyển cho một công việc đang hoạt động. Ứng viên upload CV PDF lên Cloudinary, nhập thư xin việc và hệ thống tạo bản ghi trong collection `applications`. Mỗi ứng viên chỉ có một hồ sơ ứng tuyển cho một job theo unique index `userId + jobId`.

---

## 2. Điều kiện tiên quyết

| Điều kiện  | Mô tả                                                     |
| ---------- | --------------------------------------------------------- |
| Người dùng | Đã đăng nhập bằng cookie `tokenUser`                      |
| Job        | Job tồn tại, `deleted = false`, `status = active`         |
| CV         | File upload bắt buộc, form accept `.pdf`                  |
| Upload     | Cloudinary credentials hợp lệ                             |
| Database   | Collection `applications` có unique index `userId, jobId` |

---

## 3. Luồng xử lý chính

```text
Ứng viên bấm ứng tuyển ở job
        |
        v
GET /applications/add/:jobId
        |
        v
auth.middleware kiểm tra tokenUser
        |
        v
Controller kiểm tra đã ứng tuyển chưa
        |
        v
Render form upload CV + cover letter
        |
        v
POST /applications/add/:jobId
        |
        v
checkApplied kiểm tra trùng
        |
        v
Multer nhận file cvUrl
        |
        v
Upload CV lên Cloudinary folder cvs
        |
        v
Tạo Application status pending
        |
        v
Redirect /applications
```

---

## 4. Use Cases

### UC-01: Ứng tuyển thành công

| Trường              | Nội dung                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **Tác nhân**        | Ứng viên đã đăng nhập                                                                                   |
| **Mục tiêu**        | Nộp CV cho job                                                                                          |
| **Điều kiện trước** | Chưa ứng tuyển job này                                                                                  |
| **Luồng chính**     | 1. Mở form -> 2. Chọn CV PDF -> 3. Nhập cover letter -> 4. Submit -> 5. Upload CV -> 6. Tạo application |
| **Điều kiện sau**   | Application có `status = pending`, `hiddenByUser = false`                                               |

### UC-02: Xem danh sách đã ứng tuyển

| Trường          | Nội dung                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Tác nhân**    | Ứng viên                                                                                                     |
| **Luồng chính** | 1. Truy cập `/applications` -> 2. Query application theo `userId` -> 3. Populate job và company -> 4. Render |
| **Kết quả**     | Hiển thị hồ sơ chưa bị user ẩn                                                                               |

### UC-03: Xóa hồ sơ khỏi danh sách

| Trường          | Nội dung                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| **Tác nhân**    | Ứng viên                                                                            |
| **Luồng chính** | 1. Gọi `/applications/delete/:id` -> 2. Update `hiddenByUser = true` -> 3. Redirect |
| **Kết quả**     | Hồ sơ không còn hiển thị phía ứng viên                                              |

### UC-04: Ứng tuyển lại sau khi đã ẩn

| Trường          | Nội dung                                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Ứng viên                                                                                                                     |
| **Luồng chính** | 1. Submit lại job đã ẩn -> 2. Tìm application cũ -> 3. Cập nhật CV, cover letter, `status = pending`, `hiddenByUser = false` |
| **Kết quả**     | Hồ sơ được mở lại thay vì tạo bản ghi trùng                                                                                  |

---

## 5. Input / Output

### Input

| Trường        | Kiểu          | Bắt buộc | Validate                   |
| ------------- | ------------- | -------- | -------------------------- |
| `jobId`       | path ObjectId | Có       | Job active và chưa deleted |
| `cvUrl`       | file PDF      | Có       | Upload qua Cloudinary      |
| `coverLetter` | string        | Không    | Lưu text                   |
| `tokenUser`   | cookie        | Có       | User đăng nhập             |

### Output

| Kết quả              | Dạng trả về                             | Mô tả                     |
| -------------------- | --------------------------------------- | ------------------------- |
| Mở form ứng tuyển    | Render `client/pages/application/add`   | Có thông tin job          |
| Ứng tuyển thành công | Redirect `/applications`                | Flash success             |
| Xem đã ứng tuyển     | Render `client/pages/application/index` | Danh sách application     |
| Xóa khỏi danh sách   | Redirect referrer                       | Set `hiddenByUser = true` |
| Chưa đăng nhập       | Redirect login                          | Flash lỗi                 |

---

## 6. Xử lý lỗi

| Tình huống                       | Xử lý                                      |
| -------------------------------- | ------------------------------------------ |
| Chưa đăng nhập                   | Middleware redirect `/user/login`          |
| Đã ứng tuyển job                 | Flash "Bạn đã ứng tuyển công việc này rồi" |
| Job không active                 | Không render job hợp lệ                    |
| Upload CV lỗi                    | Middleware chuyển lỗi                      |
| Lỗi DB                           | Flash lỗi và redirect `/applications`      |
| User chưa đăng nhập khi xem list | Render danh sách rỗng                      |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│  Thông tin công việc                │
│  Title - Location - Salary          │
├─────────────────────────────────────┤
│  CV của bạn (PDF) *                 │
│  [ Choose file ]                    │
│                                     │
│  Thư xin việc                       │
│  [____________________________]     │
│  [____________________________]     │
│                                     │
│        [ Ứng tuyển ngay ]           │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                           | Vai trò                                   |
| ---------------------------------------------- | ----------------------------------------- |
| `router/client/application.route.js`           | Route list/add/delete application         |
| `controller/client/application.controller.js`  | Logic ứng tuyển, kiểm tra trùng, ẩn hồ sơ |
| `middlewares/client/auth.middleware.js`        | Bắt đăng nhập khi ứng tuyển/xóa           |
| `middlewares/client/uploadCloud.middleware.js` | Upload CV PDF lên Cloudinary              |
| `models/application.model.js`                  | Schema application và unique index        |
| `models/jobs.model.js`                         | Kiểm tra job active                       |
| `views/client/pages/application/add.pug`       | Form ứng tuyển                            |
| `views/client/pages/application/index.pug`     | Danh sách đã ứng tuyển                    |
