document.addEventListener("DOMContentLoaded", function () {
  // 3. TÍNH NĂNG TÌM KIẾM & LỌC THẺ LỚP HỌC (REAL-TIME FILTER)
  const searchInput = document.getElementById("classSearchInput");
  const cards = document.querySelectorAll(".card");

  if (searchInput) {
    searchInput.addEventListener("input", function (event) {
      // Lấy giá trị học sinh gõ vào, chuyển thành chữ thường (lowercase) và xóa khoảng trắng thừa
      const keyword = event.target.value.toLowerCase().trim();

      // Duyệt qua từng thẻ card lớp học
      cards.forEach(function (card) {
        // Lấy toàn bộ chữ bên trong tiêu đề và mô tả của card đó
        const titleText = card
          .querySelector(".card__title")
          .innerText.toLowerCase();
        const descText = card
          .querySelector(".card__desc")
          .innerText.toLowerCase();

        // Kiểm tra xem từ khóa học sinh gõ có nằm trong tiêu đề hoặc mô tả không
        if (titleText.includes(keyword) || descText.includes(keyword)) {
          // Nếu khớp: Hiển thị card ra (bố cục Flexbox như cũ)
          card.style.display = "block";
          // Thêm một chút hiệu ứng mượt mà khi hiện lại
          card.style.animation = "fadeIn 0.4s ease";
        } else {
          // Nếu không khớp: Ẩn biệt tăm card đó đi
          card.style.display = "none";
        }
      });
    });
  }
  // 1. TÍNH NĂNG CUỘN TRANG (SMOOTH SCROLL)
  const btnStart = document.querySelector(".btn--secondary");
  const classesSection = document.querySelector(".classes");

  if (btnStart && classesSection) {
    btnStart.addEventListener("click", function () {
      classesSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // 2. LOGIC ĐIỀU KHIỂN MODAL CHÀO MỪNG
  const modal = document.getElementById("welcomeModal");
  const modalMessage = document.getElementById("modalMessage");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const acceptModalBtn = document.getElementById("acceptModalBtn");
  const btnViewList = document.querySelectorAll(".card .btn--primary");

  // Hàm mở Modal
  function openModal(message) {
    modalMessage.innerHTML = message; // Chèn nội dung thông báo động
    modal.classList.add("modal--open"); // Thêm class để mở modal
  }

  // Hàm đóng Modal
  function closeModal() {
    modal.classList.remove("modal--open"); // Xóa class để ẩn modal
  }

  // Lắng nghe sự kiện click trên các nút "Vào Học" ở từng Card lớp
  btnViewList.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Ngăn hành vi nhảy trang mặc định

      // Lấy tên lớp từ thẻ card tương ứng
      const cardTitle = button
        .closest(".card")
        .querySelector(".card__title").innerText;

      // Tạo thông báo cá nhân hóa cực kỳ thân thiện
      const customMessage = `Chào mừng em đến với không gian tự học của <strong>${cardTitle}</strong>!<br>Kho bài giảng sinh động và thử thách trắc nghiệm đã sẵn sàng đón nhận em. Hãy cùng nhau bứt phá điểm số nhé! 🎉🎯`;

      // Kích hoạt mở Modal xịn sò
      openModal(customMessage);
    });
  });

  // Lắng nghe các sự kiện đóng Modal
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (acceptModalBtn) acceptModalBtn.addEventListener("click", closeModal);

  // Tiện ích: Học sinh click ra ngoài vùng hộp thoại (vào lớp phủ mờ) cũng tự đóng modal
  window.addEventListener("click", function (event) {
    if (event.target === document.querySelector(".modal__overlay")) {
      closeModal();
    }
  });
});
