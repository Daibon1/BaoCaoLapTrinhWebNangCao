const Job = require("../../models/jobs.model");
const Category = require("../../models/jobs-category.model");
const Company = require("../../models/company.model");
const helperCategory = require("../../helpers/product-category");
const SavedJob = require("../../models/saved-jobs.model");
const filterSearchHepler = require("../../helpers/filterSearch");
const paginationHelper = require("../../helpers/pagination.js");

// [GET] /jobs
module.exports.index = async (req, res) => {
    const find = {
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
        find.$or = [
            { title: filterSearchHelper.regex },
            { description: filterSearchHelper.regex }
        ];
    }
    if (location) {
        find.location = location;
    }
    if (type) {
        find.type = type;
    }

    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    const countJobs = await Job.countDocuments(find);
    const objectPagination = paginationHelper({
        limitItem: 6,
        skipItem: 0,
        page: 1
    }, req.query, countJobs);

    const jobs = await Job.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skipItem)
        .populate("company_id");

    res.render("client/pages/jobs/index", {
        pageTitle: "Danh sách công việc",
        jobs: jobs,
        filterLocation: filterLocation,
        filterType: filterType,
        keyword: keyword,
        pagination: objectPagination
    });
};

// [GET] /jobs/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const job = await Job.findOne({
            slug: req.params.slugJob,
            status: "active",
            deleted: false
        });

        if (!job) {
            req.flash("error", "Không tìm thấy công việc.");
            return res.redirect("/jobs");
        }

        let category = null;
        if (job.category) {
            category = await Category.findOne({
                _id: job.category,
                deleted: false,
                status: "active"
            });
        }

        const query = {
            _id: req.cookies.saveJobId,
            jobIds: {
                $in: [job._id]
            }
        };
        if (res.locals.user) {
            query.userId = res.locals.user.id;
        }

        const savedJob = await SavedJob.findOne(query);
        job.savedJob = !!savedJob;

        const jobCategory = await Job.find({
            _id: {
                $ne: job._id
            },
            category: job.category,
            deleted: false,
            status: "active"
        }).limit(3).populate("company_id");

        const company = await Company.findOne({
            _id: job.company_id,
            deleted: false,
            status: "active"
        });

        res.render("client/pages/jobs/detail", {
            pageTitle: job.title,
            job: job,
            category: category,
            company: company,
            jobCategory: jobCategory
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi tải dữ liệu!");
        res.redirect("/jobs");
    }
};

// [GET] /jobs/:slugCategory
module.exports.category = async (req, res) => {
    const category = await Category.findOne({
        slug: req.params.slugCategory,
        deleted: false,
        status: "active"
    });

    if (!category) {
        req.flash("error", "Không tìm thấy danh mục.");
        return res.redirect("/jobs");
    }

    const find = {
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

    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    const subCategories = await helperCategory.getSubCategory(category.id);
    const listSubCategoryId = subCategories.map(item => item.id);
    const categoryFilter = {
        category: {
            $in: [category.id, ...listSubCategoryId]
        }
    };

    const countJobs = await Job.countDocuments({
        ...find,
        ...categoryFilter
    });
    const objectPagination = paginationHelper({
        limitItem: 6,
        skipItem: 0,
        page: 1
    }, req.query, countJobs);

    const jobs = await Job.find({
        ...find,
        ...categoryFilter
    }).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skipItem).populate("company_id");

    res.render("client/pages/jobs/index", {
        pageTitle: category.title,
        jobs: jobs,
        filterLocation: filterLocation,
        filterType: filterType,
        keyword: keyword,
        pagination: objectPagination
    });
};
