const Company = require("../../models/company.model");
const Job = require("../../models/jobs.model");
const Account = require("../../models/account.model");
module.exports.index = async (req, res) => {
    const companies = await Company.find({});
    res.render("client/pages/company/index", {
        title: "Công ty",
        companies: companies
    })
}
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const company = await Company.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    });
    let jobs = [];
    if(company){
        const user = await Account.findOne({
            _id: company.createdBy.account_id
        });
        // console.log(user);
        jobs = await Job.find({
            deleted: false,
            status: "active",
            "createdBy.account_id": user._id
        }).sort({
            position: "asc"
        }).limit(3);
    }
    // console.log(jobs);
    res.render("client/pages/company/detail", {
        title: "Chi tiết công ty",
        company: company,
        jobs: jobs
    })
}