module.exports = (query) => {
    let filterStatus = [{
            name: "Tất Cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt Động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng Hoạt Động",
            status: "inactive",
            class: ""
        }
    ]
    const index = filterStatus.findIndex(item => item.status == query.status);

    if (index >= 0) {
        filterStatus[index].class = "btn-success";
    } else {
        filterStatus[0].class = "btn-success";
    }

    return filterStatus;
}
