const express =require("express");
const router = express.Router();
const Controller = require("../../controller/admin/role.controller");
router.get("/",Controller.index);
// [GET] /admin/roles/create
router.get("/create",Controller.create);
//[POST] /admin/roles/create
router.post("/create",Controller.createPost);
//[GET] /admin/roles/edit/:id
router.get("/edit/:id",Controller.edit);
//[PATCH] /admin/roles/edit/:id
router.patch("/edit/:id",Controller.editPatch);
//[GET] /admin/roles/detail/:id
router.get("/detail/:id",Controller.detail);
//[DELETE] /admin/roles/delete/:id
router.delete("/delete/:id",Controller.delete);
//[GET] /admin/roles/permissions
router.get("/permissions",Controller.permissions);
// [PATCH] /admin/roles/permissions
router.patch("/permissions",Controller.permissionsPatch);
module.exports = router;
