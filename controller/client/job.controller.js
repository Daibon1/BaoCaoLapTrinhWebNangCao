const Job = require("../../models/jobs.model");
const Category = require("../../models/jobs-category.model");
const Company = require("../../models/company.model");
const helperCategory = require("../../helpers/product-category");
const SavedJob = require("../../models/saved-jobs.model");
const filterSearchHepler = require("../../helpers/filterSearch");
const paginationHelper = require("../../helpers/pagination.js")
// [GET] /jobs
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        status: "active"
    };
    const filterSearchHelper = filterSearchHepler(req.query);
    const filterLocation = filterSearchHelper.filterLocation;
    const filterType = filterSearchHelper.filterType;
    const keyword = filterSearchHelper.title;
    const location = filterSearchHelper.location;
    const type = filterSearchHelper.type;
    if (keyword) {
        find.title = filterSearchHelper.regex;
    }
    if (location) {
        find.location = location;
    }
    if (type) {
        find.type = type;
    }
    // console.log("ok");
    // console.log(jobs);
    // console.log(filterType);
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
    // pagination
    const countJobs = await Job.countDocuments(find);
    let objectPagination = paginationHelper({
        limitItem: 6,
        skipItem: 0,
        page: 1
    }, req.query, countJobs);
    const jobs = await Job.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skipItem);
    res.render("client/pages/jobs/index", {
        title: "Danh sách công việc",
        jobs: jobs,
        filterLocation: filterLocation,
        filterType: filterType,
        keyword: keyword,
        pagination: objectPagination
    });
}
// [GET] /jobs/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slugJob;
        const job = await Job.findOne({
            slug: slug,
            status: "active",
            deleted: false
        });
        let category = null;
        if (job.category) {
            category = await Category.findOne({
                _id: job.category,
                deleted: false,
                status: "active"
            });
        }
        //Kiểm tra xem công việc đã được lưu vào danh sách yêu thích chưa
        const query = {
            _id: req.cookies.saveJobId,
            jobIds: {
                $in: [job._id]
            }
        }
        if (res.locals.user) {
            query.userId = res.locals.user.id;
        }
        const savedJob = await SavedJob.findOne(query);
        if (savedJob) {
            job.savedJob = true;
        } else {
            job.savedJob = false;
        }
        const jobCategory = await Job.find({
            category: job.category,
            deleted: false,
            status: "active"
        }).limit(3);
        const company = await Company.findOne({
            _id: job.company_id,
            deleted: false,
            status: "active"
        });
        if (job) {
            res.render("client/pages/jobs/detail", {
                title: "Chi tiết công việc",
                job: job,
                category: category,
                company: company,
                jobCategory: jobCategory
            })
        } else {
            req.flash("error", "Vui lòng thêm slug");
            return res.redirect("/jobs");
        }
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi tải dữ liệu!");
        res.redirect(`/jobs`);
    }
}
// [GET] /jobs/:slugCategory
module.exports.category = async (req, res) => {
    const category = await Category.findOne({
        slug: req.params.slugCategory,
        deleted: false,
        status: "active"
    });
    let find = {
        deleted: false,
        status: "active"
    };
    const filterSearchHelper = filterSearchHepler(req.query);
    const filterLocation = filterSearchHelper.filterLocation;
    const filterType = filterSearchHelper.filterType;
    const keyword = filterSearchHelper.title;
    const location = filterSearchHelper.location;
    const type = filterSearchHelper.type;
    if (keyword) {
        find.title = filterSearchHelper.regex;
    }
    if (location) {
        find.location = location;
    }
    if (type) {
        find.type = type;
    }
    // console.log("ok");
    // console.log(jobs);
    // console.log(filterType);
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
    // pagination
    const subCategories = await helperCategory.getSubCategory(category.id);
    const listSubCategoryId = subCategories.map(item => item.id);
    //pagination
    const countJobs = await Job.countDocuments({
        ...find,
        category: {
            $in: [category.id, ...listSubCategoryId]
        },
    });
    let objectPagination = paginationHelper({
        limitItem: 6,
        skipItem: 0,
        page: 1
    }, req.query, countJobs);

    const jobs = await Job.find({
        ...find,
        category: {
            $in: [category.id, ...listSubCategoryId]
        }
    }).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skipItem);
    res.render("client/pages/jobs/index", {
        title: category.title,
        jobs: jobs,
        filterLocation: filterLocation,
        filterType: filterType,
        keyword: keyword,
        pagination: objectPagination
    });
}