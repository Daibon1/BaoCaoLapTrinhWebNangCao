(() => {
    // Toggle password visibility on create/edit account pages.
    const togglePassword = document.querySelector("#toggle-password");
    const passwordInput = document.querySelector("#password-input");
    const eyeIcon = document.querySelector("#eye-icon");

    if (togglePassword && passwordInput && eyeIcon) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);

            eyeIcon.classList.toggle("fa-eye");
            eyeIcon.classList.toggle("fa-eye-slash");
        });
    }

    // Preview avatar before upload.
    const preview = document.querySelector("#preview-img");
    if (preview) {
        const inputFile = preview.querySelector("#file-input");
        const imgPreview = preview.querySelector("#img-preview");

        if (inputFile && imgPreview) {
            inputFile.addEventListener("change", (e) => {
                const src = URL.createObjectURL(e.target.files[0]);
                imgPreview.src = src;
            });
        }
    }

    // Change account status from the listing page.
    const changeStatus = document.querySelectorAll("[change-status]");
    if (changeStatus.length > 0) {
        changeStatus.forEach(button => {
            button.addEventListener("click", () => {
                const status = button.getAttribute("data-status");
                const id = button.getAttribute("data-id");
                const newStatus = status == "active" ? "inactive" : "active";
                const formChangeStatus = document.querySelector("#form-change-status");

                if (formChangeStatus) {
                    formChangeStatus.action = `${formChangeStatus.getAttribute("path")}/${newStatus}/${id}?_method=PATCH`;
                    formChangeStatus.submit();
                }
            });
        });
    }

    // Soft delete account from the listing page.
    const buttonDelete = document.querySelectorAll("[button-delete]");
    if (buttonDelete.length > 0) {
        const formDeleteItem = document.querySelector("#form-delete-item");

        buttonDelete.forEach(button => {
            button.addEventListener("click", () => {
                const isConfirm = confirm("Bạn có chắc muốn xóa tài khoản này không?");

                if (isConfirm && formDeleteItem) {
                    const id = button.getAttribute("data-id");
                    const path = formDeleteItem.getAttribute("path");
                    formDeleteItem.action = `${path}/${id}?_method=DELETE`;
                    formDeleteItem.submit();
                }
            });
        });
    }
})();
