// button status
const buttonStatus = document.querySelectorAll("[button-status]");
// console.log(buttonStatus);
buttonStatus.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const status = item.getAttribute("button-status");
        // console.log(window.location.href);
        // console.log(status);
        let url = new URL(window.location.href);
        if (status) {
            url.searchParams.set("status", status);
            url.searchParams.set("page", 1);
        } else {
            url.searchParams.delete("status");
            url.searchParams.set("page", 1);
        }
        window.location.href = url.href;
        // console.log(url.href);
    })
})
// end button status
// form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        let url = new URL(window.location.href);
        e.preventDefault();
        const keyword = e.target.elements.keyword ? e.target.elements.keyword.value : "";
        const location = e.target.elements.location ? e.target.elements.location.value : "";
        if (keyword) {
            url.searchParams.set("keyword", keyword);
            url.searchParams.set("page", 1);
        } else {
            url.searchParams.delete("keyword");
            url.searchParams.set("page", 1);
        }
        if (location) {
            url.searchParams.set("location", location);
            url.searchParams.set("page", 1);
        } else {
            url.searchParams.delete("location");
            url.searchParams.set("page", 1);
        }
        // console.log(url.href);
        window.location.href = url.href;
    })
}

// end form search
// pagination
const pagination = document.querySelectorAll(".btn-pagination")
// console.log(pagination)
if (pagination.length > 0) {
    pagination.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            let url = new URL(window.location.href);
            const page = item.value || item.getAttribute("data-page");
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
// const sidebars = document.querySelectorAll(".sidebar-item");
// sidebars.forEach(item=>{
//     item.addEventListener("click",()=>{
//         item.classList.add("active");
//     })
// })
// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
// console.log(checkboxMulti);
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkbox-all']");
    const inputCheckId = checkboxMulti.querySelectorAll("input[name='id']");
    // console.log(inputCheckAll);
    // console.log(inputCheckId);
    if (inputCheckAll) {
        inputCheckAll.addEventListener("click", () => {
            if (inputCheckAll.checked) {
                inputCheckId.forEach(item => {
                    item.checked = true;
                })
            } else {
                inputCheckId.forEach(item => {
                    item.checked = false;
                })
            }
        })
    }
    if (inputCheckId.length > 0) {
        inputCheckId.forEach(item => {
            item.addEventListener("click", () => {
                let countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
                if (countChecked === inputCheckId.length) {
                    inputCheckAll.checked = true;
                } else {
                    inputCheckAll.checked = false;
                }
            })
        })
    }
}
// end checkbox multi
// form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
// console.log(formChangeMulti);
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        const typeChange = formChangeMulti.querySelector("select[name='type']").value;
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa tất cả mục đã chọn không?");
            if (!isConfirm) {
                return;
            }
        }
        if (inputChecked.length > 0) {
            let ids = [];
            inputChecked.forEach(item => {
                if (typeChange == "change-position") {
                    const position = item.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${item.value}-${position}`);
                } else ids.push(item.value);
            })
            // console.log(ids);
            e.target.elements.ids.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một mục để thực hiện hành động.");
        }
    })
}
// end form change multi
// show alert
const showAlert=document.querySelector("[show-alert]");
if(showAlert){
    const time=parseInt(showAlert.getAttribute("data-time"));
    console.log(time);
    const closeAlert=showAlert.querySelector("[close-alert]");
    setTimeout(()=>{
        showAlert.classList.add("alert-hiden");
    }, time);
    if(closeAlert){
        closeAlert.addEventListener("click",()=>{
            showAlert.classList.add("alert-hiden");
        })
    // console.log(showAlert);
    }
}
// end show alert
// preview
const preview = document.querySelector("#preview-img");
if (preview) {
    const inputFile = preview.querySelector("#file-input");
    const imgPreview = preview.querySelector("#img-preview");
    inputFile.addEventListener("change", (e) => {
        const src = URL.createObjectURL(e.target.files[0]);
        imgPreview.src = src;
    })
}
// end preview
// showw password
const togglePassword = document.querySelector('#toggle-password');
const passwordInput = document.querySelector('#password-input');
const eyeIcon = document.querySelector('#eye-icon');

if (togglePassword && passwordInput && eyeIcon) {
    togglePassword.addEventListener('click', function () {
        // Chuyển đổi kiểu input
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Thay đổi biểu tượng con mắt
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });
}
// sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");
        console.log(sortKey, sortValue);
        if (sortKey && sortValue) {
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);
        }
        window.location.href = url.href;
    });
    sortClear.addEventListener("click", (e) => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    })
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value="${stringSort}"]`);
        if (optionSelected) {
            optionSelected.selected = true;
        }
    }
}

// end sort
const modal = document.querySelector(".div-cover-modal");
const modalText = document.querySelector(".div-cover-modal__text");
const overlay = document.querySelector(".div-cover-modal__overlay");
const closeBtn = document.querySelector(".div-cover-modal__close");

if (modal && modalText && overlay && closeBtn) {
    document.querySelectorAll(".cover-preview").forEach(el => {
        el.onclick = () => {
            modal.classList.add("active");
            modalText.textContent = el.dataset.text;
        };
    });

    overlay.onclick = closeBtn.onclick = () => {
        modal.classList.remove("active");
    };
}
