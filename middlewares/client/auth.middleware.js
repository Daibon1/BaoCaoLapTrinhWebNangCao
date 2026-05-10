const User = require("../../models/user.model");
module.exports.requireAuth =async (req, res, next) =>{
    if(!req.cookies.tokenUser){
        req.flash('error', 'Bạn chưa đăng nhập!');
        res.redirect(res.get("Referrer") || "/user/login");
    }
    else{
        const tokenUser=req.cookies.tokenUser;
        const user=await User.findOne({tokenUser:tokenUser}).select("-password");
        if(!user){
            req.flash('error', 'Bạn chưa đăng nhập!');
            res.redirect(res.get("Referrer") || "/user/login");
        }
        else{
            res.locals.user=user;
            next();
        }
    }
}