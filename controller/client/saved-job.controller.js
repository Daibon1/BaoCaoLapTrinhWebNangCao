const SavedJob = require("../../models/saved-jobs.model");
const Job = require("../../models/jobs.model")
// [POST] /saved-jobs/add/:jobId
module.exports.savedJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const savedJobId = req.cookies.saveJobId;
        const savedJob = await SavedJob.findOne({
            _id: savedJobId
        });
        const existsJob = savedJob.jobIds.some(id => id.toString() === jobId);
        if (existsJob) {
            await SavedJob.updateOne({
                _id: savedJobId
            }, {
                $pull: {
                    jobIds: jobId
                }
            })
            req.flash("success", "Xóa công việc khỏi lưu trữ thành công");
        } else {
            await SavedJob.updateOne({
                _id: savedJobId
            }, {
                $push: {
                    jobIds: jobId
                }
            })
            req.flash("success", "Lưu công việc thành công");
        }
        res.redirect(req.get("Referrer") || "/");
    } catch (error) {
        console.log(error);
        req.flash("error", "Có lỗi xảy ra khi lưu công việc!");
        res.redirect(req.get("Referrer") || "/");
    }
}
// [GET] /saved-jobs
module.exports.index = async (req, res) => {
    const savedJobId = req.cookies.saveJobId;
    const savedJob = await SavedJob.findOne({
        _id: savedJobId
    });
    const jobIds = savedJob ? savedJob.jobIds : [];
    const jobs = await Job.find({
        _id: {
            $in: jobIds
        }
    });
    res.render("client/pages/saved-jobs/index", {
        title: "Lưu công việc",
        savedJobs: jobs
    })
}