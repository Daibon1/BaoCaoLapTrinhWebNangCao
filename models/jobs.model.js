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
    salaryMax: Number,
    featured: String,
    type: String,
    experience: String,
    status: String,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    createdBy:{
        account_id:String,
        createAt:{
            type:Date,
            default:Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy:{
        account_id:String,
        deleteAt:Date
    },
    position: Number,
    updatedBy:[
        {
            account_id:String,
            updatedAt: Date
        }
    ]
}, {
    timestamps: true
});


const Job = mongoose.model('Job', jobSchema, "jobs");
module.exports = Job;