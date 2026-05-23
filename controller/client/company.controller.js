const Company = require("../../models/company.model");
const Job = require("../../models/jobs.model");

const escapeRegex = (value = "") => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : "";
    const find = {
        deleted: false,
        status: "active"
    };

    if (keyword) {
        const regex = new RegExp(escapeRegex(keyword), "i");
        find.$or = [
            { name: regex },
            { address: regex },
            { description: regex }
        ];
    }

    const companies = await Company.find(find).sort({
        createdAt: "desc"
    });

    res.render("client/pages/company/index", {
        pageTitle: "Công ty",
        companies: companies,
        keyword: keyword
    });
};

module.exports.detail = async (req, res) => {
    const company = await Company.findOne({
        slug: req.params.slug,
        deleted: false,
        status: "active"
    });

    if (!company) {
        req.flash("error", "Không tìm thấy công ty.");
        return res.redirect("/company");
    }

    const jobs = await Job.find({
        deleted: false,
        status: "active",
        company_id: company._id.toString()
    }).sort({
        position: "desc"
    }).limit(4);

    res.render("client/pages/company/detail", {
        pageTitle: company.name,
        company: company,
        jobs: jobs
    });
};
