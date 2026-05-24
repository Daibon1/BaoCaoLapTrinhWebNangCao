
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
// toggle password visibility
const passwordToggles = document.querySelectorAll("[data-password-toggle]");
if (passwordToggles.length > 0) {
    passwordToggles.forEach((button) => {
        button.addEventListener("click", () => {
            const inputId = button.getAttribute("aria-controls");
            const input = inputId
                ? document.getElementById(inputId)
                : button.closest(".client-auth__input")?.querySelector("input");

            if (!input) return;

            const isHidden = input.type === "password";
            input.type = isHidden ? "text" : "password";
            button.setAttribute("aria-label", isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu");

            const icon = button.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-eye", !isHidden);
                icon.classList.toggle("fa-eye-slash", isHidden);
            }
        });
    });
}
// end toggle password visibility
// validate password confirmation
const confirmPasswordInputs = document.querySelectorAll("input[name='confirmPassword']");
if (confirmPasswordInputs.length > 0) {
    confirmPasswordInputs.forEach((confirmInput) => {
        const form = confirmInput.closest("form");
        const passwordInput = form?.querySelector("input[name='password']");
        if (!passwordInput) return;

        const validatePasswordMatch = () => {
            const isMismatch = confirmInput.value && passwordInput.value !== confirmInput.value;
            confirmInput.setCustomValidity(isMismatch ? "Mật khẩu xác nhận không khớp." : "");
        };

        passwordInput.addEventListener("input", validatePasswordMatch);
        confirmInput.addEventListener("input", validatePasswordMatch);
    });
}
// end validate password confirmation
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
