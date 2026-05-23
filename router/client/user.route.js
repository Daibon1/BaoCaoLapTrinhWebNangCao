const validate = require("../../validates/client/user.validate");
const express = require("express");
const multer = require('multer')
const router = express.Router();
const Controller = require("../../controller/client/user.controller")
const authMiddleware = require("../../middlewares/client/auth.middleware");
const uploadCloud = require("../../middlewares/client/uploadCloudUser.middleware");
const upload = require("multer")();
const passport = require("passport");
router.get("/register", Controller.register);
router.post("/register", validate.registerPost, Controller.registerPost);
router.get("/login", Controller.login);
router.post("/login", validate.loginPost, Controller.loginPost);

// Login Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// Google redirect về đây
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/login",
    session: false,
  }),
  Controller.googleCallback
);

// Login Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/user/login",
    session: false,
  }),
  Controller.facebookCallback
);
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     failureRedirect: "/auth/login",
//   }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );


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