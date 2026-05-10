const express=require("express");
const router=express.Router();
const uploadCloud=require("../../middlewares/client/uploadCloud.middleware");
const Controller=require("../../controller/client/application.controller");
const authMiddleware=require("../../middlewares/client/auth.middleware");

const multer = require('multer')
const upload = multer();
router.get("/",Controller.index);
router.get("/add/:jobId",authMiddleware.requireAuth,Controller.add);
router.post("/add/:jobId",
    upload.single('cvUrl'),
    uploadCloud.upload,
    authMiddleware.requireAuth,
    Controller.addPost
);
module.exports=router;