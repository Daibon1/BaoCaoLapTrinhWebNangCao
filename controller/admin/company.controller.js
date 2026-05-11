const Company = require("../../models/company.model");
const Account = require("../../models/account.model");
// [GET] /admin/company/my-company
module.exports.index = async (req, res) => {
    const company = await Company.findOne({
        _id: res.locals.user.company_id
    });
    res.render("admin/pages/company/index", {
        title: "Công ty",
        company: company
    })
}
// [GET] /admin/company/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const company = await Company.findOne({
        _id: id
    });
    res.render("admin/pages/company/edit", {
        title: "Cập nhật công ty",
        company: company
    })
}
// [PATCH] /admin/company/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try {
        await Company.updateOne({
            _id: id
        }, req.body);
        req.flash('success', 'Cập nhật thành công!');
        res.redirect(`/admin/company/edit/${id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật công ty!');
        res.redirect(`/admin/company/edit/${id}`);
    }
}
// [GET] /admin/company/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/company/create", {
        title: "Tạo công ty"
    })
}
// [POST] /admin/company/create
module.exports.createPost = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const website = req.body.website;
    const address = req.body.address;
    const description = req.body.description;
    const size = req.body.size;
    const logo = req.file;
    req.body.createdBy = {
        account_id: res.locals.user._id
    }
    if (name && email && phone && address && description && size && logo) {
        const newCompany = new Company(req.body);
        try {
            await newCompany.save();
            await Account.updateOne({
                _id: res.locals.user._id
            }, {
                company_id: newCompany._id
            });
            req.flash('success', 'Công ty thành công!');
            res.redirect(`/admin/company/create`);
        } catch (error) {
            console.error(error);
            req.flash('error', 'Có lỗi xảy ra khi tạo công ty!');
            res.redirect(`/admin/company/create`);
        }
    } else {
        req.flash('error', 'Vui lòng điền các thông tin công ty');
        res.redirect(`/admin/company/create`);
    }
}