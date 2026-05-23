const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");

// [GET] /employer/register
module.exports.register = async (req, res) => {
    res.render("client/pages/employer/register", {
        pageTitle: "Đăng ký nhà tuyển dụng"
    });
};

// [POST] /employer/register
module.exports.registerPost = async (req, res) => {
    try {
        const email = req.body.email.trim();
        const emailExists = await Account.findOne({
            email: email,
            deleted: false
        });

        if (emailExists) {
            req.flash("error", "Email đã được sử dụng!");
            return res.redirect(req.get("Referrer") || "/employer/register");
        }

        const employerRole = await Role.findOne({
            title: "Employer",
            deleted: false
        });

        if (!employerRole) {
            req.flash("error", "Chưa có nhóm quyền Employer. Vui lòng liên hệ quản trị viên.");
            return res.redirect(req.get("Referrer") || "/employer/register");
        }

        const account = new Account({
            fullName: req.body.fullName.trim(),
            email: email,
            phone: req.body.phone ? req.body.phone.trim() : "",
            password: md5(req.body.password),
            role_id: employerRole.id,
            status: "inactive"
        });

        await account.save();
        req.flash("success", "Đăng ký nhà tuyển dụng thành công. Tài khoản đang chờ admin duyệt.");
        res.redirect("/admin/auth/login");
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi đăng ký nhà tuyển dụng!");
        res.redirect(req.get("Referrer") || "/employer/register");
    }
};
