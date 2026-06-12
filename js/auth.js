document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const passwordConfirm = document.getElementById("passwordConfirm");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  function showError(input, message) {
    if (!input) return;
    const formGroup = input.parentElement;
    formGroup.classList.remove("valid");
    formGroup.classList.add("invalid");
    formGroup.querySelector(".auth-form__message").innerText = message;
  }

  function showSuccess(input) {
    if (!input) return;
    const formGroup = input.parentElement;
    formGroup.classList.remove("invalid");
    formGroup.classList.add("valid");
    formGroup.querySelector(".auth-form__message").innerText = "";
  }

  // --- LOGIC XỬ LÝ TRANG ĐĂNG KÝ ---
  if (registerForm) {
    function checkFullName() {
      if (fullName.value.trim() === "") {
        showError(fullName, "Em ơi, đừng để trống họ và tên nhé!");
        return false;
      }
      showSuccess(fullName);
      return true;
    }
    function checkEmail() {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (email.value.trim() === "") {
        showError(email, "Hãy nhập email để nhận bài tập em nhé!");
        return false;
      }
      if (!emailRegex.test(email.value.trim())) {
        showError(email, "Định dạng email chưa đúng rồi!");
        return false;
      }
      showSuccess(email);
      return true;
    }
    function checkPassword() {
      if (password.value.length < 6) {
        showError(password, "Mật khẩu phải có ít nhất 6 ký tự!");
        return false;
      }
      showSuccess(password);
      return true;
    }
    function checkPasswordConfirm() {
      if (
        passwordConfirm.value !== password.value ||
        passwordConfirm.value === ""
      ) {
        showError(passwordConfirm, "Mật khẩu nhập lại chưa khớp rồi!");
        return false;
      }
      showSuccess(passwordConfirm);
      return true;
    }

    fullName.addEventListener("input", checkFullName);
    email.addEventListener("input", checkEmail);
    password.addEventListener("input", checkPassword);
    passwordConfirm.addEventListener("input", checkPasswordConfirm);

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (
        checkFullName() &&
        checkEmail() &&
        checkPassword() &&
        checkPasswordConfirm()
      ) {
        const formData = {
          fullName: fullName.value.trim(),
          email: email.value.trim(),
          password: password.value,
        };

        fetch("https://vuihoctoan-be.onrender.com/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert(data.message);
              registerForm.reset();
              window.location.href = "login.html"; // Đăng ký xong tự chuyển sang trang đăng nhập
            } else {
              showError(email, data.message);
            }
          });
      }
    });
  }

  // --- LOGIC XỬ LÝ TRANG ĐĂNG NHẬP ---
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailValue = loginEmail.value.trim();
      const passwordValue = loginPassword.value;

      if (emailValue === "") {
        showError(loginEmail, "Em quên điền Email đăng nhập rồi nè!");
        return;
      }
      if (passwordValue === "") {
        showError(loginPassword, "Mật khẩu không được để trống em ơi!");
        return;
      }

      const loginData = { email: emailValue, password: passwordValue };

      fetch("https://vuihoctoan-be.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert(data.message);
            localStorage.setItem("hocSinhName", data.fullName);
            window.location.href = "index.html"; // Đăng nhập xong về trang chủ
          } else {
            if (data.message.includes("Email")) {
              showError(loginEmail, data.message);
            } else {
              showError(loginPassword, data.message);
            }
          }
        })
        .catch((err) => alert("Có lỗi đường truyền đăng nhập rồi!"));
    });
  }
});
