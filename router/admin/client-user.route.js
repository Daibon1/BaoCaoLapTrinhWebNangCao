const Controller = require("../../controller/admin/client-user.controller");
const express = require("express");
const router = express.Router();

router.get("/", Controller.index);
router.patch("/change-status/:status/:id", Controller.changeStatus);
router.delete("/delete/:id", Controller.deleteItem);

module.exports = router;
