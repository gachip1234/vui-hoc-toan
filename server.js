// 1. Gọi thư viện Express và Path vào dự án
const express = require("express");
const path = require("path");
const app = express();

// Cấu hình cổng chạy Server
const PORT = 3000;

// MẢNG TẠM THỜI ĐỂ LƯU TRỮ HỌC SINH
const danhSachHocSinh = [];

// 2. Cấu hình Middleware: Cho phép Server đọc dữ liệu dạng JSON và Form từ Client gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cấu hình thư mục tĩnh: Phục vụ các file HTML, CSS, JS trong dự án
app.use(express.static(__dirname));

// ==========================================
// 4. XỬ LÝ ĐƯỜNG DẪN GIAO DIỆN (ROUTING)
// ==========================================

// Khi học sinh vào trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Khi học sinh vào trang đăng ký
app.get("/auth.html", (req, res) => {
  res.sendFile(path.join(__dirname, "auth.html"));
});

// ==========================================
// 5. XỬ LÝ ĐƯỜNG ỐNG DỮ LIỆU (API ENDPOINTS)
// ==========================================

// API tiếp nhận yêu cầu đăng ký từ Front-End gửi lên
app.post("/api/register", (req, res) => {
  const { fullName, email, password } = req.body;

  console.log("👉 Server vừa nhận được yêu cầu đăng ký:");
  console.log(
    `- Họ tên: ${fullName}\n- Email: ${email}\n- Mật khẩu: ${password}`,
  );

  // Kiểm tra trùng lặp tài khoản dựa trên Email
  const taiKhoanDaTonTai = danhSachHocSinh.find(
    (hocSinh) => hocSinh.email === email,
  );

  if (taiKhoanDaTonTai) {
    return res.status(400).json({
      success: false,
      message: "Email này đã được đăng ký rồi em ơi! Thử dùng email khác nhé.",
    });
  }

  // Tạo Object học sinh mới và đẩy vào mảng
  const hocSinhMoi = {
    id: Date.now(),
    fullName,
    email,
    password,
  };
  danhSachHocSinh.push(hocSinhMoi);

  res.status(201).json({
    success: true,
    message: `Chúc mừng ${fullName} đã đăng ký tài khoản thành công! 🎉🚀`,
  });
});

// ==========================================
// 6. KHỞI ĐỘNG SERVER LẮNG NGHE YÊU CẦU
// ==========================================
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Động cơ Server đã nổ máy thành công!`);
  console.log(`📐 Học trực tuyến tại: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
