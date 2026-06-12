// 1. Gọi các thư viện cần thiết
const express = require("express");
const path = require("path");
const fs = require("fs"); // Thư viện quản lý file của Node.js
const app = express();

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "database.json");

// 2. Cấu hình Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Các hàm trợ giúp Đọc/Ghi dữ liệu vào file JSON
function docDuLieuTuFile() {
  try {
    // Đọc file dưới dạng chữ (utf8)
    const rawData = fs.readFileSync(DATA_FILE, "utf8");
    // Chuyển chuỗi chữ thành mảng Object JavaScript
    return JSON.parse(rawData);
  } catch (error) {
    // Nếu file lỗi hoặc trống, trả về mảng rỗng
    return [];
  }
}

function ghiDuLieuVaoFile(data) {
  // Chuyển mảng Object thành chuỗi chữ dạng JSON chuẩn, thụt lề 2 khoảng trắng cho đẹp
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ==========================================
// 3. XỬ LÝ ĐƯỜNG DẪN GIAO DIỆN (ROUTING)
// ==========================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/auth.html", (req, res) => {
  res.sendFile(path.join(__dirname, "auth.html"));
});

// ==========================================
// 4. API ĐĂNG KÝ (NÂNG CẤP LƯU TRỮ VĨNH VIỄN)
// ==========================================
app.post("/api/register", (req, res) => {
  const { fullName, email, password } = req.body;

  // Bước A: Đọc danh sách học sinh hiện có từ file database.json ra
  const danhSachHocSinh = docDuLieuTuFile();

  // Bước B: Kiểm tra trùng lặp Email
  const taiKhoanDaTonTai = danhSachHocSinh.find(
    (hocSinh) => hocSinh.email === email,
  );

  if (taiKhoanDaTonTai) {
    return res.status(400).json({
      success: false,
      message: "Email này đã được đăng ký rồi em ơi! Thử dùng email khác nhé.",
    });
  }

  // Bước C: Tạo học sinh mới
  const hocSinhMoi = {
    id: Date.now(),
    fullName,
    email,
    password,
  };

  // Bước D: Đẩy học sinh mới vào mảng và GHI ĐÈ ngược lại vào file database.json
  danhSachHocSinh.push(hocSinhMoi);
  ghiDuLieuVaoFile(danhSachHocSinh);

  console.log(`✅ Đã lưu vĩnh viễn học sinh: ${fullName} vào database.json`);

  res.status(201).json({
    success: true,
    message: `Chúc mừng ${fullName} đã đăng ký tài khoản thành công! 🎉🚀`,
  });
});
// API xử lý đăng nhập tài khoản học sinh
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Bước A: Đọc dữ liệu vĩnh viễn từ file ra
  const danhSachHocSinh = docDuLieuTuFile();

  // Bước B: Tìm xem có học sinh nào khớp với email này không
  const hocSinh = danhSachHocSinh.find((user) => user.email === email);

  if (!hocSinh) {
    // Nếu không tìm thấy email trong hệ thống
    return res.status(400).json({
      success: false,
      message: "Email này chưa đăng ký thành viên em ơi!",
    });
  }

  // Bước C: Nếu có email, kiểm tra tiếp mật khẩu xem có khớp không
  if (hocSinh.password !== password) {
    // Nếu sai mật khẩu
    return res.status(400).json({
      success: false,
      message: "Sai mật khẩu rồi kìa, em kiểm tra lại nút Caps Lock xem nhé!",
    });
  }

  // Bước D: Đăng nhập hoàn toàn chính xác
  res.status(200).json({
    success: true,
    message: `Chào mừng ${hocSinh.fullName} quay trở lại lớp học toán! 🎉🎒`,
    fullName: hocSinh.fullName,
  });
});
// Thêm đường dẫn để khi gõ http://localhost:3000/quiz.html thì server trả về trang bài tập
app.get("/quiz.html", (req, res) => {
  res.sendFile(path.join(__dirname, "quiz.html"));
});

// API Tiếp nhận điểm số bài trắc nghiệm của học sinh
app.post("/api/submit-quiz", (req, res) => {
  const { fullName, score } = req.body;

  // Đọc database hiện tại ra
  const danhSachHocSinh = docDuLieuTuFile();

  // Tìm học sinh dựa trên tên (fullName) đang đăng nhập
  const hocSinh = danhSachHocSinh.find((user) => user.fullName === fullName);

  if (!hocSinh) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy tài khoản học sinh phù hợp!",
    });
  }

  // Cập nhật điểm số vào tài khoản (Nếu đã có điểm cũ thì cộng dồn hoặc ghi đè, ở đây ta ghi đè điểm mới nhất nhé)
  hocSinh.score = score;

  // Ghi đè ngược lại vào file database.json vĩnh viễn
  ghiDuLieuVaoFile(danhSachHocSinh);

  console.log(
    `🎯 Học sinh ${fullName} vừa đạt được: ${score} điểm. Đã cập nhật vào database.json!`,
  );

  res.status(200).json({
    success: true,
    message: "Server đã khắc số điểm của em vào bảng vàng hệ thống rồi nhé! 🏅",
  });
});
// API lấy danh sách học sinh có điểm cao nhất (Xếp hạng)
app.get("/api/leaderboard", (req, res) => {
  const danhSachHocSinh = docDuLieuTuFile();

  // Lọc ra những học sinh đã có điểm và sắp xếp giảm dần (Điểm cao lên đầu)
  const bxh = danhSachHocSinh
    .filter((user) => user.score !== undefined)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Lấy top 5 em điểm cao nhất

  res.json({ success: true, leaderboard: bxh });
});
// 5. Khởi động Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Động cơ Server + Database JSON đã sẵn sàng!`);
  console.log(`📐 Học trực tuyến tại: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
