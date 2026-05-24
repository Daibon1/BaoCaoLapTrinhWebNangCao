module.exports.registerPost=(req,res,next)=>{
    if (!req.body.fullName || req.body.fullName.trim().length==0){
        req.flash('error', 'Tên không được để trống!');
        res.redirect(req.get("Referrer") || "/user/register");
        return;
    }
    if (!req.body.email || req.body.email.trim().length==0){
        req.flash('error', 'Email không được để trống!');
        res.redirect(req.get("Referrer") || "/user/register");
        return;
    }
    if (!req.body.password || req.body.password.length<8){
        req.flash('error', 'Mật khẩu phải có ít nhất 8 ký tự!');
        res.redirect(req.get("Referrer") || "/user/register");
        return;
    }
    if (!req.body.confirmPassword || req.body.confirmPassword.length==0){
        req.flash('error', 'Xác nhận mật khẩu không được để trống!');
        res.redirect(req.get("Referrer") || "/user/register");
        return;
    }
    if (req.body.password != req.body.confirmPassword){
        req.flash('error', 'Mật khẩu xác nhận không khớp!');
        res.redirect(req.get("Referrer") || "/user/register");
        return;
    }
    if (req.body.agreePolicy !== "1"){
        req.flash('error', 'Bạn cần đồng ý với điều khoản sử dụng và chính sách bảo mật!');
        res.redirect(req.get("Referrer") || "/user/register");
        return;
    }
    next();
}
module.exports.loginPost=(req,res,next)=>{
    if (req.body.email.length==0){
        req.flash('error', 'Email không được để trống!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    if (req.body.password.length<8){
        req.flash('error', 'Mật khẩu phải có ít nhất 8 ký tự!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    next();
}
module.exports.otpPasswordPost=(req,res,next)=>{
    if (req.body.email.length==0){
        req.flash('error', 'Email không được để trống!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    if (req.body.otp.length==0){
        req.flash('error', 'Mã OTP không được để trống!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    next();
}
module.exports.resetPasswordPost=(req,res,next)=>{
    if (req.body.password.length==0){
        req.flash('error', 'Mật khẩu không được để trống!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    if (req.body.confirmPassword.length==0){
        req.flash('error', 'Xác nhận mật khẩu không được để trống!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    if (req.body.password.length<8){
        req.flash('error', 'Mật khẩu phải có ít nhất 8 ký tự!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    if (req.body.password!=req.body.confirmPassword){
        req.flash('error', 'Mật khẩu không khớp!');
        res.redirect(req.get("Referrer") || "/");
        return;
    }
    next();
}
