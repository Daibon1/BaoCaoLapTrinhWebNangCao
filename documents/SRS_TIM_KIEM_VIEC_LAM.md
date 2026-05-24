# SRS_TIM_KIEM_VIEC_LAM - Đặc tả chức năng tìm kiếm việc làm

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 05/05/2026

---

## 1. Mô tả chức năng

Cho phép người dùng xem trang chủ, danh sách việc làm, tìm kiếm theo từ khóa, lọc theo địa điểm/loại công việc, sắp xếp, phân trang và xem việc theo danh mục. Các việc làm hiển thị phía client phải có `deleted = false` và `status = active`.

---

## 2. Điều kiện tiên quyết

| Điều kiện  | Mô tả                                                      |
| ---------- | ---------------------------------------------------------- |
| Dữ liệu    | Collection `jobs`, `jobs-category`, `companies` có dữ liệu |
| Trạng thái | Việc làm và danh mục phải `active` để hiển thị             |
| Middleware | Category middleware nạp menu danh mục                      |
| Saved job  | Save job middleware tạo/đọc cookie `saveJobId`             |

---

## 3. Luồng xử lý chính

```text
Người dùng vào / hoặc /jobs
        |
        v
Middleware nạp saved jobs + category + user info
        |
        v
Controller tạo điều kiện find:
  deleted=false, status=active
        |
        v
Áp dụng keyword/location/type/sort/page nếu có
        |
        v
Query MongoDB và populate company_id
        |
        v
Render danh sách việc làm
```

---

## 4. Use Cases

### UC-01: Xem trang chủ

| Trường            | Nội dung                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **Tác nhân**      | Khách/ứng viên                                                                                        |
| **Mục tiêu**      | Xem việc nổi bật và việc mới                                                                          |
| **Luồng chính**   | 1. Truy cập `/` -> 2. Lấy 6 việc featured -> 3. Lấy 6 việc mới theo `position desc` -> 4. Render home |
| **Điều kiện sau** | Không thay đổi dữ liệu                                                                                |

### UC-02: Tìm kiếm việc làm

| Trường          | Nội dung                                                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Khách/ứng viên                                                                                                  |
| **Mục tiêu**    | Tìm việc theo từ khóa                                                                                           |
| **Luồng chính** | 1. Nhập keyword -> 2. Gọi `/search?keyword=...` hoặc `/jobs?keyword=...` -> 3. Query regex -> 4. Render kết quả |
| **Kết quả**     | Danh sách job phù hợp title/description/company/location/type/experience/skill                                  |

### UC-03: Lọc và phân trang

| Trường          | Nội dung                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Khách/ứng viên                                                                                                        |
| **Luồng chính** | 1. Chọn location/type/sort/page -> 2. JS cập nhật query string -> 3. Controller lọc, sort, paginate -> 4. Render page |
| **Kết quả**     | Danh sách chỉ gồm job thỏa điều kiện                                                                                  |

### UC-04: Xem việc theo danh mục

| Trường          | Nội dung                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Khách/ứng viên                                                                                                             |
| **Luồng chính** | 1. Truy cập `/jobs/:slugCategory` -> 2. Tìm category active -> 3. Lấy category con -> 4. Query job thuộc category/children |
| **Kết quả**     | Render danh sách việc theo danh mục                                                                                        |

---

## 5. Input / Output

### Input

| Trường         | Kiểu         | Bắt buộc            | Validate                              |
| -------------- | ------------ | ------------------- | ------------------------------------- |
| `keyword`      | query string | Không               | Dùng regex không phân biệt hoa thường |
| `location`     | query string | Không               | Một trong các location trên form      |
| `type`         | query string | Không               | `Full-time` hoặc `Part-time`          |
| `sortKey`      | query string | Không               | Field sort                            |
| `sortValue`    | query string | Không               | `asc` hoặc `desc` theo UI             |
| `page`         | query number | Không               | Số nguyên dương                       |
| `slugCategory` | path string  | Có khi lọc category | Category phải tồn tại                 |

### Output

| Kết quả                | Dạng trả về                        | Mô tả                      |
| ---------------------- | ---------------------------------- | -------------------------- |
| Trang chủ              | Render `client/pages/home/index`   | `jobsFeatured`, `jobsNew`  |
| Danh sách jobs         | Render `client/pages/jobs/index`   | `jobs`, filter, pagination |
| Search global          | Render `client/pages/search/index` | `jobs`, `keyword`          |
| Category không tồn tại | Redirect `/jobs`                   | Flash lỗi                  |

---

## 6. Xử lý lỗi

| Tình huống                   | Xử lý                                               |
| ---------------------------- | --------------------------------------------------- |
| Không có keyword ở `/search` | Redirect `/`                                        |
| Category không tồn tại       | Flash "Không tìm thấy danh mục" và redirect `/jobs` |
| Page vượt quá tổng trang     | Helper đưa về trang cuối hợp lệ                     |
| Không có dữ liệu             | Render danh sách rỗng                               |
| Lỗi query chi tiết           | Flash lỗi và redirect `/jobs`                       |

---

## 7. Giao diện mô tả

```text
┌────────────────────────────────────────────┐
│ Search: [keyword____________] [Tìm kiếm]   │
│ Filter: [Location] [Type] [Sort]           │
├────────────────────────────────────────────┤
│ Job card 1                                 │
│ Job card 2                                 │
│ Job card 3                                 │
├────────────────────────────────────────────┤
│       [Prev] [1] [2] [3] [Next]            │
└────────────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                        | Vai trò                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| `router/client/home.route.js`               | Route `/`                                                     |
| `router/client/job.route.js`                | Route `/jobs`, `/jobs/:slugCategory`, `/jobs/detail/:slugJob` |
| `router/client/search.route.js`             | Route `/search`                                               |
| `controller/client/home.controller.js`      | Lấy job nổi bật/job mới                                       |
| `controller/client/job.controller.js`       | Danh sách, category, chi tiết job                             |
| `controller/client/search.controller.js`    | Search toàn cục                                               |
| `helpers/filterSearch.js`                   | Build filter keyword/location/type                            |
| `helpers/pagination.js`                     | Tính phân trang                                               |
| `helpers/product-category.js`               | Lấy danh mục con                                              |
| `middlewares/client/category.middleware.js` | Nạp cây danh mục vào layout                                   |
| `public/js/jobs.js`                         | JS filter/sort/pagination client                              |
| `views/client/pages/home/index.pug`         | Trang chủ                                                     |
| `views/client/pages/jobs/index.pug`         | Danh sách việc                                                |
| `views/client/pages/search/index.pug`       | Kết quả tìm kiếm                                              |
