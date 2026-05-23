const formLogin=document.querySelector("#form-login");
if(formLogin){
    const inputs=formLogin.querySelectorAll("input");
    inputs.forEach((input, index) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Ngăn form submit khi Enter
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus(); // Chuyển sang input tiếp theo
        else document.getElementById('submitBtn').focus(); // Nếu cuối, nhảy nút gửi
      }
    });
  });
}

const togglePassword = document.querySelector("#toggle-password");
const passwordInput = document.querySelector("#password-input");
const eyeIcon = document.querySelector("#eye-icon");

if (togglePassword && passwordInput && eyeIcon) {
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    eyeIcon.classList.toggle("fa-eye");
    eyeIcon.classList.toggle("fa-eye-slash");
  });
}
