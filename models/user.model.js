const mongoose = require("mongoose");
const gennerate = require("../helpers/generate");
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser:{
        type: String,
        default: () => gennerate.generateRandomString(20)
    },
    googleId: String,
    facebookId: String,

    phone:String,
    avatar:String,
    status:{
        type:String,
        default:"active"
    },
    cvFile:String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
const User = mongoose.model("User", userSchema, "users");
module.exports = User;
