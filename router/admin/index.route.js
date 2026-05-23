const dashboardRouter = require("./dashboard.route");
const jobRouter = require("./job.route");
const loginRouter = require("./auth.route");
const accountRouter = require("./account.route");
const authRouter = require("./auth.route");
const jobCategoryRouter = require("./job-category.route");
const roleRouter = require("./role.route");
const userApprovalRouter = require("./user-approval.route");
const clientUserRouter = require("./client-user.route");
const myAccountRouter = require("./my-account.route");
const companyRouter = require("./company.route");
const systemConfig = require("../../config/system");
const Auth = require("../../middlewares/admin/auth.middleware");
module.exports = (app) => {
    app.use(`${systemConfig.prefixAdmin}/dashboard`,Auth.requireAuth, dashboardRouter);
    app.use(`${systemConfig.prefixAdmin}/job`,Auth.requireAuth, jobRouter);
    app.use(`${systemConfig.prefixAdmin}/account`,Auth.requireAuth, accountRouter);
    app.use(`${systemConfig.prefixAdmin}/auth`, authRouter);
    app.use(`${systemConfig.prefixAdmin}/job-category`,Auth.requireAuth, jobCategoryRouter);
    app.use(`${systemConfig.prefixAdmin}/roles`,Auth.requireAuth, roleRouter);
    app.use(`${systemConfig.prefixAdmin}/my-account`,Auth.requireAuth, myAccountRouter);
    app.use(`${systemConfig.prefixAdmin}/user-approval`,Auth.requireAuth, userApprovalRouter);
    app.use(`${systemConfig.prefixAdmin}/client-user`,Auth.requireAuth, clientUserRouter);
    app.use(`${systemConfig.prefixAdmin}/company`,Auth.requireAuth, companyRouter);
}
