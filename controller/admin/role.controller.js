const Role = require("../../models/role.model")
const systemConfig = require("../../config/system.js");
// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/index", {
        title: "Nhóm quyền",
        currentUrl: req.originalUrl,
        records: records
    });
}
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        title: "Thêm nhóm quyền"
    });
}
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    try {
        const record = new Role(req.body);
        await record.save();
        req.flash("success", "Nhóm quyền đã được thêm thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi khi thêm nhóm quyền");
        res.redirect("back");
    }
}
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await Role.findOne({
            _id: id,
            deleted: false
        });
        res.render(`admin/pages/roles/edit`, {
            title: "Cập nhật nhóm quyền",
            record: record
        });
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi khi lấy nhóm quyền");
        res.redirect("back");
    }
}
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.title = req.body.title.trim();
        req.body.description = req.body.description.trim();
        await Role.updateOne({
            _id: id
        }, req.body);
        req.flash("success", "Nhóm quyền đã được cập nhật thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi khi cập nhật nhóm quyền");
        res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
    }
}
// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: Date.now()
        });
        req.flash("success", "Nhóm quyền đã được xóa thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi khi xóa nhóm quyền");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}
//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions", {
        title: "Phân quyền",
        currentUrl: req.originalUrl,
        records: records
    })
}
// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        // console.log(JSON.parse(req.body.permissions));
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            await Role.updateOne({
                _id: item.id
            }, {
                permissions: item.permissions
            })
        }
        req.flash("success", "Phân quyền đã được cập nhật thành công");
        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
    } catch (error) {
        req.flash("error", "Đã xảy ra lỗi khi cập nhật phân quyền");
        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
    }
}