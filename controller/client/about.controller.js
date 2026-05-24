const Job = require("../../models/jobs.model");
const Company = require("../../models/company.model");

module.exports.index = async (req, res) => {
    const [activeJobs, activeCompanies] = await Promise.all([
        Job.countDocuments({
            deleted: false,
            status: "active"
        }),
        Company.countDocuments({
            deleted: false,
            status: "active"
        })
    ]);

    res.render("client/pages/about/index", {
        pageTitle: "Giới thiệu",
        activeJobs: activeJobs,
        activeCompanies: activeCompanies
    });
};
