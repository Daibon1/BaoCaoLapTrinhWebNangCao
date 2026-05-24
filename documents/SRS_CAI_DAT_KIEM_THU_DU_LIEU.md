# SRS_CAI_DAT_KIEM_THU_DU_LIEU - Đặc tả cài đặt, kiểm thử và dữ liệu

**Dự án:** Website Tìm Kiếm Việc Làm
**Nhóm:** Nhóm 13
**Phiên bản:** 1.0
**Ngày:** 9/05/2026

---

## 1. Mô tả chức năng

Tài liệu mô tả cách cài đặt, chạy dự án, chạy kiểm thử và các model dữ liệu chính. Dự án dùng Express, Pug, MongoDB/Mongoose, Cloudinary, Nodemailer, Passport OAuth và Jest.

---

## 2. Điều kiện tiên quyết

| Điều kiện          | Mô tả                                       |
| ------------------ | ------------------------------------------- |
| Node.js/npm        | Dùng để cài package và chạy server          |
| MongoDB            | Cấu hình `MONGO_URL`                        |
| Cloudinary         | Cấu hình upload ảnh/CV                      |
| Gmail app password | Gửi OTP và email trạng thái ứng tuyển       |
| OAuth              | Google/Facebook login nếu dùng social login |
| node_modules       | Cài qua `npm install`                       |

---

## 3. Luồng xử lý chính

```text
Clone/mở dự án
        |
        v
npm install
        |
        v
Tạo file .env
        |
        v
npm start
        |
        v
Truy cập PORT cấu hình trong .env

Kiểm thử
        |
        v
npm test
        |
        v
Jest setup mongodb-memory-server
        |
        v
Chạy unit/integration tests
```

---

## 4. Use Cases

### UC-01: Chạy server local

| Trường          | Nội dung                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| **Tác nhân**    | Developer                                                                          |
| **Mục tiêu**    | Chạy website local                                                                 |
| **Luồng chính** | 1. Cài dependencies -> 2. Cấu hình env -> 3. Chạy `npm start` -> 4. Mở trình duyệt |
| **Kết quả**     | Express listen trên `PORT`                                                         |

### UC-02: Chạy test

| Trường          | Nội dung                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **Tác nhân**    | Developer/tester                                                                                      |
| **Mục tiêu**    | Kiểm tra validator, helper, model, integration                                                        |
| **Luồng chính** | 1. Chạy `npm test` -> 2. Jest tạo MongoMemoryServer -> 3. Chạy test -> 4. Dọn collection sau mỗi test |
| **Kết quả**     | Báo pass/fail trên terminal                                                                           |

### UC-03: Deploy Vercel

| Trường          | Nội dung                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| **Tác nhân**    | Developer                                                                       |
| **Luồng chính** | 1. Vercel dùng `index.js` với `@vercel/node` -> 2. Route mọi path về `index.js` |
| **Kết quả**     | App chạy theo cấu hình `vercel.json`                                            |

---

## 5. Input / Output

### Biến môi trường

| Biến                   | Vai trò                                                   |
| ---------------------- | --------------------------------------------------------- |
| `PORT`                 | Port chạy server                                          |
| `MONGO_URL`            | Chuỗi kết nối MongoDB                                     |
| `DB_PASSWORD`          | Mật khẩu DB nếu dùng để build connection string bên ngoài |
| `CLOUD_NAME`           | Cloudinary cloud name                                     |
| `CLOUD_KEY`            | Cloudinary API key                                        |
| `CLOUD_SECRET`         | Cloudinary API secret                                     |
| `EMAIL_USER`           | Gmail gửi email                                           |
| `EMAIL_PASSWORD`       | Gmail app password                                        |
| `GOOGLE_CLIENT_ID`     | Google OAuth client id                                    |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret                                       |
| `FACEBOOK_APP_ID`      | Facebook app id                                           |
| `FACEBOOK_APP_SECRET`  | Facebook app secret                                       |
| `SESSION_SECRET`       | Secret cho express-session                                |
| `BASE_URL`             | URL callback OAuth                                        |
| `RESEND_API_KEY`       | Biến dự phòng trong code comment gửi mail Resend          |

### Lệnh

| Lệnh                    | Mô tả                             |
| ----------------------- | --------------------------------- |
| `npm start`             | Chạy `nodemon --inspect index.js` |
| `npm test`              | Chạy Jest                         |
| `npm run test:watch`    | Chạy Jest watch mode              |
| `npm run test:coverage` | Chạy Jest coverage                |

### Model dữ liệu chính

| Model            | Collection        | Vai trò                                               |
| ---------------- | ----------------- | ----------------------------------------------------- |
| `User`           | `users`           | Tài khoản ứng viên, tokenUser, social id, avatar/CV   |
| `Account`        | `accounts`        | Tài khoản admin/employer, token, role_id, company_id  |
| `Role`           | `roles`           | Nhóm quyền và permissions                             |
| `Job`            | `jobs`            | Việc làm, slug, salary, skill, status, company, audit |
| `JobCategory`    | `jobs-category`   | Danh mục việc làm dạng cây                            |
| `Company`        | `companies`       | Hồ sơ công ty                                         |
| `Application`    | `applications`    | Hồ sơ ứng tuyển, CV, trạng thái                       |
| `SavedJob`       | `saved-jobs`      | Danh sách job đã lưu                                  |
| `ForgotPassword` | `forgot-password` | OTP quên mật khẩu có TTL                              |

---

## 6. Xử lý lỗi

| Tình huống              | Xử lý                                                |
| ----------------------- | ---------------------------------------------------- |
| Không kết nối MongoDB   | `config/database.js` log lỗi                         |
| Thiếu env Cloudinary    | Upload có thể lỗi khi gọi middleware                 |
| Thiếu env email         | Gửi mail có thể lỗi và log                           |
| Test cần DB thật        | Test dùng MongoMemoryServer, không phụ thuộc DB thật |
| Lỗi validate trong test | Jest báo fail theo expect                            |

---

## 7. Giao diện mô tả

```text
Developer workflow
┌─────────────────────────────────────┐
│ npm install                         │
│ tạo .env                            │
│ npm start                           │
│ mở http://localhost:<PORT>          │
└─────────────────────────────────────┘

Test workflow
┌─────────────────────────────────────┐
│ npm test                            │
│ setup MongoMemoryServer             │
│ run unit + integration tests        │
│ cleanup collections                 │
└─────────────────────────────────────┘
```

---

## 8. File liên quan

| File                                    | Vai trò                  |
| --------------------------------------- | ------------------------ |
| `package.json`                          | Scripts và dependencies  |
| `index.js`                              | Server runtime           |
| `app.js`                                | Express app phục vụ test |
| `config/database.js`                    | Kết nối MongoDB          |
| `config/passport.js`                    | OAuth Google/Facebook    |
| `helpers/sendMail.js`                   | Gửi email                |
| `middlewares/*/uploadCloud*.js`         | Upload Cloudinary        |
| `models/*.js`                           | Mongoose schemas         |
| `jest.config.js`                        | Cấu hình Jest            |
| `tests/setup.js`                        | MongoMemoryServer setup  |
| `tests/unit/validatesApi.test.js`       | Test validate API login  |
| `tests/unit/helper.checkNumber.test.js` | Test helper number       |
| `tests/unit/models/job.test.js`         | Test model Job           |
| `tests/integration/job.create.test.js`  | Test tạo job qua HTTP    |
| `vercel.json`                           | Cấu hình deploy Vercel   |
