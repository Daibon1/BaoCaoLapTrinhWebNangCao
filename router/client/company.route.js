const express=require("express");
const router=express.Router();
const companyController=require("../../controller/client/company.controller");
router.get("/",companyController.index);
router.get("/detail/:slug",companyController.detail);
module.exports=router;