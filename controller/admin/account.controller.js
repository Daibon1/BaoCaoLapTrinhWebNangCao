const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system.js");
const paginationHelper = require("../../helpers/pagination.js");
const md5 = require('md5');

module.exports.index = async (req, res) => {
    try {
        let find = {
            deleted: false
        }
        // pagination
        const countAccounts = await Account.countDocuments(find);
        let objectPagination = paginationHelper({
            limitItem: 2,
            skipItem: 0,
            page: 1
        }, req.query, countAccounts);
        // console.log(req.originalUrl);
        // end pagination
        const accounts = await Account.find(find)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skipItem).select("-password -token");
        // res.json(jobs);
        for (const item of accounts) {
            const role = await Role.findOne({
                _id: item.role_id,
                deleted: false
            });
            item.role = role;
        }
        res.render("admin/pages/account/index", {
            accounts: accounts,
            title: "Danh sách tài khoản",
            pagination: objectPagination,
            currentUrl: req.originalUrl
        })
    } catch (error) {
        console.error(error);
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
}
//[GET] /admin/account/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });
    res.render("admin/pages/account/create", {
        title: "Tạo tài khoản",
        roles: roles
    })
}
//[POST] /admin/account/create
module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    const emailExists = await Account.findOne({
        email: req.body.email,
        deleted: false,
        status: "active"
    });
    if (emailExists) {
        req.flash('error', 'Email đã tồn tại!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/account/create`);
        return;
    }
    const newAccount = new Account(req.body);
    try {
        // console.log(req.body);
        await newAccount.save();
        req.flash('success', 'Tạo tài khoản thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi tạo tài khoản!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/account/create`);
    }
    // console.log(req.body);
}
//[GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await Account.findOne({
            _id: id,
            deleted: false
        });
        const roles = await Role.find({
            deleted: false
        });
        res.render("admin/pages/account/edit", {
            title: "Chỉnh sửa tài khoản",
            account: account,
            roles: roles
        })
    } catch (error) {
        console.error(error);
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
}
//[PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
    if (req.body.password) {
        req.body.password = md5(req.body.password);
    } else {
        delete req.body.password;
    }
    const emailExists = await Account.findOne({
        _id: {
            $ne: req.params.id
        },
        email: req.body.email,
        deleted: false,
        status: "active"
    });
    if (emailExists) {
        req.flash('error', 'Email đã tồn tại!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/account/edit/${req.params.id}`);
        return;
    }
    // console.log(req.body);
    try {
        await Account.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash('success', 'Cập nhật thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật tài khoản!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/account/edit/${req.params.id}`);
    }
}