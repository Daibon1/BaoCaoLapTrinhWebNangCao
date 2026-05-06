const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const jobCategorySchema = new mongoose.Schema({
    title: String,
    parent_id: String,
    thumbnail: String,
    description: String,
    status: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    position: Number,
    deleteAt: Date
}, {
    timestamps: true
});


const JobCategory = mongoose.model('JobCategory',jobCategorySchema, "jobs-category");
module.exports = JobCategory;