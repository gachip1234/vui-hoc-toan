document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const passwordConfirm = document.getElementById("passwordConfirm");

  // Hàm hiển thị lỗi (Trạng thái màu đỏ)
  function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.remove("valid");
    formGroup.classList.add("invalid");
    const errorSpan = formGroup.querySelector(".auth-form__message");
    errorSpan.innerText = message;
  }

  // Hàm hiển thị thành công (Trạng thái màu xanh lá)
  function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove("invalid");
    formGroup.classList.add("valid");
    const errorSpan = formGroup.querySelector(".auth-form__message");
    errorSpan.innerText = "";
  }

  // Các hàm kiểm tra logic nhập liệu
  function checkFullName() {
    if (fullName.value.trim() === "") {
      showError(fullName, "Em ơi, đừng để trống họ và tên nhé!");
      return false;
    } else {
      showSuccess(fullName);
      return true;
    }
  }

  function checkEmail() {
    const emailValue = email.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailValue === "") {
      showError(email, "Hãy nhập email để nhận bài tập em nhé!");
      return false;
    } else if (!emailRegex.test(emailValue)) {
      showError(email, "Định dạng email chưa đúng rồi (Ví dụ: toan@gmail.com)");
      return false;
    } else {
      showSuccess(email);
      return true;
    }
  }

  function checkPassword() {
    if (password.value.length < 6) {
      showError(password, "Mật khẩu phải có ít nhất 6 ký tự để bảo mật nhé!");
      return false;
    } else {
      showSuccess(password);
      return true;
    }
  }

  // Sửa lỗi so sánh mật khẩu nhạy bén
  function checkPasswordConfirm() {
    if (
      passwordConfirm.value !== password.value ||
      passwordConfirm.value === ""
    ) {
      showError(passwordConfirm, "Mật khẩu nhập lại chưa khớp rồi em ơi!");
      return false;
    } else {
      showSuccess(passwordConfirm);
      return true;
    }
  }

  // Lắng nghe sự kiện gõ phím theo thời gian thực
  if (fullName) fullName.addEventListener("input", checkFullName);
  if (email) email.addEventListener("input", checkEmail);
  if (password) password.addEventListener("input", checkPassword);
  if (passwordConfirm)
    passwordConfirm.addEventListener("input", checkPasswordConfirm);

  // Lắng nghe sự kiện bấm nút đăng ký
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const isFullNameValid = checkFullName();
      const isEmailValid = checkEmail();
      const isPasswordValid = checkPassword();
      const isPasswordConfirmValid = checkPasswordConfirm();

      if (
        isFullNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isPasswordConfirmValid
      ) {
        const formData = {
          fullName: fullName.value.trim(),
          email: email.value.trim(),
          password: password.value,
        };

        fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert(data.message);
              form.reset();
              document
                .querySelectorAll(".auth-form__group")
                .forEach((group) => {
                  group.classList.remove("valid");
                });
            } else {
              showError(email, data.message);
            }
          })
          .catch((error) => {
            console.error("Lỗi đường truyền:", error);
            alert(
              "Không thể kết nối tới máy chủ, em kiểm tra lại mạng xem sao nhé!",
            );
          });
      }
    });
  }
});
