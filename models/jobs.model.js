const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    category: String,
    thumbnail: String,
    salaryMin: Number,
    skill: {
        type: [String],
        default: []
    },
    salaryMax: Number,
    featured: String,
    type: String,
    experience: String,
    status: {
        type: String,
        enum: ["pending", "active", "inactive"],
        default: "pending"
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    createdBy: {
        account_id: String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deleteAt: Date
    },
    company_id: {
        type: String,
        ref: "Company"
    },
    position: Number,
    updatedBy: [{
        account_id: String,
        updatedAt: Date
    }]
}, {
    timestamps: true
});


const Job = mongoose.model('Job', jobSchema, "jobs");
module.exports = Job;
