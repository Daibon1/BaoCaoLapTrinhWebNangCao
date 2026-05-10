const User = require("../../models/user.model");
const md5 = require("md5");
const SaveJob = require("../../models/saved-jobs.model");
const gennerate = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    });
}
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        const exitsEmail = await User.findOne({
            email: req.body.email
        });
        if (exitsEmail) {
            req.flash('error', 'Email đã được sử dụng');
            res.redirect(req.get("Referrer") || "/user/register");
            return;
        }
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        await user.save();
        res.cookie('tokenUser', user.tokenUser);
        req.flash('success', 'Đăng ký thành công!');
        res.redirect("/");
    } catch (err) {
        req.flash('error', err.message);
        res.redirect(req.get("Referrer") || "/user/register");
        return;
    }
}
// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    });
}
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        req.flash('error', 'Email không tồn tại!');
        res.redirect(req.get("Referrer") || "/user/login");
        return;
    }
    if (md5(password) != user.password) {
        req.flash('error', 'Mật khẩu không đúng!');
        res.redirect(req.get("Referrer") || "/user/login");
        return;
    }
    if (user.status != "active") {
        req.flash('error', 'Tài khoản đã bị khóa!');
        res.redirect(req.get("Referrer") || "/user/login");
        return;
    }
    const saveJob = await SaveJob.findOne({
        userId: user.id
    });
    if (saveJob) {
        res.cookie('saveJobId', saveJob.id);
    } else {
        await SaveJob.updateOne({
            _id: req.cookies.saveJobId
        }, {
            userId: user.id
        });
    }
    res.cookie('tokenUser', user.tokenUser);
    req.flash('success', 'Đăng nhập thành công!');
    res.redirect("/");
}
// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie('tokenUser');
    res.clearCookie('saveJobId');
    req.flash('success', 'Đăng xuất thành công!');
    res.redirect("/");
}
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu"
    });
}
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        req.flash('error', 'Email không tồn tại!');
        res.redirect(req.get("Referrer") || "/user/password/forgot");
        return;
    }
    // Lưu thông tin vào db
    const otp = gennerate.generateRandomNumber(8);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgoPassword = new ForgotPassword(objectForgotPassword);
    await forgoPassword.save();
    // console.log(objectForgotPassword);
    ///Gửi otp qua email cho user
    const subject = "Mã OTP lấy lại mật khẩu";
    const html = `<p>Mã OTP của bạn là: <b>${otp}</b></p><p>Mã OTP có hiệu lực trong vòng 3 phút</p>`;
    sendMailHelper.sendMail(email, subject, html);
    // xqxz fakv kgsu zcpe
    res.redirect(`/user/password/otp?email=${email}`);
}
// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Mã OTP",
        email: email
    });
}
// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log(email, otp);
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        req.flash('error', 'Mã OTP không đúng!');
        res.redirect(req.get("Referrer") || "/user/password/otp");
        return;
    }
    const user = await User.findOne({
        email: email
    });
    res.cookie('tokenUser', user.tokenUser);
    res.redirect("/user/password/reset");
}
// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    });
}
// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });
    req.flash('success', 'Đặt lại mật khẩu thành công!');
    res.redirect("/");
}
// [GET] /user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản"
    });
}