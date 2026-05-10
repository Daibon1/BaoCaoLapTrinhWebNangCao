const mongoose = require("mongoose");
const savedJobsSchema = new mongoose.Schema({
    userId: String,
    jobIds:[
        {
            type:String
        }
    ]
}, {
    timestamps: true
});
const SavedJob = mongoose.model("SavedJob", savedJobsSchema, "saved-jobs");
module.exports = SavedJob;