document.addEventListener("DOMContentLoaded", function () {
  // Lấy các Form
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Lấy các nút chuyển đổi qua lại giữa 2 Form
  const switchToLogin = document.getElementById("switchToLogin");
  const switchToRegister = document.getElementById("switchToRegister");

  // Các ô nhập liệu Đăng Ký
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const passwordConfirm = document.getElementById("passwordConfirm");

  // Các ô nhập liệu Đăng Nhập
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  // --- CÁC HÀM HIỂN THỊ BÁO LỖI GIAO DIỆN ---
  function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.remove("valid");
    formGroup.classList.add("invalid");
    const errorSpan = formGroup.querySelector(".auth-form__message");
    errorSpan.innerText = message;
  }

  function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove("invalid");
    formGroup.classList.add("valid");
    const errorSpan = formGroup.querySelector(".auth-form__message");
    errorSpan.innerText = "";
  }

  // --- CƠ CHẾ BẤM CHUYỂN ĐỔI FORM QUA LẠI ---
  if (switchToLogin && switchToRegister) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      registerForm.style.display = "none";
      loginForm.style.display = "block";
    });

    switchToRegister.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.style.display = "none";
      registerForm.style.display = "block";
    });
  }

  // --- LOGIC KIỂM TRA ĐĂNG KÝ (VALIDATION) ---
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

  if (fullName) fullName.addEventListener("input", checkFullName);
  if (email) email.addEventListener("input", checkEmail);
  if (password) password.addEventListener("input", checkPassword);
  if (passwordConfirm)
    passwordConfirm.addEventListener("input", checkPasswordConfirm);

  // --- XỬ LÝ GỬI FORM ĐĂNG KÝ ---
  if (registerForm) {
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
        fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert(data.message);
              registerForm.reset();
              // Tự động lật sang form đăng nhập cho học sinh vào luôn
              switchToLogin.click();
            } else {
              showError(email, data.message);
            }
          });
      }
    });
  }

  // ==========================================
  // --- XỬ LÝ GỬI FORM ĐĂNG NHẬP (MỚI THÊM) ---
  // ==========================================
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailValue = loginEmail.value.trim();
      const passwordValue = loginPassword.value;

      // Kiểm tra nhanh xem có ô nào bỏ trống không
      if (emailValue === "") {
        showError(loginEmail, "Em quên điền Email đăng nhập rồi nè!");
        return;
      }
      if (passwordValue === "") {
        showError(loginPassword, "Mật khẩu không được để trống em ơi!");
        return;
      }

      const loginData = { email: emailValue, password: passwordValue };

      // BẮN DỮ LIỆU ĐĂNG NHẬP LÊN SERVER KHẢO SÁT DATABASE
      // BẮN DỮ LIỆU ĐĂNG NHẬP LÊN SERVER KHẢO SÁT DATABASE
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert(data.message);

            // CẬP NHẬT Ở ĐÂY: Lưu tên học sinh vào "két sắt" của trình duyệt
            localStorage.setItem("hocSinhName", data.fullName);

            // Cho học sinh quay trở về trang chủ index.html để vào học
            window.location.href = "index.html";
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
