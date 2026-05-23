const Job = require("../../models/jobs.model");
const Company = require("../../models/company.model");

const escapeRegex = (value = "") => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : "";
    if (!keyword) {
        return res.redirect("/");
    }

    const regex = new RegExp(escapeRegex(keyword), "i");
    const companies = await Company.find({
        deleted: false,
        status: "active",
        $or: [
            { name: regex },
            { address: regex },
            { description: regex }
        ]
    }).select("_id");
    const companyIds = companies.map(company => company._id.toString());

    const jobs = await Job.find({
        deleted: false,
        status: "active",
        $or: [
            { title: regex },
            { description: regex },
            { location: regex },
            { type: regex },
            { experience: regex },
            { skill: regex },
            {
                company_id: {
                    $in: companyIds
                }
            }
        ]
    }).sort({
        position: "desc"
    }).populate("company_id");

    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        jobs: jobs
    });
};
