const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    role_id: String,
    phone: String,
    status: String,
    avatar: String,
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});


const Account = mongoose.model('Account', accountSchema, "accounts");
module.exports = Account;