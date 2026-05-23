const Application = require("../../models/application.model");
const User = require("../../models/user.model");
const Job = require("../../models/jobs.model");
const sendMailHelper = require("../../helpers/sendMail");
const paginationHelper = require("../../helpers/pagination.js");

const statusMailContent = {
    interview: {
        subject: "Thong bao lich phong van",
        title: "Ho so cua ban da duoc chon phong van",
        message: "Nha tuyen dung da chuyen ho so cua ban sang vong phong van. Vui long theo doi email hoac lien he tu nha tuyen dung de biet them chi tiet."
    },
    accepted: {
        subject: "Ho so ung tuyen duoc chap nhan",
        title: "Chuc mung, ho so cua ban da duoc chap nhan",
        message: "Nha tuyen dung da chap nhan ho so ung tuyen cua ban. Vui long theo doi cac thong tin tiep theo tu nha tuyen dung."
    },
    rejected: {
        subject: "Cap nhat ket qua ung tuyen",
        title: "Ho so ung tuyen chua phu hop",
        message: "Cam on ban da ung tuyen. Hien tai ho so cua ban chua phu hop voi vi tri nay. Chuc ban som tim duoc co hoi phu hop hon."
    }
};

const escapeHtml = (text = "") => {
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const sendStatusMail = async (application, status) => {
    const mailContent = statusMailContent[status];
    if (!mailContent || !application.userId || !application.userId.email) {
        return;
    }

    const candidateName = application.userId.fullName || "Ung vien";
    const jobTitle = application.jobId ? application.jobId.title : "Cong viec da ung tuyen";
    const html = `
        <p>Xin chao <b>${escapeHtml(candidateName)}</b>,</p>
        <p><b>${escapeHtml(mailContent.title)}</b></p>
        <p>Vi tri: <b>${escapeHtml(jobTitle)}</b></p>
        <p>${escapeHtml(mailContent.message)}</p>
        <p>Tran trong.</p>
    `;

    sendMailHelper.sendMail(application.userId.email, mailContent.subject, html);
};

// [GET] /admin/user-approval
module.exports.index = async (req, res) => {
    const jobs = await Job.find({
        "createdBy.account_id": res.locals.user._id
    }).select("_id title")
    const jobIds = jobs.map(job => job._id);

    const baseFilter = {
        jobId: {
            $in: jobIds
        }
    }

    const selectedJobId = req.query.jobId || "";
    const selectedStatus = req.query.status || "";
    const keyword = req.query.keyword ? req.query.keyword.trim() : "";

    if (selectedJobId) {
        baseFilter.jobId = selectedJobId;
    }

    if (keyword) {
        const keywordRegex = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const users = await User.find({
            $or: [
                { fullName: new RegExp(keywordRegex, "i") },
                { email: new RegExp(keywordRegex, "i") }
            ]
        }).select("_id");
        baseFilter.userId = {
            $in: users.map(user => user._id)
        }
    }

    const filter = { ...baseFilter };
    if (selectedStatus) {
        filter.status = selectedStatus;
    }

    const countApplications = await Application.countDocuments(filter);
    const objectPagination = paginationHelper({
        limitItem: 6,
        skipItem: 0,
        page: 1
    }, req.query, countApplications);

    const [applications, totalApplications, pendingApplications, acceptedApplications] = await Promise.all([
        Application.find(filter)
            .sort({ createdAt: "desc" })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skipItem)
            .populate("jobId")
            .populate("userId"),
        Application.countDocuments(baseFilter),
        Application.countDocuments({ ...baseFilter, status: "pending" }),
        Application.countDocuments({ ...baseFilter, status: "accepted" })
    ]);
    // console.log(applications);
    res.render("admin/pages/user-approval/index", {
        pagetitle: "Duyệt ứng tuyển",
        currentUrl: req.originalUrl,
        applications: applications,
        jobs: jobs,
        selectedJobId: selectedJobId,
        selectedStatus: selectedStatus,
        keyword: keyword,
        pagination: objectPagination,
        countApplications: countApplications,
        totalApplications: totalApplications,
        pendingApplications: pendingApplications,
        acceptedApplications: acceptedApplications
    })
}
// [PATCH] /admin/user-approval/change-status/:id
module.exports.changeStatus = async (req, res) => {
    if (res.locals.role.permissions.includes("user-approval-edit")) {
        const id = req.params.id;
        const status = req.body.status;
        try {
            const application = await Application.findOne({
                _id: id
            }).populate("userId").populate("jobId");

            if (!application) {
                req.flash('error', 'Khong tim thay ho so ung tuyen!');
                return res.redirect(req.get("Referrer") || `/admin/user-approval`);
            }

            const oldStatus = application.status;
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
            if (oldStatus !== status) {
                await sendStatusMail(application, status);
            }
            req.flash('success', 'Cập nhật trạng thái thành công!');
            res.redirect(req.get("Referrer") || `/admin/user-approval`);
        } catch (error) {
            console.error(error);
            req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái!');
            res.redirect(req.get("Referrer") || `/admin/user-approval`);
        }
    } else {
        req.flash('error', 'Bạn không có quyền truy cập');
        res.redirect(`/admin/user-approval`);
    }
}
