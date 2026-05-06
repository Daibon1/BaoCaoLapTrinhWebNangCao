const express=require("express");
const router=express.Router();
const jobController=require("../../controller/client/job.controller");
router.get("/",jobController.index);
router.get("/:slugCategory",jobController.category);
router.get("/detail/:slugJob",jobController.detail);
module.exports=router;