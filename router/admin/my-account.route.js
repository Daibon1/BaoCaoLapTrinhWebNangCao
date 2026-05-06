const Controller = require("../../controller/admin/my-account.controller");
const express = require("express");
const router = express.Router();
const multer = require('multer')
const upload = multer();
const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", Controller.index);
router.get("/edit", Controller.edit);
router.patch("/edit",
    upload.single('avatar'),
    uploadCloud.upload,
    Controller.editPatch);
module.exports = router;