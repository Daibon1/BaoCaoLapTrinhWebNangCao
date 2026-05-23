const Job = require("../../models/jobs.model")
const JobCategory = require("../../models/jobs-category.model.js");
const Account = require("../../models/account.model.js");
const filterSearchHelper = require("../../helpers/filterSearch.js")
const paginationHelper = require("../../helpers/pagination.js")
const systemConfig = require("../../config/system.js");
const createTreeHelper = require("../../helpers/createTree.js");

const jobFilterStatus = (query) => {
    const filterStatus = [
        { name: "Tất Cả", status: "", class: "" },
        { name: "Chờ duyệt", status: "pending", class: "" },
        { name: "Hoạt Động", status: "active", class: "" },
        { name: "Ngừng Hoạt Động", status: "inactive", class: "" }
    ];
    const index = filterStatus.findIndex(item => item.status == query.status);

    if (index >= 0) {
        filterStatus[index].class = "btn-success";
    } else {
        filterStatus[0].class = "btn-success";
    }

    return filterStatus;
};

// [GET] /admin/job
module.exports.index = async (req, res) => {
    let filterStatus = jobFilterStatus(req.query);
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;
    }
    let filterLocation = filterSearchHelper(req.query).filterLocation;
    const keyword = filterSearchHelper(req.query).title;
    const location = filterSearchHelper(req.query).location;
    const regex = filterSearchHelper(req.query).regex;
    if (regex) {
        find.title = regex;
    }
    if (location) {
        find.location = location;
    }
    // sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort.position = "desc"
    }
    // end sort
    if (res.locals.role.title === "Employer") {
        find["createdBy.account_id"] = res.locals.user._id;
    }
    // pagination
    const countJobs = await Job.countDocuments(find);
    let objectPagination = paginationHelper({
        limitItem: 4,
        skipItem: 0,
        page: 1
    }, req.query, countJobs);
    // console.log(req.originalUrl);
    // end pagination

    // console.log(find);
    const jobs = await Job.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skipItem);
    // res.json(jobs);
    for (const job of jobs) {
        //Lấy ra tên người tạo
        const user = await Account.findOne({
            _id: job.createdBy.account_id
        });
        if (user) {
            job.accountFullName = user.fullName;
        }
        //Lấy ra tên người cập nhật gần nhất
        const updatedBy = job.updatedBy.slice(-1)[0];
        if (updatedBy) {
            const userUpdatedBy = await Account.findOne({
                _id: updatedBy.account_id
            });
            if (userUpdatedBy) {
                updatedBy.accountFullName = userUpdatedBy.fullName;
            }
        }
    }
    res.render("admin/pages/job/index", {
        title: "Trang quản lý công việc",
        message: 'Hello, world!',
        currentUrl: req.originalUrl,
        jobs: jobs,
        filterStatus: filterStatus,
        keyword: keyword,
        filterLocation: filterLocation,
        pagination: objectPagination
    })
    // console.log(req.originalUrl);
    // console.log(req.body);
}
module.exports.indexApi = async (req, res) => {
    const jobs = await Job.find({});
    res.json(jobs);
}
//[PATCH] /admin/job/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const allowedStatuses = ["pending", "active", "inactive"];

    if (!allowedStatuses.includes(status)) {
        req.flash('error', 'Trạng thái công việc không hợp lệ!');
        return res.redirect(req.get("Referrer") || "/admin/job");
    }

    try {
        const job = await Job.findOne({
            _id: id,
            deleted: false
        });

        if (!job) {
            req.flash('error', 'Không tìm thấy công việc!');
            return res.redirect(req.get("Referrer") || "/admin/job");
        }

        if (res.locals.role.title === "Employer") {
            const isOwner = job.createdBy && job.createdBy.account_id == res.locals.user.id;
            const canToggleApprovedJob = ["active", "inactive"].includes(job.status) && ["active", "inactive"].includes(status);

            if (!isOwner || !canToggleApprovedJob) {
                req.flash('error', 'Bạn chỉ được bật/tắt công việc đã được admin duyệt!');
                return res.redirect(req.get("Referrer") || "/admin/job");
            }
        }

        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Job.updateOne({
            _id: id
        }, {
            $set: {
                status: status
            },
            $push: {
                updatedBy: updatedBy
            }
        })
        req.flash('success', 'Cập nhật trạng thái thành công!');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái!');
    }
    res.redirect(req.get("Referrer") || "/admin/job");
}
// [PATCH] /admin/job/change-multi
module.exports.changeMulti = async (req, res) => {
    let type = req.body.type;
    let ids = req.body.ids;

    if (["pending", "active", "inactive"].includes(type) && res.locals.role.title === "Employer") {
        req.flash('error', 'Bạn không có quyền duyệt trạng thái công việc!');
        return res.redirect(req.get("Referrer") || "/admin/job");
    }

    ids = ids.split(", ");
    // console.log(ids);
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    switch (type) {
        case "active":
            try {
                await Job.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: "active",
                    $push: {
                        updatedBy: updatedBy
                    }
                })
                req.flash('success', `Cập nhật trạng thái cho ${ids.length} jobs thành công!`);

            } catch (error) {
                console.error(error);
                req.flash('error', `Có lỗi xảy ra khi cập nhật trạng thái cho ${ids.length} jobs!`);
            }
            break;
        case "pending":
            try {
                await Job.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: "pending",
                    $push: {
                        updatedBy: updatedBy
                    }
                })
                req.flash('success', `Cập nhật trạng thái cho ${ids.length} jobs thành công!`);
            } catch (error) {
                console.error(error);
                req.flash('error', `Có lỗi xảy ra khi cập nhật trạng thái cho ${ids.length} jobs!`);
            }
            break;
        case "inactive":
            try {
                await Job.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: "inactive",
                    $push: {
                        updatedBy: updatedBy
                    }
                })
                req.flash('success', `Cập nhật trạng thái cho ${ids.length} jobs thành công!`);
            } catch (error) {
                console.error(error);
                req.flash('error', `Có lỗi xảy ra khi cập nhật trạng thái cho ${ids.length} jobs!`);
            }
            break;
        case "delete-all":
            try {
                await Job.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deletedBy: {
                        account_id: res.locals.user._id,
                        deleteAt: new Date()
                    }
                })
                req.flash('success', `Xóa thành công ${ids.length} jobs!`);
            } catch (error) {
                console.error(error);
                req.flash('error', `Có lỗi xảy ra khi xóa ${ids.length} jobs!`);
            }
            break;
        case "change-position":
            try {
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Job.updateOne({
                        _id: id
                    }, {
                        position: position,
                        $push: {
                            updatedBy: updatedBy
                        }
                    })
                }
                req.flash('success', `Cập nhật vị trí cho ${ids.length} jobs thành công!`);
            } catch (error) {
                console.error(error);
                req.flash('error', `Có lỗi xảy ra khi cập nhật vị trí cho ${ids.length} jobs!`);
            }
            break;
    }
    res.redirect(req.get("Referrer") || "/admin/job");
}
//"[DELETE] /admin/job/delete/:id"
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    try {
        await Job.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user._id,
                deleteAt: new Date()
            }
        })
        req.flash('success', 'Xóa thành công!');
    } catch (error) {
        console.error(error);
    }
    res.redirect(req.get("Referrer") || "/admin/job");
}
//[GET] /admin/job/create
module.exports.create = async (req, res) => {
    if(res.locals.role.permissions.includes("jobs-create")&&res.locals.user.company_id){
    const categories = await JobCategory.find({
        deleted: false
    });
    const newCategories = createTreeHelper.tree(categories);
    res.render("admin/pages/job/create", {
        title: "Trang tạo công việc",
        currentUrl: req.originalUrl,
        categories: newCategories
    })}
    else{
        req.flash('error', 'Bạn không có quyền truy cập || Vui lòng tạo công ty trước khi tạo công việc');
        res.redirect(`/admin/job`);
    }
}
//[POST] /admin/job/create
module.exports.createPost = async (req, res) => {
    const skills = req.body.skill
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    if (skills.length > 5) {
        req.flash('error', 'Chỉ được tối đa 5 kỹ năng');
        return res.redirect(`${systemConfig.prefixAdmin}/job/create`);
    }

    for (let skill of skills) {
        if (skill.length > 20) {
            req.flash('error', 'Mỗi kỹ năng tối đa 20 ký tự');
            return res.redirect(`${systemConfig.prefixAdmin}/job/create`);
        }
    }
    if (skills.length > 0) {
        req.body.skill = skills;
    } else {
        req.body.skill = [];
    }
    req.body.company_id = res.locals.user.company_id;
    req.body.status = "pending";
    req.body.salaryMin = parseInt(req.body.salaryMin);
    req.body.salaryMax = parseInt(req.body.salaryMax);
    if (!req.body.position) {
        const countJobs = await Job.countDocuments();
        req.body.position = countJobs + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id: res.locals.user._id
    }
    const newJob = new Job(req.body);
    console.log(req.file);
    try {
        await newJob.save();
        req.flash('success', 'Tạo công việc thành công, đang chờ admin duyệt!');
        res.redirect(`${systemConfig.prefixAdmin}/job`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi tạo công việc!');
        res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/job/create`);
    }
    // console.log(req.body);
}
// console.log(keyword);
// consolek.log(status);
//[GET] /admin/job/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = {
            _id: id,
            deleted: false
        }
        const job = await Job.findOne(find);
        const categories = await JobCategory.find({
            deleted: false
        });
        const newCategories = createTreeHelper.tree(categories);
        res.render("admin/pages/job/edit", {
            title: "Cập nhật công việc",
            currentUrl: req.originalUrl,
            job: job,
            categories: newCategories
        })
    } catch (error) {
        console.error(error);
        res.redirect(`${systemConfig.prefixAdmin}/job`);
    }
}
//[PATCH] /admin/job/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const skills = req.body.skill
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    if (skills.length > 5) {
        req.flash('error', 'Chỉ được tối đa 5 kỹ năng');
        return res.redirect(`${systemConfig.prefixAdmin}/job/edit/${id}`);
    }

    for (let skill of skills) {
        if (skill.length > 20) {
            req.flash('error', 'Mỗi kỹ năng tối đa 20 ký tự');
            return res.redirect(`${systemConfig.prefixAdmin}/job/edit/${id}`);
        }
    }
    if (skills.length > 0) {
        req.body.skill = skills;
    } else {
        req.body.skill = [];
    }
    req.body.skill = skills;

    if (res.locals.role.title === "Employer") {
        const currentJob = await Job.findOne({
            _id: id,
            deleted: false
        });
        const canUpdateStatus = currentJob
            && ["active", "inactive"].includes(currentJob.status)
            && ["active", "inactive"].includes(req.body.status);

        if (!canUpdateStatus) {
            delete req.body.status;
        }
    }
    req.body.salaryMin = parseInt(req.body.salaryMin);
    req.body.salaryMax = parseInt(req.body.salaryMax);
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    req.body.position = parseInt(req.body.position);
    try {
        await Job.updateOne({
            _id: id
        }, {
            ...req.body,
            $push: {
                updatedBy: updatedBy
            }
        });
        req.flash('success', 'Cập nhật công việc thành công!');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật công việc!');
    }
    res.redirect(`${systemConfig.prefixAdmin}/job/edit/${id}`);
}
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const job = await Job.findOne({
            _id: id
        });
        const category = await JobCategory.findOne({
            _id: job.category
        })
        res.render("admin/pages/job/detail", {
            title: "Chi tiết công việc",
            currentUrl: req.originalUrl,
            job: job,
            category: category
        })
    } catch (error) {
        console.error(error);
        res.redirect(res.get("Referrer") || "/admin/job");
    }
}
