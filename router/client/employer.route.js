const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/employer.controller");
const validate = require("../../validates/client/employer.validate");

router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);

module.exports = router;
