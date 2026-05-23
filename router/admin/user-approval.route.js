const express = require("express");
const router = express.Router();
const Controller = require("../../controller/admin/user-approval.controller");
router.get("/",Controller.index);
router.patch("/change-status/:id",Controller.changeStatus);
module.exports = router;
