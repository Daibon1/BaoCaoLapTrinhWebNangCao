const saveJobMiddleware = require("../../middlewares/client/savejob.middleware");
const homeRouter = require("./home.route");
const jobRouter = require("./job.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const searchRouter = require("./search.route");
const savedJobRouter = require("./saved-job.route");
const userRouter = require("./user.route")
const userMiddleware = require("../../middlewares/client/user.middleware");
const applicationRouter = require("./application.route");
const authMiddleware = require("../../middlewares/client/auth.middleware");
module.exports = (app) => {
    app.use(saveJobMiddleware.saveJob);
    app.use(categoryMiddleware.category);
    app.use(userMiddleware.userInfo);
    app.use("/", homeRouter);
    app.use("/jobs", jobRouter);
    app.use("/search", searchRouter);
    app.use("/saved-jobs", savedJobRouter);
    app.use("/user", userRouter);
    app.use("/applications",applicationRouter);
}