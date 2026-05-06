const createTreeHelper = require("../../helpers/createTree.js");
const JobCategory = require("../../models/jobs-category.model.js");
module.exports.category = async (req, res, next) => {
    const find = {
        deleted: false,
        status: "active"
    };
    const records = await JobCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    res.locals.layoutProductsCategory = newRecords;
    next();
}