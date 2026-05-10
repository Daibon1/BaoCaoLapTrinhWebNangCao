const Job = require("../../models/jobs.model");
const Application = require("../../models/application.model");
const User = require("../../models/user.model");
const { application } = require("express");
// [GET] /applications
module.exports.index = async (req, res) => {
    if (!res.locals.user) {
        res.render("client/pages/application/index", {
            title: "Danh sách đề xuất",
            applications: []
        })
        return;
    }
    try {
        const applications = await Application.find({
            userId: res.locals.user.id
        }).populate("jobId");
        res.render("client/pages/application/index", {
            title: "Danh sách đề xuất",
            applications: applications
        })
    }
    catch (error) {
        console.error(error);
        req.flash('error', 'Có lỗi xảy ra khi tải dữ liệu!');
        res.redirect(`/applications`);
    }
}
// [GET] /applications/add/:jobId
module.exports.add = async (req, res) => {
    if (!res.locals.user) {
        req.flash('error', 'Vui lòng đăng nhập để thực hiện thao tác này!');
        return res.redirect("/login");
    }
    const job = await Job.findOne({
        _id: req.params.jobId,
        deleted: false,
        status: "active"
    });
    res.render('client/pages/application/add', {
        pageTitle: "Ứng tuyển công việc",
        job: job
    })
}
// [POST] /applications/add/:jobId
module.exports.addPost = async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const jobId = req.params.jobId;
        console.log(jobId);
        // console.log("CV URL:", req.file); // Kiểm tra URL của CV
        const newApplication = new Application({
            jobId: jobId,
            userId: userId,
            cvUrl: req.body.cvUrl,
            coverLetter: req.body.coverLetter
        })
        await newApplication.save();
        req.flash('success', 'Ứng tuyển thành công!');
        res.redirect(`/`);
    } catch (error) {
        console.log(error);
        req.flash('error', 'Có lỗi xảy ra khi ứng tuyển công việc!');
        res.redirect(`/`);
    }
}