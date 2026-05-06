const Category = require("../models/jobs-category.model");
module.exports.getSubCategory = async (parentId) => {
    const getSub = async (parentId) =>{
        const subs = await Category.find({
            parent_id: parentId,
            deleted: false,
            status: "active"
        });
        const allSub=[...subs];
        for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];
            const subSub = await getSub(sub.id);
            allSub.push(...subSub);
        }
        return allSub;  
    }
    return await getSub(parentId);
}