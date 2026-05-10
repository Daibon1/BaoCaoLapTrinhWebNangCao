const express=require("express");
const router=express.Router();
const savedJobController=require("../../controller/client/saved-job.controller")
router.post("/add/:jobId",savedJobController.savedJob);
router.get("/",savedJobController.index);
module.exports=router;