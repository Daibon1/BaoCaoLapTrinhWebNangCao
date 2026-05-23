const Controller=require("../../controller/admin/account.controller");
const validate = require("../../validates/admin/account.validate")
const express=require("express");
const router=express.Router();
// const storageMulter = require("../../helpers/storageMulter");
const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware");
const multer = require('multer')
const upload = multer();
router.get("/",Controller.index);
router.patch("/change-status/:status/:id", Controller.changeStatus);
router.delete("/delete/:id", Controller.deleteItem);
router.get("/create",Controller.create);
router.post("/create",
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost,
    Controller.createPost);
router.get("/edit/:id",Controller.edit);
router.patch("/edit/:id",
    upload.single('avatar'),
    uploadCloud.upload,
    validate.editPatch,
    Controller.editPatch);
module.exports=router;
