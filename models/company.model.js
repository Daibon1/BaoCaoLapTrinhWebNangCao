const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    logo: String,

    email: String,

    phone: String,

    website: String,

    address: String,

    description: String,

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