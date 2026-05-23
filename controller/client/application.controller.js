const Job = require("../../models/jobs.model");
const Application = require("../../models/application.model");

// [GET] /applications
module.exports.index = async (req, res) => {
    if (!res.locals.user) {
        return res.render("client/pages/application/index", {
            pageTitle: "Công việc đã ứng tuyển",
            applications: []
        });
    }

    try {
        const applications = await Application.find({
            userId: res.locals.user.id,
            hiddenByUser: {
                $ne: true
            }
        }).sort({
            createdAt: "desc"
        }).populate({
            path: "jobId",
            populate: {
                path: "company_id"
            }
        });

        res.render("client/pages/application/index", {
            pageTitle: "Công việc đã ứng tuyển",
            applications: applications
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Có lỗi xảy ra khi tải dữ liệu!");
        res.redirect("/applications");
    }
};

// [GET] /applications/add/:jobId
module.exports.add = async (req, res) => {
    if (!res.locals.user) {
        req.flash("error", "Vui lòng đăng nhập để thực hiện thao tác này!");
        return res.redirect("/login");
    }

    const application = await Application.findOne({
        jobId: req.params.jobId,
        userId: res.locals.user.id,
        hiddenByUser: {
            $ne: true
        }
    });

    if (application) {
        req.flash("error", "Bạn đã ứng tuyển công việc này rồi!");
        return res.redirect(req.get("Referrer") || "/applications");
    }

    const job = await Job.findOne({
        _id: req.params.jobId,
        deleted: false,
        status: "active"
    });

    res.render("client/pages/application/add", {
        pageTitle: "Ứng tuyển công việc",
        job: job
    });
};

module.exports.checkApplied = async (req, res, next) => {
    const application = await Application.findOne({
        jobId: req.params.jobId,
        userId: res.locals.user.id,
        hiddenByUser: {
            $ne: true
        }
    });

    if (application) {
        req.flash("error", "Bạn đã ứng tuyển công việc này rồi!");
        return res.redirect(req.get("Referrer") || "/applications");
    }

    next();
};

// [POST] /applications/add/:jobId
module.exports.addPost = async (req, res) => {
    try {
        const application = await Application.findOne({
            jobId: req.params.jobId,
            userId: res.locals.user.id
        });

        if (application) {
            if (!application.hiddenByUser) {
                req.flash("error", "Bạn đã ứng tuyển công việc này rồi!");
                return res.redirect(req.get("Referrer") || "/applications");
            }

            await Application.updateOne({
                _id: application._id
            }, {
                cvUrl: req.body.cvUrl,
                coverLetter: req.body.coverLetter,
                status: "pending",
                hiddenByUser: false
            });

            req.flash("success", "Ứng tuyển thành công!");
            return res.redirect("/applications");
        }

        const newApplication = new Application({
            jobId: req.params.jobId,
            userId: res.locals.user.id,
            cvUrl: req.body.cvUrl,
            coverLetter: req.body.coverLetter
        });

        await newApplication.save();
        req.flash("success", "Ứng tuyển thành công!");
        res.redirect("/applications");
    } catch (error) {
        console.log(error);
        req.flash("error", "Có lỗi xảy ra khi ứng tuyển công việc!");
        res.redirect("/applications");
    }
};

// [GET] /applications/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        await Application.updateOne({
            _id: req.params.id,
            userId: res.locals.user.id
        }, {
            hiddenByUser: true
        });

        req.flash("success", "Da xoa ho so khoi danh sach da ung tuyen!");
        res.redirect(req.get("Referrer") || "/applications");
    } catch (error) {
        console.error(error);
        req.flash("error", "Co loi xay ra khi xoa ho so ung tuyen!");
        res.redirect(req.get("Referrer") || "/applications");
    }
};
