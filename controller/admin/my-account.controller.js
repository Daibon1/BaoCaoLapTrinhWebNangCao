const Account = require("../../models/account.model.js");
const systemConfig = require("../../config/system.js");
// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    const account = await Account.findOne({
        _id: res.locals.user._id
    })
    const role = res.locals.role;
    res.render("admin/pages/my-account/index", {
        title: "Trang tài khoản của tôi",
        account: account,
        currentUrl: req.originalUrl,
        role: role
    })
}
// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        title: "Chỉnh sửa thông tin cá nhân",
        user: res.locals.user
    })
}
// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req,res) =>{
    const id=res.locals.user.id;
    try{
        await Account.updateOne({_id:id},req.body);
        req.flash('success', 'Cập nhật thông tin thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
    }catch(error){
        console.error(error);    
        req.flash('error', 'Có lỗi xảy ra khi cập nhật thông tin!');
        res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
    }
}