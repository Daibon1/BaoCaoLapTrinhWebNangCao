const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: "name",
        unique: true
    },

    logo: String,

    email: String,

    phone: String,

    website: String,

    address: String,

    description: String,
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        enum: ["1-10", "10-50", "50-100", "100-500", "500+"]
    },

    createdBy: {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account"
        }
    }

}, {
    timestamps: true
});
const Company = mongoose.model('Company', companySchema, "companies");
module.exports = Company;