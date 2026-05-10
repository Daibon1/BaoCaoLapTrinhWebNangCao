const Application = require("../../models/application.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Job = require("../../models/jobs.model");
// [GET] /admin/user-approval
module.exports.index = async (req, res) => {
    const jobs = await Job.find({
        "createdBy.account_id": res.locals.user._id
    }).select("_id")
    const jobIds = jobs.map(job=>job._id);
    const applications = await Application.find({
        jobId: {
            $in: jobIds
        }
    }).populate("jobId").populate("userId");
    // console.log(applications);
    res.render("admin/pages/user-approval/index", {
        pagetitle: "Duyệt ứng tuyển",
        currentUrl: req.originalUrl,
        applications: applications
    })
}
// [PATCH] /admin/user-approval/change-status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Application.updateOne({
            _id: id
        }, {
            $set: {
                status: status
            }
        })
        req.flash('success', 'Cập nhật trạng thái thành công!');
        res.redirect(req.get("Referrer") || `/admin/user-approval`);
    }
    catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái!');
        res.redirect(req.get("Referrer") || `/admin/user-approval`);
    }
}