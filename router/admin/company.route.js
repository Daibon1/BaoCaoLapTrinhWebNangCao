const express = require("express");
const router = express.Router();
const multer = require('multer')
const Company = require("../../models/company.model");
const Account = require("../../models/account.model");
const Controller = require("../../controller/admin/company.controller");
const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
router.get("/create",Controller.create);
router.post("/create",
    upload.single('logo'),
    uploadCloud.upload,
    Controller.createPost);
module.exports = router;