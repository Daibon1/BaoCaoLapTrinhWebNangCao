module.exports=(objectPagination,query,countJobs)=>{
    const page =parseInt(query.page);
    if(!isNaN(page) && page > 0){
        objectPagination.page = page;
    }
    objectPagination.totalPage = Math.ceil(countJobs / objectPagination.limitItem);
    if (objectPagination.totalPage < 1) {
        objectPagination.totalPage = 1;
    }
    if (objectPagination.page > objectPagination.totalPage) {
        objectPagination.page = objectPagination.totalPage;
    }
    // console.log(objectPagination.page);
    const skipItem = (objectPagination.page - 1) * objectPagination.limitItem;
    objectPagination.skipItem = skipItem;
    return objectPagination;
}
