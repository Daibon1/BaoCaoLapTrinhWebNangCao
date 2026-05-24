module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName || req.body.fullName.trim().length === 0) {
        req.flash("error", "Tên không được để trống!");
        return res.redirect(req.get("Referrer") || "/employer/register");
    }

    if (!req.body.email || req.body.email.trim().length === 0) {
        req.flash("error", "Email không được để trống!");
        return res.redirect(req.get("Referrer") || "/employer/register");
    }

    if (!req.body.password || req.body.password.length < 8) {
        req.flash("error", "Mật khẩu phải có ít nhất 8 ký tự!");
        return res.redirect(req.get("Referrer") || "/employer/register");
    }

    if (!req.body.confirmPassword || req.body.confirmPassword.length === 0) {
        req.flash("error", "Xác nhận mật khẩu không được để trống!");
        return res.redirect(req.get("Referrer") || "/employer/register");
    }

    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Mật khẩu xác nhận không khớp!");
        return res.redirect(req.get("Referrer") || "/employer/register");
    }

    if (req.body.agreePolicy !== "1") {
        req.flash("error", "Bạn cần đồng ý với điều khoản sử dụng và chính sách bảo mật!");
        return res.redirect(req.get("Referrer") || "/employer/register");
    }

    next();
};
