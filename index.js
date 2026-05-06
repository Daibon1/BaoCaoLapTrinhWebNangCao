const express = require('express');
//Dùng env
// process.on("unhandledRejection", (reason, promise) => {
//     console.log("========== ERROR ==========");
//     console.log(reason);
// });
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require('moment');
const app = express();
const port = process.env.PORT;
let database = require("./config/database");
database.connect();
const route = require("./router/client/index.route");
const routeAdmin = require("./router/admin/index.route");
const routeApi=require("./api/admin/index.route");
//flash
app.use(cookieParser('djgwdgjwudjjd'));
app.use(session({
  cookie: {
    maxAge: 60000
  }
}));
app.use(flash());
//end flash
// tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// Middleware để xử lý dữ liệu form
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
//ghi đè method của form
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
route(app);
// Biến toàn cục
app.locals.prefixAdmin = 'admin';
app.locals.moment = moment;
routeAdmin(app);
routeApi(app);
//Dùng pug
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
//Dùng file tĩnh
// console.log(__dirname);
app.use(express.static(`${__dirname}/public`));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})