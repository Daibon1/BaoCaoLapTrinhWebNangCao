const Job = require("../../models/jobs.model");
const Category = require("../../models/jobs-category.model");
const helperCategory = require("../../helpers/product-category");
// [GET] /jobs
module.exports.index = async (req, res) => {
    const jobs = await Job.find({}).sort({
        position: "desc"
    });
    // console.log("ok");
    // console.log(jobs);
    res.render("client/pages/jobs/index", {
        title: "Danh sách công việc",
        jobs: jobs
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
        if(job.category){
            category = await Category.findOne({
                _id: job.category,
                deleted: false,
                status: "active"
            });
        }
        if (job) {
            req.flash("success", "Thành công!");
            res.render("client/pages/jobs/detail", {
                title: "Chi tiết công việc",
                job: job,
                category: category
            })
        }
        else{
            req.flash("error", "Vui lòng thêm slug");
            return res.redirect("/jobs");
        }
    } catch (error) {
        req.flash("error", "Có lỗi xảy ra khi tải dữ liệu!");
        res.redirect(`/jobs`);
    }
}
// [GET] /jobs/:slugCategory
module.exports.category = async(req,res)=>{
    const category = await Category.findOne({
        slug: req.params.slugCategory,
        deleted: false,
        status: "active"
    });
    const subCategories = await helperCategory.getSubCategory(category.id);
    const listSubCategoryId = subCategories.map(item => item.id);
    const jobs = await Job.find({
        category: { $in: [category.id, ...listSubCategoryId] },
        deleted: false,
        status: "active"
    }).sort({position : "desc"});
    res.render("client/pages/jobs/index", {
        title: category.title,
        jobs: jobs
    });
}