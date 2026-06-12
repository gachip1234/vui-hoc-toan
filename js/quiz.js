document.addEventListener("DOMContentLoaded", function () {
  const quizForm = document.getElementById("quizForm");

  if (quizForm) {
    quizForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // 1. Kiểm tra xem học sinh đã đăng nhập chưa
      // Vì chúng ta lưu bằng email làm định danh duy nhất ở server, nhưng auth.js đang lưu hocSinhName ở localStorage.
      // Để chuẩn chỉnh, chúng ta cần biết chính xác là ai.
      // Tạm thời để đơn giản, ta lấy tên học sinh để server dò tìm, hoặc check xem có đăng nhập không.
      const tenHocSinh = localStorage.getItem("hocSinhName");
      if (!tenHocSinh) {
        alert("Em phải đăng nhập thì hệ thống mới lưu được điểm nhé!");
        window.location.href = "auth.html";
        return;
      }

      // 2. Tính điểm bài làm (Mỗi câu đúng được 5 điểm)
      let diemsoduoc = 0;

      const q1Selected = document.querySelector('input[name="q1"]:checked');
      const q2Selected = document.querySelector('input[name="q2"]:checked');

      if (!q1Selected || !q2Selected) {
        alert("Em ơi, làm hết các câu hỏi rồi mới nộp bài nhé!");
        return;
      }

      // Câu 1 đáp án đúng là B (x = 5)
      if (q1Selected.value === "B") diemsoduoc += 5;

      // Câu 2 đáp án đúng là A (12 cm2)
      if (q2Selected.value === "A") diemsoduoc += 5;

      // 3. Gửi điểm số lên Server qua Fetch API
      const baimay = {
        fullName: tenHocSinh,
        score: diemsoduoc,
      };

      fetch("https://vuihoctoan-be.onrender.com/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(baimay),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert(
              `Em đã hoàn thành bài tập! Số điểm của em là: ${diemsoduoc} điểm. 🎉\n${data.message}`,
            );
            window.location.href = "index.html"; // Làm xong cho về trang chủ
          } else {
            alert("Có lỗi xảy ra khi lưu điểm: " + data.message);
          }
        })
        .catch((err) => alert("Lỗi kết nối đường truyền nộp bài!"));
    });
  }
});
