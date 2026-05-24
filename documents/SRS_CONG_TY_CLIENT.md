# SRS_CONG_TY_CLIENT - Đặc tả chức năng công ty phía client

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 10/05/2026

---

## 1. Mô tả chức năng

Cho phép người dùng xem danh sách công ty đang hoạt động, tìm kiếm công ty theo từ khóa và xem chi tiết công ty kèm các việc làm đang tuyển của công ty đó.

---

## 2. Điều kiện tiên quyết

| Điều kiện       | Mô tả                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| Dữ liệu công ty | Collection `companies` có bản ghi `deleted = false`, `status = active` |
| Dữ liệu job     | Collection `jobs` có job active thuộc công ty                          |
| Slug            | Công ty có slug tự sinh từ `name`                                      |

---

## 3. Luồng xử lý chính

```text
Người dùng vào /company
        |
        v
Nhập keyword nếu cần
        |
        v
Controller build điều kiện company active
        |
        v
Query name/address/description theo regex
        |
        v
Render danh sách công ty

Người dùng vào /company/detail/:slug
        |
        v
Tìm công ty theo slug active
        |
        v
Lấy tối đa 4 job active của công ty
        |
        v
Render chi tiết công ty
```

---

## 4. Use Cases

### UC-01: Xem danh sách công ty

| Trường          | Nội dung                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Tác nhân**    | Khách/ứng viên                                                                             |
| **Mục tiêu**    | Khám phá công ty tuyển dụng                                                                |
| **Luồng chính** | 1. Truy cập `/company` -> 2. Query company active -> 3. Sort `createdAt desc` -> 4. Render |
| **Kết quả**     | Danh sách công ty                                                                          |

### UC-02: Tìm kiếm công ty

| Trường          | Nội dung                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Khách/ứng viên                                                                                        |
| **Luồng chính** | 1. Nhập keyword -> 2. Gọi `/company?keyword=...` -> 3. Tìm theo name/address/description -> 4. Render |
| **Kết quả**     | Danh sách công ty phù hợp                                                                             |

### UC-03: Xem chi tiết công ty

| Trường          | Nội dung                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Khách/ứng viên                                                                                           |
| **Luồng chính** | 1. Click công ty -> 2. Gọi `/company/detail/:slug` -> 3. Lấy thông tin công ty và 4 job mới -> 4. Render |
| **Kết quả**     | Trang chi tiết công ty và job liên quan                                                                  |

---

## 5. Input / Output

### Input

| Trường    | Kiểu         | Bắt buộc          | Validate                       |
| --------- | ------------ | ----------------- | ------------------------------ |
| `keyword` | query string | Không             | Escape regex đặc biệt          |
| `slug`    | path string  | Có khi xem detail | Company phải tồn tại và active |

### Output

| Kết quả                | Dạng trả về                          | Mô tả                  |
| ---------------------- | ------------------------------------ | ---------------------- |
| Danh sách công ty      | Render `client/pages/company/index`  | `companies`, `keyword` |
| Chi tiết công ty       | Render `client/pages/company/detail` | `company`, `jobs`      |
| Không tìm thấy công ty | Redirect `/company`                  | Flash lỗi              |

---

## 6. Xử lý lỗi

| Tình huống               | Xử lý                                                 |
| ------------------------ | ----------------------------------------------------- |
| Keyword rỗng             | Hiển thị tất cả công ty active                        |
| Slug không tồn tại       | Flash "Không tìm thấy công ty" và redirect `/company` |
| Công ty inactive/deleted | Không hiển thị phía client                            |
| Không có job             | Render chi tiết công ty với danh sách job rỗng        |

---

## 7. Giao diện mô tả

```text
┌─────────────────────────────────────┐
│  Công ty                            │
│  [Tìm kiếm công ty____________]     │
├─────────────────────────────────────┤
│  Logo | Tên công ty | Địa chỉ       │
│  Logo | Tên công ty | Địa chỉ       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Logo + Tên công ty                 │
│  Email / Phone / Website / Address  │
│  Mô tả công ty                      │
│  Việc đang tuyển                    │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                      | Vai trò                                   |
| ----------------------------------------- | ----------------------------------------- |
| `router/client/company.route.js`          | Route `/company`, `/company/detail/:slug` |
| `controller/client/company.controller.js` | Logic list/search/detail company          |
| `models/company.model.js`                 | Schema company và slug                    |
| `models/jobs.model.js`                    | Lấy job của công ty                       |
| `views/client/pages/company/index.pug`    | Trang danh sách công ty                   |
| `views/client/pages/company/detail.pug`   | Trang chi tiết công ty                    |
