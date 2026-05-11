const validate = require("../../validates/client/user.validate");
const express = require("express");
const multer = require('multer')
const router = express.Router();
const Controller = require("../../controller/client/user.controller")
const authMiddleware = require("../../middlewares/client/auth.middleware");
const uploadCloud = require("../../middlewares/client/uploadCloudUser.middleware");
const upload = require("multer")();
router.get("/register", Controller.register);
router.post("/register", validate.registerPost, Controller.registerPost);
router.get("/login", Controller.login);
router.post("/login", validate.loginPost, Controller.loginPost);
router.get("/logout", Controller.logout);
router.get("/password/forgot", Controller.forgotPassword);
router.post("/password/forgot", Controller.forgotPasswordPost);
router.get("/password/otp", Controller.otpPassword);
router.post("/password/otp", validate.otpPasswordPost, Controller.otpPasswordPost);
router.get("/password/reset", Controller.resetPassword);
router.post("/password/reset", validate.resetPasswordPost, Controller.resetPasswordPost);
router.get("/info", authMiddleware.requireAuth, Controller.info);
router.get("/info/edit", authMiddleware.requireAuth, Controller.edit);
router.patch("/info/edit",
    upload.any(),
    uploadCloud.upload,
    authMiddleware.requireAuth,
    Controller.editPatch);
module.exports = router;