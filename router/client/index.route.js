const homeRouter = require("./home.route");
const jobRouter=require("./job.route");
const categoryMiddleware=require("../../middlewares/client/category.middleware");
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use("/", homeRouter);
    app.use("/jobs",jobRouter);
}