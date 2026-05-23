const Controller = require("../../controller/admin/job-category.controller");
const express = require("express");
const router = express.Router();
const multer = require('multer')
const upload = multer();
const validate = require("../../validates/admin/job-category.validate.js")
const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware.js");
router.get("/", Controller.index);
router.patch("/change-status/:status/:id", Controller.changeStatus);
router.delete("/delete/:id", Controller.deleteItem);
router.get("/create",Controller.create);
router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    Controller.createPost);
router.get("/edit/:id", Controller.edit);
router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    Controller.editPatch);
router.get("/detail/:id", Controller.detail);

module.exports = router;
