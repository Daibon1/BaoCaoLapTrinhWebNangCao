# 💼 Website Tìm Kiếm Việc Làm

Dự án môn học xây dựng website tìm kiếm việc làm fullstack với **Node.js, Express, MongoDB và Pug**. Hệ thống cung cấp các chức năng cho **Ứng viên** (tìm việc, lưu việc, nộp CV, quản lý hồ sơ, theo dõi ứng tuyển), **Nhà tuyển dụng** (đăng ký tài khoản, tạo hồ sơ công ty, đăng tin, duyệt hồ sơ ứng tuyển) và **Quản trị viên** (quản lý tài khoản, phân quyền, danh mục, công việc, người dùng và thống kê).

---

## 👥 Thành viên

**Lớp:** `[D18CNPM3]`

| STT | Họ và tên           | Mã sinh viên    | Vai trò     |
| --- | ------------------- | --------------- | ----------- |
| 1   | `[Nguyễn Bá Đức]`   | `[23810310420]` | Nhóm trưởng |
| 2   | `[Nguyễn Văn Đại]`  | `[23810310422]` | Thành viên  |
| 3   | `[Nguyễn Ngọc Sơn]` | `[23810310424]` | Thành viên  |

---

## 📝 Phân công công việc

**Giao diện Ứng viên (Candidate) — `[Nguyễn Bá Đức]`**
Trang chủ, tìm kiếm việc làm, xem chi tiết tin tuyển dụng, lưu việc, nộp CV, quản lý hồ sơ cá nhân, quên mật khẩu và đăng nhập mạng xã hội.

**Giao diện Nhà tuyển dụng (Employer) — `[Nguyễn Văn Đại]`**
Đăng ký nhà tuyển dụng, tạo/cập nhật hồ sơ công ty, đăng tin tuyển dụng, quản lý tin đăng, xem danh sách ứng viên và cập nhật trạng thái hồ sơ ứng tuyển.

**Hệ thống Quản trị & Hỗ trợ — `[Nguyễn Ngọc Sơn]`**
Đăng nhập admin, dashboard thống kê, quản lý tài khoản, phân quyền, quản lý danh mục, duyệt tin tuyển dụng, quản lý ứng viên và API hỗ trợ.

---

## 📋 Mục lục

- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Demo & Triển khai](#-demo--triển-khai)
- [Hình ảnh minh họa](#-hình-ảnh-minh-họa)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
- [Chức năng chính](#-chức-năng-chính)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Tài liệu SRS](#-tài-liệu-srs)

---

## 🛠 Công nghệ sử dụng

| Thành phần     | Công nghệ                                       | Lý do lựa chọn                                                                                           |
| -------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Backend        | Node.js, Express 5                              | Xây dựng web server theo mô hình route/controller rõ ràng, dễ mở rộng chức năng client, admin và API.    |
| View engine    | Pug                                             | Render giao diện server-side gọn, tái sử dụng layout, partial và mixin cho client/admin.                 |
| Database       | MongoDB, Mongoose                               | Lưu dữ liệu linh hoạt cho job, user, company, application; hỗ trợ schema, populate, timestamps và index. |
| Authentication | Cookie token, express-session, Passport         | Phù hợp với luồng web server-rendered; hỗ trợ đăng nhập thường, Google OAuth và Facebook OAuth.          |
| Upload         | Multer memory, Cloudinary, streamifier          | Upload avatar, logo, thumbnail và CV PDF trực tiếp lên Cloudinary, không phụ thuộc lưu file local.       |
| Email          | Brevo Transactional Email API                   | Gửi OTP quên mật khẩu và email thông báo trạng thái hồ sơ ứng tuyển qua HTTP API, phù hợp khi deploy.    |
| Frontend       | HTML/Pug, CSS, JavaScript, FontAwesome          | Xây dựng giao diện client/admin, form động và icon.                                                       |
| Editor         | TinyMCE                                         | Soạn thảo nội dung mô tả công việc với trình soạn thảo rich text.                                        |
| Test           | Jest, Supertest, mongodb-memory-server          | Kiểm thử validator, helper, model và integration mà không cần database thật.                             |
| Deploy         | Railway, Render                                | Deploy chính trên Railway; Render là website phụ/dự phòng.                                               |

---

## 🎬 Demo & Triển khai

|                   | Link                  |
| ----------------- | --------------------- |
| 🎥 Video demo / thuyết trình | [Xem trên Google Drive](https://drive.google.com/drive/folders/1uN7f1V5hE-mIcJ_RFqrToKA66CSFwR7e) |
| 🌐 Website chính (Railway) | [https://baocaolaptrinhwebnangcao-production.up.railway.app](https://baocaolaptrinhwebnangcao-production.up.railway.app) |
| 🌐 Website phụ (Render) | [https://ddsjobs.onrender.com/](https://ddsjobs.onrender.com/) |
| 💻 Source code    | [https://github.com/Daibon1/BaoCaoLapTrinhWebNangCao.git](https://github.com/Daibon1/BaoCaoLapTrinhWebNangCao.git) |

### Tài khoản test app

Link đăng nhập admin/employer:

[https://baocaolaptrinhwebnangcao-production.up.railway.app/admin/auth/login](https://baocaolaptrinhwebnangcao-production.up.railway.app/admin/auth/login)

| Vai trò | Email | Mật khẩu |
| ------- | ----- | -------- |
| Admin | `admin@gamil.com` | `12345678` |
| Công ty demo | `levanb@gmail.com` | `12345678` |

### Nền tảng triển khai

Dự án ưu tiên deploy trên **Railway** vì đây là ứng dụng Express server-rendered chạy liên tục với MongoDB Atlas, session, cookie, OAuth và upload Cloudinary. Railway được dùng làm môi trường chính để demo và kiểm thử các luồng client/admin.

Dự án cũng được deploy phụ trên **Render** để dự phòng và đối chiếu khi demo. Railway vẫn là môi trường chính; Render là link phụ.

**Cấu hình Railway chính:**

```text
Build command: npm install
Start command: npm start
Runtime: Node.js
Environment: khai báo các biến trong .env tại Railway Variables
```

**Cấu hình Render phụ:**

```text
Service type: Web Service
Build command: npm install
Start command: npm start
Runtime: Node.js
Environment: khai báo các biến trong .env trên Render Dashboard
```

---

## 🖼 Hình ảnh minh họa

### Trang đăng ký ứng viên

<!-- Thêm ảnh chụp màn hình đăng ký -->

![Đăng ký](/documents/screenshorts/dangky.png)

### Trang đăng nhập ứng viên

<!-- Thêm ảnh chụp màn hình đăng nhập -->

![Đăng nhập](/documents/screenshorts/dangnhap.png)

### Trang chủ & Tìm kiếm việc làm

<!-- Thêm ảnh chụp màn hình trang chủ -->

![Trang chủ](/documents/screenshorts/trangchu.png)

### Trang chi tiết tin tuyển dụng

<!-- Thêm ảnh chụp màn hình chi tiết tin -->

![Chi tiết tin](/documents/screenshorts/chitiettintd.png)

### Trang đăng tin tuyển dụng

<!-- Thêm ảnh chụp màn hình đăng tin -->

![Đăng tin](/documents/screenshorts/dangtin1.png)
![Đăng tin](/documents/screenshorts/dangtin2.png)

### Trang quản lý tin đăng của nhà tuyển dụng

<!-- Thêm ảnh chụp màn hình quản lý tin -->

![Quản lý tin](/documents/screenshorts/quanlytin.png)

### Admin đăng nhập

<!-- Thêm ảnh chụp màn hình admin đăng nhập -->

![Admin Đăng nhập](/documents/screenshorts/admindangnhap.png)

### Trang admin quản lý người dùng

<!-- Thêm ảnh chụp màn hình admin quản lý người dùng -->

![Quản lý người dùng](/documents/screenshorts/quanlynguoidung.png)

### Trang admin quản lý tin tuyển dụng

<!-- Thêm ảnh chụp màn hình admin quản lý tin tuyển dụng -->

![Quản lý tin tuyển dụng](/documents/screenshorts/quanlytintd.png)

### Trang admin quản lý ứng tuyển

<!-- Thêm ảnh chụp màn hình admin quản lý ứng tuyển -->

![Quản lý ứng tuyển](/documents/screenshorts/quanlyut.png)

---

## 📁 Cấu trúc thư mục

```text
webnc2/
├── index.js                            # Entry point chạy server thật
├── app.js                              # Express app dùng cho kiểm thử
├── package.json                        # Scripts và dependencies Node.js
├── package-lock.json                   # Khóa phiên bản dependencies
├── jest.config.js                      # Cấu hình Jest
├── vercel.json                         # Cấu hình Vercel nếu triển khai thử
├── .env                                # Biến môi trường local
├── .gitignore                          # Bỏ qua file khi commit
│
├── config/                             # Cấu hình hệ thống
│   ├── database.js                     # Kết nối MongoDB bằng Mongoose
│   ├── passport.js                     # Google/Facebook OAuth
│   └── system.js                       # Prefix admin
│
├── router/                             # Web routes
│   ├── client/                         # Route phía ứng viên/khách
│   │   ├── index.route.js              # Gắn toàn bộ route client
│   │   ├── home.route.js               # Trang chủ
│   │   ├── job.route.js                # Danh sách, danh mục, chi tiết job
│   │   ├── search.route.js             # Tìm kiếm toàn hệ thống
│   │   ├── saved-job.route.js          # Lưu/bỏ lưu việc làm
│   │   ├── user.route.js               # Đăng ký, đăng nhập, hồ sơ, quên mật khẩu
│   │   ├── application.route.js        # Nộp CV, lịch sử ứng tuyển
│   │   ├── company.route.js            # Danh sách và chi tiết công ty
│   │   ├── employer.route.js           # Đăng ký nhà tuyển dụng
│   │   └── about.route.js              # Giới thiệu
│   │
│   └── admin/                          # Route trang quản trị
│       ├── index.route.js              # Gắn toàn bộ route admin
│       ├── auth.route.js               # Đăng nhập/đăng xuất admin
│       ├── dashboard.route.js          # Dashboard thống kê
│       ├── job.route.js                # Quản lý công việc
│       ├── job-category.route.js       # Quản lý danh mục việc làm
│       ├── account.route.js            # Quản lý tài khoản admin/employer
│       ├── role.route.js               # Nhóm quyền và phân quyền
│       ├── company.route.js            # Hồ sơ công ty
│       ├── client-user.route.js        # Quản lý tài khoản ứng viên
│       ├── user-approval.route.js      # Duyệt hồ sơ ứng tuyển
│       └── my-account.route.js         # Tài khoản của tôi
│
├── api/                                # API admin
│   └── admin/
│       ├── index.route.js              # Gắn route API admin
│       ├── auth.route.js               # API đăng nhập admin
│       ├── job.route.js                # API danh sách job
│       └── account.route.js            # Route account API nếu mở rộng
│
├── controller/                         # Tầng xử lý nghiệp vụ
│   ├── client/                         # Controller phía client
│   │   ├── home.controller.js
│   │   ├── job.controller.js
│   │   ├── search.controller.js
│   │   ├── saved-job.controller.js
│   │   ├── user.controller.js
│   │   ├── application.controller.js
│   │   ├── company.controller.js
│   │   ├── employer.controller.js
│   │   └── about.controller.js
│   │
│   └── admin/                          # Controller phía admin/employer
│       ├── auth.controller.js
│       ├── dashboard.controller.js
│       ├── job.controller.js
│       ├── job-category.controller.js
│       ├── account.controller.js
│       ├── role.controller.js
│       ├── company.controller.js
│       ├── client-user.controller.js
│       ├── user-approval.controller.js
│       └── my-account.controller.js
│
├── models/                             # Mongoose models
│   ├── user.model.js                   # Ứng viên
│   ├── account.model.js                # Admin/nhà tuyển dụng
│   ├── role.model.js                   # Nhóm quyền
│   ├── jobs.model.js                   # Công việc
│   ├── jobs-category.model.js          # Danh mục việc làm
│   ├── company.model.js                # Công ty
│   ├── application.model.js            # Hồ sơ ứng tuyển
│   ├── saved-jobs.model.js             # Việc làm đã lưu
│   └── forgot-password.model.js        # OTP quên mật khẩu
│
├── middlewares/                        # Middleware
│   ├── client/
│   │   ├── auth.middleware.js          # Bảo vệ route ứng viên
│   │   ├── user.middleware.js          # Nạp user từ cookie tokenUser
│   │   ├── savejob.middleware.js       # Tạo/đọc cookie saveJobId
│   │   ├── category.middleware.js      # Nạp danh mục cho layout
│   │   ├── uploadCloud.middleware.js   # Upload CV
│   │   └── uploadCloudUser.middleware.js # Upload avatar/CV user
│   │
│   └── admin/
│       ├── auth.middleware.js          # Bảo vệ route admin
│       └── uploadCloud.middleware.js   # Upload ảnh admin
│
├── validates/                          # Validate form web
│   ├── client/
│   └── admin/
│
├── validatesapi/                       # Validate API
│   └── admin/
│
├── helpers/                            # Hàm tiện ích
│   ├── sendMail.js                     # Gửi email
│   ├── generate.js                     # Tạo token/OTP
│   ├── pagination.js                   # Phân trang
│   ├── filterSearch.js                 # Lọc keyword/location/type
│   ├── filterStatus.js                 # Lọc trạng thái
│   ├── createTree.js                   # Tạo cây danh mục
│   └── checkNumber.js                  # Kiểm tra số
│
├── views/                              # Giao diện Pug
│   ├── client/
│   │   ├── layouts/
│   │   ├── partials/
│   │   ├── mixins/
│   │   └── pages/
│   │
│   └── admin/
│       ├── layouts/
│       ├── partials/
│       ├── mixins/
│       └── pages/
│
├── public/                             # Static assets
│   ├── css/                            # CSS client
│   ├── js/                             # JS client
│   ├── admin/
│   │   ├── css/                        # CSS admin
│   │   └── js/                         # JS admin
│   ├── images/                         # Ảnh/logo hệ thống
│   └── uploads/                        # File upload local cũ/nội bộ
│
├── tests/                              # Kiểm thử
│   ├── setup.js                        # MongoMemoryServer setup
│   ├── unit/                           # Unit test
│   └── integration/                    # Integration test
│
└── documents/                          # Tài liệu README/SRS
    ├── README.md
    └── SRS_*.md
```

---

## 🗄 Cơ sở dữ liệu

**Database:** MongoDB
**ODM:** Mongoose
**Kiểu dữ liệu:** Document collections
**Auth web:** Cookie token (`tokenUser`, `token`, `saveJobId`)

### Sơ đồ các collection

```text
┌──────────────────────┐      ┌──────────────────────┐
│        users         │      │       accounts       │
│      (Ứng viên)      │      │  (Admin/Employer)    │
├──────────────────────┤      ├──────────────────────┤
│ _id                  │      │ _id                  │
│ fullName             │      │ fullName             │
│ email                │      │ email                │
│ password             │      │ password             │
│ tokenUser            │      │ token                │
│ googleId/facebookId  │      │ role_id              │
│ phone/avatar/cvFile  │      │ company_id           │
│ status/deleted       │      │ status/deleted       │
└──────────┬───────────┘      └───────┬──────┬───────┘
           │                          │      │
           │ 1:N                      │      │ N:1
           ▼                          │      ▼
┌──────────────────────┐              │  ┌──────────────────────┐
│     applications     │              │  │        roles         │
│    (Hồ sơ ứng tuyển) │              │  │     (Nhóm quyền)     │
├──────────────────────┤              │  ├──────────────────────┤
│ _id                  │              │  │ _id                  │
│ userId -> users      │              │  │ title                │
│ jobId -> jobs        │              │  │ description          │
│ cvUrl                │              │  │ permissions[]        │
│ coverLetter          │              │  │ deleted              │
│ status               │              │  └──────────────────────┘
│ hiddenByUser         │              │
└──────────┬───────────┘              │
           │ N:1                      │ 1:1/N
           ▼                          ▼
┌──────────────────────┐      ┌──────────────────────┐
│        jobs          │      │      companies       │
│     (Công việc)      │      │       (Công ty)      │
├──────────────────────┤      ├──────────────────────┤
│ _id                  │      │ _id                  │
│ title/slug           │      │ name/slug            │
│ description          │      │ logo                 │
│ location/category    │      │ email/phone/website  │
│ salaryMin/salaryMax  │      │ address/description  │
│ skill[]              │      │ size                 │
│ featured/type        │      │ status/deleted       │
│ experience/status    │      │ createdBy.account_id │
│ company_id -> company│      └──────────────────────┘
│ createdBy/updatedBy  │
│ deleted/deletedBy    │
└──────────┬───────────┘
           │ N:1
           ▼
┌──────────────────────┐      ┌──────────────────────┐
│    jobs-category     │      │     saved-jobs       │
│  (Danh mục việc làm) │      │  (Việc làm đã lưu)   │
├──────────────────────┤      ├──────────────────────┤
│ _id                  │      │ _id                  │
│ title/slug           │      │ userId               │
│ parent_id            │      │ jobIds[]             │
│ thumbnail            │      │ createdAt/updatedAt  │
│ description          │      └──────────────────────┘
│ status/deleted       │
│ position             │      ┌──────────────────────┐
└──────────────────────┘      │   forgot-password    │
                              │   (OTP khôi phục)    │
                              ├──────────────────────┤
                              │ _id                  │
                              │ email                │
                              │ otp                  │
                              │ expireAt TTL 180s    │
                              └──────────────────────┘
```

### Quan hệ giữa các collection

| Quan hệ                                         | Mô tả                                                    |
| ----------------------------------------------- | -------------------------------------------------------- |
| `accounts.role_id → roles._id`                  | Mỗi tài khoản admin/employer thuộc một nhóm quyền.       |
| `accounts.company_id → companies._id`           | Mỗi employer có thể gắn với một hồ sơ công ty.           |
| `companies.createdBy.account_id → accounts._id` | Công ty lưu thông tin người tạo.                         |
| `jobs.company_id → companies._id`               | Mỗi công việc thuộc một công ty.                         |
| `jobs.category → jobs-category._id`             | Mỗi công việc thuộc một danh mục việc làm.               |
| `jobs.createdBy.account_id → accounts._id`      | Job lưu tài khoản tạo để phân quyền employer.            |
| `applications.userId → users._id`               | Mỗi hồ sơ ứng tuyển thuộc một ứng viên.                  |
| `applications.jobId → jobs._id`                 | Mỗi hồ sơ ứng tuyển thuộc một công việc.                 |
| `saved-jobs.userId → users._id`                 | Danh sách lưu có thể gắn với ứng viên sau khi đăng nhập. |
| `saved-jobs.jobIds[] → jobs._id`                | Một danh sách lưu chứa nhiều job id.                     |

---

## ⚡ Chức năng chính

### 👤 Phía Ứng viên (Candidate)

| Chức năng             | Mô tả                                                                            |
| --------------------- | -------------------------------------------------------------------------------- |
| Trang chủ             | Hiển thị việc làm nổi bật, việc làm mới và điều hướng nhanh.                     |
| Tìm kiếm việc làm     | Tìm kiếm theo từ khóa, lọc theo địa điểm, loại công việc, sắp xếp và phân trang. |
| Xem chi tiết việc làm | Xem mô tả, lương, kỹ năng, kinh nghiệm, công ty và việc cùng danh mục.           |
| Lưu việc làm          | Lưu/bỏ lưu job bằng cookie `saveJobId`, đồng bộ với tài khoản khi đăng nhập.     |
| Nộp hồ sơ ứng tuyển   | Upload CV PDF lên Cloudinary, nhập thư xin việc và tạo application.              |
| Lịch sử ứng tuyển     | Xem danh sách hồ sơ đã nộp, trạng thái phản hồi và ẩn hồ sơ khỏi danh sách.      |
| Quản lý hồ sơ         | Xem và cập nhật thông tin cá nhân, avatar/CV nếu có.                             |
| Đăng ký / Đăng nhập   | Đăng ký bằng email/mật khẩu, đăng nhập thường, Google và Facebook.               |
| Quên mật khẩu         | Gửi OTP qua email, xác minh OTP và đặt lại mật khẩu.                             |
| Xem công ty           | Tìm kiếm công ty, xem chi tiết công ty và các job đang tuyển.                    |

### 🏢 Phía Nhà tuyển dụng (Employer)

| Chức năng               | Mô tả                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| Đăng ký nhà tuyển dụng  | Tạo account role `Employer`, trạng thái `inactive` để chờ admin duyệt.                                     |
| Đăng nhập trang quản lý | Dùng `/admin/auth/login`, lưu cookie `token`.                                                              |
| Tạo hồ sơ công ty       | Nhập thông tin công ty, upload logo và gắn `company_id` vào account.                                       |
| Đăng tin tuyển dụng     | Tạo job mới ở trạng thái `pending`, chờ admin duyệt trước khi hiển thị.                                    |
| Quản lý tin đăng        | Xem, sửa, bật/tắt job đã duyệt, xóa mềm job của chính mình.                                                |
| Xem danh sách ứng viên  | Lọc hồ sơ ứng tuyển theo job, trạng thái và từ khóa.                                                       |
| Duyệt hồ sơ ứng tuyển   | Cập nhật trạng thái `pending`, `reviewing`, `interview`, `accepted`, `rejected`; gửi email khi có kết quả. |
| Dashboard employer      | Thống kê job và application theo tài khoản employer.                                                       |

### 🔒 Phía Quản trị viên (Admin Panel)

| Chức năng          | Mô tả                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| Dashboard          | Thống kê số job, trạng thái job, danh mục, tài khoản, job theo tháng/danh mục. |
| Quản lý công việc  | Xem toàn bộ job, lọc, tìm kiếm, duyệt `pending`, đổi trạng thái, sửa, xóa mềm. |
| Quản lý danh mục   | CRUD danh mục việc làm dạng cây, trạng thái active/inactive.                   |
| Quản lý tài khoản  | Tạo, sửa, khóa/mở khóa, xóa mềm tài khoản admin/employer.                      |
| Quản lý phân quyền | CRUD role và cập nhật danh sách permissions cho từng role.                     |
| Quản lý ứng viên   | Xem, tìm kiếm, khóa/mở khóa, xóa mềm tài khoản ứng viên.                       |
| Quản lý công ty    | Xem/tạo/cập nhật hồ sơ công ty.                                                |
| API admin          | API đăng nhập admin và API danh sách job phục vụ kiểm thử/tích hợp.            |

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js và npm
- MongoDB local hoặc MongoDB Atlas
- Tài khoản Cloudinary để upload ảnh/CV
- Tài khoản Brevo và API key để gửi email OTP/thông báo
- Trình duyệt web hiện đại: Chrome, Firefox, Edge

### Các bước cài đặt

**1. Clone hoặc mở source code:**

```bash
git clone <repository-url>
cd webnc2
```

**2. Cài dependencies Node.js:**

```bash
npm install
```

**3. Tạo file `.env` tại thư mục gốc:**

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/webnc2
SESSION_SECRET=your_session_secret
BASE_URL=http://localhost:3000

CLOUD_NAME=your_cloud_name
CLOUD_KEY=your_cloud_key
CLOUD_SECRET=your_cloud_secret

BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

**4. Khởi động MongoDB nếu dùng local.**

**5. Chạy server:**

```bash
npm start
```

**6. Truy cập website:**

| Trang                       | URL                                       |
| --------------------------- | ----------------------------------------- |
| 🌐 Trang chủ                | `http://localhost:3000/`                  |
| 🔎 Danh sách việc làm       | `http://localhost:3000/jobs`              |
| 🏢 Danh sách công ty        | `http://localhost:3000/company`           |
| 👤 Đăng nhập ứng viên       | `http://localhost:3000/user/login`        |
| 📝 Đăng ký ứng viên         | `http://localhost:3000/user/register`     |
| 🏢 Đăng ký nhà tuyển dụng   | `http://localhost:3000/employer/register` |
| 🔐 Đăng nhập admin/employer | `http://localhost:3000/admin/auth/login`  |
| 📊 Dashboard admin          | `http://localhost:3000/admin/dashboard`   |
| 🔌 API job admin            | `http://localhost:3000/admin/api/job`     |

### Lệnh kiểm thử

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Tài khoản mặc định

Repository hiện tại không chứa seed user/account mặc định. Cần tạo tài khoản trong MongoDB hoặc đăng ký qua giao diện:

| Vai trò        | Cách tạo                                                                                |
| -------------- | --------------------------------------------------------------------------------------- |
| Ứng viên       | Đăng ký tại `/user/register`                                                            |
| Nhà tuyển dụng | Đăng ký tại `/employer/register`, sau đó admin mở khóa account                          |
| Admin          | Tạo trực tiếp trong collection `accounts`, gán `role_id` tương ứng và password dạng MD5 |

---

## 📄 Tài liệu SRS

Tất cả tài liệu đặc tả yêu cầu phần mềm (SRS) được lưu trong thư mục `documents/`:

| File                                                                               | Mô tả                                                      |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [`SRS_TONG_QUAN_HE_THONG.md`](SRS_TONG_QUAN_HE_THONG.md)                           | Tổng quan kiến trúc, công nghệ, thư mục và biến môi trường |
| [`SRS_DANG_KY_DANG_NHAP_UNG_VIEN.md`](SRS_DANG_KY_DANG_NHAP_UNG_VIEN.md)           | Đăng ký, đăng nhập, đăng xuất ứng viên và social login     |
| [`SRS_QUEN_MAT_KHAU.md`](SRS_QUEN_MAT_KHAU.md)                                     | Quên mật khẩu, gửi OTP qua email, đặt lại mật khẩu         |
| [`SRS_HO_SO_UNG_VIEN.md`](SRS_HO_SO_UNG_VIEN.md)                                   | Xem và cập nhật hồ sơ ứng viên                             |
| [`SRS_TIM_KIEM_VIEC_LAM.md`](SRS_TIM_KIEM_VIEC_LAM.md)                             | Trang chủ, danh sách việc làm, tìm kiếm, lọc, phân trang   |
| [`SRS_LUU_VIEC_LAM.md`](SRS_LUU_VIEC_LAM.md)                                       | Lưu, bỏ lưu và xem danh sách việc làm đã lưu               |
| [`SRS_UNG_TUYEN_CONG_VIEC.md`](SRS_UNG_TUYEN_CONG_VIEC.md)                         | Ứng tuyển, upload CV PDF và quản lý hồ sơ đã ứng tuyển     |
| [`SRS_CONG_TY_CLIENT.md`](SRS_CONG_TY_CLIENT.md)                                   | Danh sách công ty và chi tiết công ty phía client          |
| [`SRS_DANG_KY_NHA_TUYEN_DUNG.md`](SRS_DANG_KY_NHA_TUYEN_DUNG.md)                   | Đăng ký tài khoản nhà tuyển dụng                           |
| [`SRS_DANG_NHAP_ADMIN.md`](SRS_DANG_NHAP_ADMIN.md)                                 | Đăng nhập, đăng xuất và bảo vệ route admin                 |
| [`SRS_DASHBOARD_ADMIN.md`](SRS_DASHBOARD_ADMIN.md)                                 | Dashboard thống kê cho admin và employer                   |
| [`SRS_QUAN_LY_CONG_VIEC.md`](SRS_QUAN_LY_CONG_VIEC.md)                             | CRUD, duyệt, lọc, sắp xếp, soft delete việc làm            |
| [`SRS_QUAN_LY_DANH_MUC_VIEC_LAM.md`](SRS_QUAN_LY_DANH_MUC_VIEC_LAM.md)             | CRUD danh mục việc làm dạng cây                            |
| [`SRS_QUAN_LY_CONG_TY.md`](SRS_QUAN_LY_CONG_TY.md)                                 | Tạo, xem và cập nhật hồ sơ công ty                         |
| [`SRS_QUAN_LY_TAI_KHOAN_VA_PHAN_QUYEN.md`](SRS_QUAN_LY_TAI_KHOAN_VA_PHAN_QUYEN.md) | Quản lý account admin/employer, user client và nhóm quyền  |
| [`SRS_DUYET_HO_SO_UNG_TUYEN.md`](SRS_DUYET_HO_SO_UNG_TUYEN.md)                     | Duyệt hồ sơ ứng tuyển và gửi email kết quả                 |
| [`SRS_API_ADMIN.md`](SRS_API_ADMIN.md)                                             | API admin hiện có                                          |
| [`SRS_CAI_DAT_KIEM_THU_DU_LIEU.md`](SRS_CAI_DAT_KIEM_THU_DU_LIEU.md)               | Cài đặt, chạy dự án, test và mô hình dữ liệu               |
