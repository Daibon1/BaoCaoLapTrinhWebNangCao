(() => {
  // Change job status from listing pages.
  document.addEventListener("click", (e) => {
    const button = e.target.closest("[change-status]");

    if (!button) {
      return;
    }

    e.preventDefault();

    const status = button.getAttribute("data-status");
    const id = button.getAttribute("data-id");
    const nextStatus = status == "active" ? "inactive" : "active";
    const formChangeStatus = document.querySelector("#form-change-status");

    if (formChangeStatus) {
      formChangeStatus.action = `${formChangeStatus.getAttribute("path")}/${nextStatus}/${id}?_method=PATCH`;
      formChangeStatus.submit();
    }
  });

  // Soft delete jobs and job categories from listing pages that load job.js.
  const deleteButtons = document.querySelectorAll("[button-delete]");

  if (deleteButtons.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");

    deleteButtons.forEach(button => {
      button.addEventListener("click", () => {
        const isConfirm = confirm("Bạn có chắc muốn xóa không?");

        if (isConfirm && formDeleteItem) {
          const id = button.getAttribute("data-id");
          const path = formDeleteItem.getAttribute("path");
          formDeleteItem.action = `${path}/${id}?_method=DELETE`;
          formDeleteItem.submit();
        }
      });
    });
  }

  // Validate skill input on job create/edit forms.
  const skillInput = document.getElementById("skillInput");
  const errorBox = document.getElementById("skillError");
  const maxSkills = 5;
  const maxLength = 20;

  if (skillInput && errorBox) {
    skillInput.addEventListener("input", () => {
      const skills = skillInput.value
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);

      if (skills.length > maxSkills) {
        errorBox.textContent = "Chỉ được tối đa 5 kỹ năng";
        skillInput.classList.add("is-invalid");
        return;
      }

      for (const skill of skills) {
        if (skill.length > maxLength) {
          errorBox.textContent = "Mỗi kỹ năng tối đa 20 ký tự";
          skillInput.classList.add("is-invalid");
          return;
        }
      }

      const regex = /^[a-zA-Z0-9+#.\-\s]+$/;
      for (const skill of skills) {
        if (!regex.test(skill)) {
          errorBox.textContent = "Skill chứa ký tự không hợp lệ";
          skillInput.classList.add("is-invalid");
          return;
        }
      }

      errorBox.textContent = "";
      skillInput.classList.remove("is-invalid");
    });
  }
})();
