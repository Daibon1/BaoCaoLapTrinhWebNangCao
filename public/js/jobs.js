// form search
const formSearch = document.querySelector("#form-search-jobs");
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
            url.searchParams.delete("page");
        } else {
            url.searchParams.delete("keyword");
            url.searchParams.delete("page");
        }
        window.location.href = url.href;
    })
}
// end form search
// form filter
const formFilter = document.querySelector("#form-filter-jobs");
if (formFilter) {
    formFilter.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        const location = e.target.elements.location.value;
        const type = e.target.elements.type.value;
        if (location) {
            url.searchParams.set("location", location);
            url.searchParams.delete("page");
        } else {
            url.searchParams.delete("location");
        }
        if (type) {
            url.searchParams.set("type", type);
            url.searchParams.delete("page");
        } else {
            url.searchParams.delete("type");
        }
        window.location.href = url.href;
    })
    formFilter.addEventListener("reset", (e) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.delete("location");
        url.searchParams.delete("type");
        window.location.href = url.href;
    })
}
// sort
const sort = document.querySelector("[sort]");
if (sort) {
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    const url = new URL(window.location.href);
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");
        if (sortKey && sortValue) {
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
            url.searchParams.delete("page");
            window.location.href = url.href;
        }
    });
    sortClear.addEventListener("click", (e) => {
        url.searchParams.delete("page");
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    })
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    console.log(sortKey, sortValue);
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value="${stringSort}"]`);
        if (optionSelected) {
            optionSelected.selected = true;
        }
    }
}
// end sort
// pagination
const pagination = document.querySelectorAll(".btn-pagination")
// console.log(pagination)
if (pagination.length > 0) {
    let url = new URL(window.location.href);
    pagination.forEach(item => {
        item.addEventListener("click", () => {
            const page = item.value;
            if (page) {
                url.searchParams.set("page", page);
            } else {
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        })
    })
}
//end pagination