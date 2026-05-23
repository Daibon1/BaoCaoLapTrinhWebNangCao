const SavedJob = require("../../models/saved-jobs.model");
const Job = require("../../models/jobs.model");

// [POST] /saved-jobs/add/:jobId
module.exports.savedJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const savedJob = await SavedJob.findOne({
            _id: req.cookies.saveJobId
        });

        if (!savedJob) {
            req.flash("error", "Không tìm thấy danh sách việc làm đã lưu!");
            return res.redirect(req.get("Referrer") || "/");
        }

        const existsJob = savedJob.jobIds.some(id => id.toString() === jobId);
        if (existsJob) {
            await SavedJob.updateOne({
                _id: savedJob._id
            }, {
                $pull: {
                    jobIds: jobId
                }
            });
            req.flash("success", "Đã xóa công việc khỏi danh sách đã lưu.");
        } else {
            await SavedJob.updateOne({
                _id: savedJob._id
            }, {
                $push: {
                    jobIds: jobId
                }
            });
            req.flash("success", "Lưu công việc thành công.");
        }

        res.redirect(req.get("Referrer") || "/");
    } catch (error) {
        console.log(error);
        req.flash("error", "Có lỗi xảy ra khi lưu công việc!");
        res.redirect(req.get("Referrer") || "/");
    }
};

// [GET] /saved-jobs
module.exports.index = async (req, res) => {
    const savedJob = await SavedJob.findOne({
        _id: req.cookies.saveJobId
    });
    const jobIds = savedJob ? savedJob.jobIds : [];
    const jobs = await Job.find({
        _id: {
            $in: jobIds
        },
        deleted: false
    }).populate("company_id");

    res.render("client/pages/saved-jobs/index", {
        pageTitle: "Việc làm đã lưu",
        savedJobs: jobs
    });
};

// [GET] /saved-jobs/delete/:id
module.exports.deleteItem = async (req, res) => {
    const savedJob = await SavedJob.findOne({
        _id: req.cookies.saveJobId
    });

    if (!savedJob) {
        return res.redirect(req.get("Referrer") || "/saved-jobs");
    }

    try {
        await SavedJob.updateOne({
            _id: savedJob._id
        }, {
            $pull: {
                jobIds: req.params.id
            }
        });
        req.flash("success", "Xóa công việc đã lưu thành công!");
        res.redirect(req.get("Referrer") || "/saved-jobs");
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi xóa công việc!");
        res.redirect(req.get("Referrer") || "/saved-jobs");
    }
};
