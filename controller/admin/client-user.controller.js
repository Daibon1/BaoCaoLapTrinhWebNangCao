const User = require("../../models/user.model");
const systemConfig = require("../../config/system.js");
const paginationHelper = require("../../helpers/pagination.js");
const filterStatusHelper = require("../../helpers/filterStatus.js");

module.exports.index = async (req, res) => {
    try {
        const find = {
            deleted: false
        };
        const filterStatus = filterStatusHelper(req.query);
        filterStatus[1].name = "Không khóa";
        filterStatus[2].name = "Đã khóa";
        let keyword = "";

        if (req.query.status) {
            find.status = req.query.status;
        }

        if (req.query.keyword) {
            keyword = req.query.keyword;
            const keywordRegex = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            find.$or = [
                { fullName: new RegExp(keywordRegex, "i") },
                { email: new RegExp(keywordRegex, "i") },
                { phone: new RegExp(keywordRegex, "i") }
            ];
        }

        const countUsers = await User.countDocuments(find);
        const objectPagination = paginationHelper({
            limitItem: 4,
            skipItem: 0,
            page: 1
        }, req.query, countUsers);

        const users = await User.find(find)
            .sort({ createdAt: "desc" })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skipItem)
            .select("-password -tokenUser");

        res.render("admin/pages/client-user/index", {
            title: "Quản lý tài khoản user",
            currentUrl: req.originalUrl,
            users: users,
            filterStatus: filterStatus,
            keyword: keyword,
            pagination: objectPagination
        });
    } catch (error) {
        console.error(error);
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        await User.updateOne({
            _id: id
        }, {
            status: status
        });

        req.flash("success", status == "inactive" ? "Khóa tài khoản user thành công!" : "Mở khóa tài khoản user thành công!");
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi cập nhật trạng thái user!");
    }

    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/client-user`);
};

module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        await User.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });

        req.flash("success", "Xóa tài khoản user thành công!");
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi xóa tài khoản user!");
    }

    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/client-user`);
};
