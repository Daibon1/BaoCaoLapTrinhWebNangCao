# SRS_QUAN_LY_DANH_MUC_VIEC_LAM - Đặc tả chức năng quản lý danh mục việc làm

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 24/05/2026

---

## 1. Mô tả chức năng

Cho phép admin quản lý danh mục việc làm dạng cây: xem danh sách, tìm kiếm, lọc trạng thái, tạo mới, sửa, xem chi tiết, đổi trạng thái và xóa mềm danh mục. Danh mục active được dùng ở menu client và bộ lọc category.

---

## 2. Điều kiện tiên quyết

| Điều kiện | Mô tả |
| ----------- | ------- |
| Đăng nhập | Có cookie `token` hợp lệ |
| Dữ liệu | Collection `jobs-category` hoạt động |
| Slug | Slug tự sinh từ `title` |
| Upload | Cloudinary hoạt động nếu upload thumbnail |

---

## 3. Luồng xử lý chính

```text
Admin vào /admin/job-category
        |
        v
Build filter deleted=false, status, keyword
        |
        v
Query category, sort position asc, paginate
        |
        v
Render danh sách

Tạo/sửa category
        |
        v
Lấy danh mục hiện có và build tree
        |
        v
Nhập title, parent_id, description, status, position, thumbnail
        |
        v
Validate title
        |
        v
Lưu hoặc cập nhật category
```

---

## 4. Use Cases

### UC-01: Xem danh sách danh mục

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin |
| **Mục tiêu** | Quản lý danh mục job |
| **Luồng chính** | 1. Mở `/admin/job-category` -> 2. Lọc/tìm kiếm -> 3. Query -> 4. Render |
| **Kết quả** | Danh sách category chưa bị xóa |

### UC-02: Tạo danh mục

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin |
| **Luồng chính** | 1. Mở form create -> 2. Chọn parent nếu có -> 3. Nhập title -> 4. Submit -> 5. Lưu category |
| **Điều kiện sau** | Category có slug và position |

### UC-03: Cập nhật danh mục

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin |
| **Luồng chính** | 1. Mở edit -> 2. Sửa thông tin -> 3. PATCH -> 4. Update DB |
| **Kết quả** | Danh mục được cập nhật |

### UC-04: Xóa mềm danh mục

| Trường | Nội dung |
| -------- | ---------- |
| **Tác nhân** | Admin |
| **Luồng chính** | 1. Confirm xóa -> 2. Set `deleted = true`, `deleteAt` -> 3. Redirect |
| **Kết quả** | Danh mục không hiển thị trong list mặc định |

---

## 5. Input / Output

### Input

| Trường | Kiểu | Bắt buộc | Validate |
| -------- | ------ | ---------- | ---------- |
| `title` | string | Có | Không rỗng |
| `parent_id` | string | Không | ID category cha |
| `thumbnail` | file/string | Không | Upload nếu có |
| `description` | string | Không | Lưu mô tả |
| `status` | string | Không | Active/inactive theo form |
| `position` | number | Không | Tự tăng nếu bỏ trống |
| `keyword` | query | Không | Search title regex |

### Output

| Kết quả | Dạng trả về | Mô tả |
| --------- | ------------- | ------- |
| Danh sách | Render `admin/pages/job-category/index` | `records`, filter, pagination |
| Tạo thành công | Redirect `/admin/job-category` | Flash success |
| Sửa thành công | Redirect `/admin/job-category/edit/:id` | Flash success |
| Chi tiết | Render detail | Có category cha nếu có |
| Xóa mềm | Redirect referrer | Set `deleted = true` |

---

## 6. Xử lý lỗi

| Tình huống | Xử lý |
| ------------ | ------- |
| Title rỗng | Flash "Vui lòng nhập tiêu đề danh mục" |
| Không tìm thấy detail | Flash lỗi và redirect list |
| Lỗi tạo/sửa/xóa | Flash lỗi và redirect |
| Page query không hợp lệ | Helper đưa về page hợp lệ |
| Category inactive/deleted | Không nạp vào menu client |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│ Danh mục việc làm                   │
│ [Status] [Keyword] [Tạo danh mục]   │
├─────────────────────────────────────┤
│ Title | Parent | Status | Position  │
│ Title | Parent | Status | Position  │
└─────────────────────────────────────┘

Form create/edit
  Title
  Parent category
  Thumbnail
  Description
  Status
  Position
```

---

## 8. File liên quan

| File | Vai trò |
| ------ | --------- |
| `router/admin/job-category.route.js` | Route CRUD category |
| `controller/admin/job-category.controller.js` | Logic quản lý category |
| `validates/admin/job-category.validate.js` | Validate title |
| `models/jobs-category.model.js` | Schema category |
| `helpers/createTree.js` | Tạo cây danh mục |
| `helpers/filterStatus.js` | Filter status |
| `helpers/pagination.js` | Phân trang |
| `middlewares/client/category.middleware.js` | Nạp category active cho client |
| `views/admin/pages/job-category/` | Các trang index/create/edit/detail |
| `public/admin/js/job.js` | Đổi status, delete |
