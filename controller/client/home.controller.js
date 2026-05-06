const Job = require("../../models/jobs.model");
module.exports.index = async (req, res) => {
    // lấy ra danh sách công việc nổi bật 
    const jobsFeatured = await Job.find({
        featured:"1",
        deleted:false,
        status:"active"
    }).limit(6);
    // console.log("ok");
    // console.log(productsFeatured);
    // Hiển thị danh sách công iệc mới nhất
    const jobsNew = await Job.find({
        deleted:false,
        status:"active"
    }).sort({
        position: "desc"
    }).limit(6);
    res.render('client/pages/home/index', {
        title: "Trang Chủ",
        jobsFeatured:jobsFeatured,
        jobsNew:jobsNew
    });
}