module.exports = (query) => {
    let filterLocation = [{
            name: "",
            selected: ""
        },
        {
            name: "Hà Nội",
            selected: ""
        },
        {
            name: "TP.HCM",
            selected: ""
        },
        {
            name: "Đà Nẵng",
            selected: ""
        },
        {
            name: "Bắc Ninh",
            selected: ""
        },
        {
            name: "Hải Phòng",
            selected: ""
        }
    ]
    let filterType = [{
            name: "",
            selected: ""
        },
        {
            name: "Full-time",
            selected: ""
        },
        {
            name: "Part-time",
            selected: ""
        }
    ]
    let objectFind = {
        filterLocation: filterLocation,
        filterType: filterType,
        title: "",
        location: "",
        type:"",
        regex: ""
    }

    if (query.location) {
        const index = filterLocation.findIndex(item => item.name == query.location);
        if (index >= 0) {
            filterLocation[index]["selected"] = "selected";
        }
    }
    if (query.keyword) {
        objectFind.title = query.keyword;
        const regex = new RegExp(query.keyword, "i");
        objectFind.regex = regex;
    }
    if (query.location) {
        objectFind.location = query.location;
    }
    if (query.type) {
        const index = filterType.findIndex(item => item.name == query.type);
        if (index >= 0) {
            filterType[index]["selected"] = "selected";
        }
        objectFind.type = query.type;
    }
    return objectFind;
}
