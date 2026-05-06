const systemConfig = require("../../config/system.js");
const JobCategory = require("../../models/jobs-category.model.js");
const paginationHelper = require("../../helpers/pagination.js")
const createTreeHelper = require("../../helpers/createTree.js");
// [GET] /admin/job-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    // pagination
    const countJobCategory = await JobCategory.countDocuments(find);
    let objectPagination = paginationHelper({
        limitItem: 4,
        skipItem: 0,
        page: 1
    }, req.query, countJobCategory);
    // console.log(req.originalUrl);
    // end pagination
    const records = await JobCategory.find(find).sort({
            position: "asc"
        }).limit(objectPagination.limitItem)
        .skip(objectPagination.skipItem);;
    res.render("admin/pages/job-category/index", {
        title: "Danh mục việc làm",
        currentUrl: req.originalUrl,
        records: records,
        pagination: objectPagination
    })
}
// [GET] /admin/job-category/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    };

    const records = await JobCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    res.render(`admin/pages/job-category/create`, {
        title: "Thêm danh mục việc làm",
        records: newRecords
    });
}
// [POST] /admin/job-category/create
module.exports.createPost = async (req, res) => {
    try {
        const find = {
            deleted: false
        }
        if (!req.body.position) {
            const count = await JobCategory.countDocuments(find);
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        // console.log("ok");
        const newJobCategory = new JobCategory(req.body);
        await newJobCategory.save();
        req.flash('success', 'Tạo danh mục thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/job-category`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi tạo danh mục!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/job-category/create`);
    }
}
// [GET] /admin/job-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const find = {
            deleted: false
        }
        const jobCategory = await JobCategory.find(find);
        const newRecords = createTreeHelper.tree(jobCategory);
        const data = await JobCategory.findOne({
            _id: id
        });
        res.render("admin/pages/job-category/edit", {
            title: "Sửa danh mục việc làm",
            data: data,
            records: newRecords
        })
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi hiển thị trang sửa danh mục!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/job-category`);
    }
}
// [PATCH] /admin/job-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try{
        req.body.position = parseInt(req.body.position);
        const find = {
            deleted: false
        }
        await JobCategory.updateOne({_id: id}, req.body);
        req.flash('success', 'Cập nhật danh mục thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/job-category/edit/${id}`);
    }
    catch(error){
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật danh mục!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/job-category/edit/${id}`);
    }
}