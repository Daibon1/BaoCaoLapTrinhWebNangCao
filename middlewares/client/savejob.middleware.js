const mongoose = require("mongoose");
const SavedJob = require("../../models/saved-jobs.model");

module.exports.saveJob = async (req, res, next) => {

    let savedJobId = req.cookies.saveJobId;

    // nếu cookie không tồn tại hoặc sai ObjectId
    if (!savedJobId || !mongoose.Types.ObjectId.isValid(savedJobId)) {

        const newSavedJob = new SavedJob();
        await newSavedJob.save();

        const expiresCookie = 1000 * 60 * 60 * 24 * 365;

        res.cookie("saveJobId", newSavedJob.id, {
            expires: new Date(Date.now() + expiresCookie),
            httpOnly: true
        });

        res.locals.miniSavedJobs = newSavedJob;

    } else {

        const savedJob = await SavedJob.findById(savedJobId);

        // phòng trường hợp DB bị xoá record
        if (!savedJob) {
            res.clearCookie("saveJobId");
            return next();
        }

        savedJob.totalSavedJobs = savedJob.jobIds.length;
        res.locals.miniSavedJobs = savedJob;
    }

    next();
};