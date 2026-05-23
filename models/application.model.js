const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    cvUrl: {
        type: String,
        required: true
    },
    coverLetter: String,
    status: {
        type: String,
        enum: [
            "pending",
            "reviewing",
            "interview",
            "accepted",
            "rejected"
        ],
        default: "pending"
    },
    hiddenByUser: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});


// QUAN TRỌNG
applicationSchema.index({
    userId: 1,
    jobId: 1
}, {
    unique: true
});
const Application = mongoose.model("Application", applicationSchema, "applications");
module.exports = Application;
