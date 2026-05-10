const Job = require("../../models/jobs.model");
module.exports.index = async (req, res) => {
    if (!req.query.keyword) {
        return res.redirect("/");
    }
    const keyword = req.query.keyword.trim();
    if (keyword) {
        const regex = new RegExp(keyword, "i");
        const jobs = await Job.find({
            title: regex,
            deleted: false,
            status: "active"
        })
        res.render("client/pages/search/index", {
            pageTitle: "Kết quả tìm kiếm",
            keyword: keyword,
            jobs: jobs
        });
    }
}