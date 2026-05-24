const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    req.flash("error", "Bạn chưa đăng nhập!");
    res.redirect(res.get("Referrer") || "/admin/auth/login");
  } else {
    const token = req.cookies.token;
    const user = await Account.findOne({ token: token }).select("-password");
    if (!user) {
      req.flash("error", "Bạn chưa đăng nhập!");
      res.redirect(res.get("Referrer") || "/admin/auth/login");
    } else {
      const role = await Role.findOne({ _id: user.role_id }).select(
        "title permissions",
      );
      res.locals.role = role;
      res.locals.user = user;
      next();
    }
  }
};
