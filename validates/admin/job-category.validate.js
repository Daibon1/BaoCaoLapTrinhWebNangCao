module.exports.createPost = (req,res,next)=>{
    const title=req.body.title;
    if(!title){
        req.flash('error', 'Vui lòng nhập tiêu đề danh mục!');
        return res.redirect(req.get("Referrer") || `/${req.prefixAdmin}/job-category/create`);
    }
    next();
}