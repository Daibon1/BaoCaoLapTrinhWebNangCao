//change status
const changeStatus = document.querySelectorAll("[change-status]");
if (changeStatus.length > 0) {
    changeStatus.forEach(button => {
        button.addEventListener("click", () => {
            let status = button.getAttribute("data-status");
            let id = button.getAttribute("data-id")
            let changeStatus = status == "active" ? "inactive" : "active";
            const formChangeStatus = document.querySelector("#form-change-status")
            formChangeStatus.action = `${formChangeStatus.getAttribute("path")}/${changeStatus}/${id}?_method=PATCH`;
            formChangeStatus.submit();
        })
    })
}
// end change status
// delete 
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xoá không?");
            if (isConfirm) {
                let id = button.getAttribute("data-id");
                let path = formDeleteItem.getAttribute("path");
                formDeleteItem.action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.submit();
            }
        })
    })
}
// end delete
// input skill
const skillInput = document.getElementById("skillInput");
const errorBox = document.getElementById("skillError");

const MAX_SKILLS = 5;
const MAX_LENGTH = 20;

skillInput.addEventListener("input", () => {

  let skills = skillInput.value
    .split(",")
    .map(s => s.trim())
    .filter(s => s !== "");

  //quá số lượng
  if (skills.length > MAX_SKILLS) {
    errorBox.textContent = "Chỉ được tối đa 5 kỹ năng";
    skillInput.classList.add("is-invalid");
    return;
  }

  //  skill quá dài
  for (let skill of skills) {
    if (skill.length > MAX_LENGTH) {
      errorBox.textContent = "Mỗi kỹ năng tối đa 20 ký tự";
      skillInput.classList.add("is-invalid");
      return;
    }
  }

  // ký tự lạ
  const regex = /^[a-zA-Z0-9+#.\-\s]+$/;
  for (let skill of skills) {
    if (!regex.test(skill)) {
      errorBox.textContent = "Skill chứa ký tự không hợp lệ";
      skillInput.classList.add("is-invalid");
      return;
    }
  }

  //  hợp lệ
  errorBox.textContent = "";
  skillInput.classList.remove("is-invalid");
});