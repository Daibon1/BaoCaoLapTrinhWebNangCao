const Job = require("../../models/jobs.model");
const SavedJob = require("../../models/saved-jobs.model");
module.exports.index = async (req, res) => {
    // lấy ra danh sách công việc nổi bật 
    const jobsFeatured = await Job.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);
    // console.log("ok");
    // console.log(productsFeatured);
    // Hiển thị danh sách công iệc mới nhất

    const jobsNew = await Job.find({
        deleted: false,
        status: "active"
    }).sort({
        position: "desc"
    }).limit(6);
    // lấy saved job
    // const savedJob = await SavedJob.findById(
    //     req.cookies.saveJobId
    // );

    // let jobsSaved = [];

    // if (savedJob) {
    //     jobsSaved = await Job.find({
    //         _id: {
    //             $in: savedJob.jobIds
    //         }
    //     });
    // }
    // console.log(jobsSaved.map(job => job._id));
    res.render('client/pages/home/index', {
        title: "Trang Chủ",
        jobsFeatured: jobsFeatured,
        jobsNew: jobsNew,
        // jobsSaved: jobsSaved
    });
}