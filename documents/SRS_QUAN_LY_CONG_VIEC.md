# SRS_QUAN_LY_CONG_VIEC - Đặc tả chức năng quản lý công việc

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 24/04/2026

---

## 1. Mô tả chức năng

Cho phép admin/employer xem, tìm kiếm, lọc, sắp xếp, tạo, sửa, đổi trạng thái, đổi vị trí, xem chi tiết và xóa mềm công việc. Job mới được tạo với `status = pending`; employer chỉ quản lý job do mình tạo và chỉ được bật/tắt job đã được admin duyệt.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả                                                      |
| --------- | ---------------------------------------------------------- |
| Đăng nhập | Có cookie admin `token`                                    |
| Quyền     | Role có permission phù hợp, đặc biệt `jobs-create` khi tạo |
| Company   | Tài khoản tạo job phải có `company_id`                     |
| Category  | Có danh mục để chọn khi tạo/sửa                            |
| Upload    | Cloudinary hoạt động nếu upload thumbnail                  |

---

## 3. Luồng xử lý chính

```text
Admin/employer vào /admin/job
        |
        v
Auth middleware nạp user/role
        |
        v
Controller build filter status/keyword/location
        |
        v
Nếu role Employer -> lọc createdBy.account_id = user._id
        |
        v
Query jobs, pagination, sort
        |
        v
Render danh sách

Tạo job
        |
        v
Kiểm tra quyền jobs-create và user.company_id
        |
        v
Validate salary/title/skill
        |
        v
Upload thumbnail nếu có
        |
        v
Lưu job status=pending, company_id=user.company_id
```

---

## 4. Use Cases

### UC-01: Xem danh sách công việc

| Trường          | Nội dung                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| **Tác nhân**    | Admin/employer                                                                 |
| **Mục tiêu**    | Quản lý danh sách job                                                          |
| **Luồng chính** | 1. Mở `/admin/job` -> 2. Áp dụng filter/sort/page -> 3. Query job -> 4. Render |
| **Kết quả**     | Employer chỉ thấy job của mình                                                 |

### UC-02: Tạo công việc mới

| Trường              | Nội dung                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **Tác nhân**        | Employer/admin có quyền                                                                                 |
| **Điều kiện trước** | Có company_id                                                                                           |
| **Luồng chính**     | 1. Mở form -> 2. Nhập title, salary, skill, category, location, type -> 3. Submit -> 4. Lưu job pending |
| **Điều kiện sau**   | Job chờ admin duyệt                                                                                     |

### UC-03: Admin duyệt job

| Trường          | Nội dung                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| **Tác nhân**    | Admin                                                                    |
| **Luồng chính** | 1. Chọn job pending -> 2. Đổi status active/inactive -> 3. Lưu updatedBy |
| **Kết quả**     | Job active sẽ hiển thị phía client                                       |

### UC-04: Employer bật/tắt job đã duyệt

| Trường          | Nội dung                                                                              |
| --------------- | ------------------------------------------------------------------------------------- |
| **Tác nhân**    | Employer sở hữu job                                                                   |
| **Luồng chính** | 1. Chọn job active/inactive của mình -> 2. Đổi active <-> inactive -> 3. Lưu cập nhật |
| **Kết quả**     | Employer không thể tự duyệt pending thành active                                      |

### UC-05: Xóa mềm job

| Trường          | Nội dung                                                              |
| --------------- | --------------------------------------------------------------------- |
| **Tác nhân**    | Admin/employer có thao tác xóa                                        |
| **Luồng chính** | 1. Confirm xóa -> 2. Set `deleted = true`, `deletedBy` -> 3. Redirect |
| **Kết quả**     | Job không còn trong danh sách mặc định                                |

---

## 5. Input / Output

### Input

| Trường                   | Kiểu        | Bắt buộc      | Validate                              |
| ------------------------ | ----------- | ------------- | ------------------------------------- |
| `title`                  | string      | Có            | Không rỗng                            |
| `description`            | string      | Không         | Tinymce textarea                      |
| `category`               | string      | Không         | ID danh mục                           |
| `thumbnail`              | file        | Không         | Upload Cloudinary                     |
| `salaryMin`, `salaryMax` | number      | Có            | Là số, >= 0, min <= max               |
| `skill`                  | string/list | Không         | Tối đa 5 skill, mỗi skill <= 20 ký tự |
| `location`               | string      | Không         | Theo option form                      |
| `type`                   | string      | Không         | Full-time/Part-time                   |
| `position`               | number      | Không         | Tự tăng nếu bỏ trống                  |
| `status`                 | string      | Theo thao tác | `pending`, `active`, `inactive`       |

### Output

| Kết quả         | Dạng trả về                    | Mô tả                      |
| --------------- | ------------------------------ | -------------------------- |
| Danh sách       | Render `admin/pages/job/index` | `jobs`, filter, pagination |
| Tạo thành công  | Redirect `/admin/job`          | Flash success              |
| Sửa thành công  | Redirect `/admin/job/edit/:id` | Flash success              |
| Đổi trạng thái  | Redirect referrer              | Flash success              |
| Xóa mềm         | Redirect referrer              | Set `deleted = true`       |
| API list nội bộ | JSON                           | `/admin/job/api` trả jobs  |

---

## 6. Xử lý lỗi

| Tình huống                              | Xử lý                              |
| --------------------------------------- | ---------------------------------- |
| Không có quyền tạo hoặc chưa có company | Flash lỗi và redirect `/admin/job` |
| Salary không phải số                    | Flash lỗi                          |
| Salary âm                               | Flash lỗi                          |
| Salary min lớn hơn max                  | Flash lỗi                          |
| Title rỗng                              | Flash lỗi                          |
| Skill quá số lượng/độ dài               | Flash lỗi                          |
| Status không hợp lệ                     | Flash lỗi                          |
| Employer đổi pending sang active        | Flash lỗi không có quyền           |
| Lỗi DB/upload                           | Flash lỗi và redirect              |

---

## 7. Giao diện mô tả

```text
┌────────────────────────────────────────────┐
│ Quản lý công việc                          │
│ [Status] [Keyword] [Location] [Sort]       │
│ [Tạo việc làm]                             │
├────────────────────────────────────────────┤
│ [] Title | Status | Position | Creator     │
│ [] Title | Status | Position | Creator     │
├────────────────────────────────────────────┤
│ Bulk action: [active/inactive/delete/pos]  │
└────────────────────────────────────────────┘

Form tạo/sửa
  Thông tin chính
  Yêu cầu và đãi ngộ
  Thumbnail và trạng thái
```

---

## 8. File liên quan

| File                                          | Vai trò                            |
| --------------------------------------------- | ---------------------------------- |
| `router/admin/job.route.js`                   | Route CRUD job                     |
| `controller/admin/job.controller.js`          | Logic quản lý job                  |
| `validates/admin/job.validate.js`             | Validate salary/title              |
| `middlewares/admin/auth.middleware.js`        | Bảo vệ route                       |
| `middlewares/admin/uploadCloud.middleware.js` | Upload thumbnail                   |
| `models/jobs.model.js`                        | Schema job                         |
| `models/jobs-category.model.js`               | Dữ liệu category                   |
| `models/account.model.js`                     | Người tạo/cập nhật                 |
| `helpers/filterSearch.js`                     | Filter keyword/location            |
| `helpers/pagination.js`                       | Phân trang                         |
| `helpers/createTree.js`                       | Cây danh mục                       |
| `public/admin/js/job.js`                      | Đổi status, delete, validate skill |
| `views/admin/pages/job/`                      | Các trang index/create/edit/detail |
