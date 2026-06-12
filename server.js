const express = require("express");
const path = require("path");
const mongoose = require("mongoose"); // Gọi thư viện Mongoose chuyên kết nối MongoDB
const app = express();
const cors = require("cors"); // Gọi thư viện mở khóa đường truyền

// Cho phép TẤT CẢ các trang web khác (bao gồm cả GitHub Pages) cấu hình kết nối tới Server này
app.use(cors());

// Nếu hệ thống Render cấp cổng nào thì dùng cổng đó, nếu không thì mặc định là 3000
const PORT = process.env.PORT || 3000;
// DÁN ĐƯỜNG DẪN KẾT NỐI MONGODB ATLAS CỦA BẠN VÀO ĐÂY
const MONGO_URI =
  "mongodb+srv://nguyenvanhung0101:abcde12345@myclucter.nuprsvk.mongodb.net/?appName=MyClucter";

// 1. KẾT NỐI TỚI ĐÁM MÂY MONGODB
mongoose
  .connect(MONGO_URI)
  .then(() =>
    console.log("🍃 Đã kết nối thành công tới đám mây dữ liệu MongoDB Atlas!"),
  )
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// 2. TẠO KHUÔN MẪU DỮ LIỆU (SCHEMA) CHO HỌC SINH
const HocSinhSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
});

// Tạo Model từ Schema để thao tác dữ liệu
const HocSinh = mongoose.model("HocSinh", HocSinhSchema);

// 3. CẤU HÌNH MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ==========================================
// 4. CÁC API ENDPOINTS (XỬ LÝ TRUY VẤN DB)
// ==========================================

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
// Xóa dòng app.get('/auth.html') cũ đi và thay bằng 2 dòng này:
app.get("/register.html", (req, res) =>
  res.sendFile(path.join(__dirname, "register.html")),
);
app.get("/login.html", (req, res) =>
  res.sendFile(path.join(__dirname, "login.html")),
);
app.get("/quiz.html", (req, res) =>
  res.sendFile(path.join(__dirname, "quiz.html")),
);

// API ĐĂNG KÝ (NÂNG CẤP LÊN MONGODB)
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Dùng lệnh findOne để tìm xem email đã tồn tại trong Database chưa
    const taiKhoanDaTonTai = await HocSinh.findOne({ email: email });
    if (taiKhoanDaTonTai) {
      return res.status(400).json({
        success: false,
        message: "Email này đã được đăng ký rồi em ơi!",
      });
    }

    // Tạo bản ghi mới và lưu lên Cloud
    const hocSinhMoi = new HocSinh({ fullName, email, password });
    await hocSinhMoi.save();

    res.status(201).json({
      success: true,
      message: `Chúc mừng ${fullName} đã đăng ký thành công! 🎉`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống khi đăng ký." });
  }
});

// API ĐĂNG NHẬP (NÂNG CẤP LÊN MONGODB)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hocSinh = await HocSinh.findOne({ email });
    if (!hocSinh) {
      return res.status(400).json({
        success: false,
        message: "Email này chưa đăng ký thành viên!",
      });
    }

    if (hocSinh.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Sai mật khẩu rồi kìa em ơi!" });
    }

    res.status(200).json({
      success: true,
      message: `Chào mừng ${hocSinh.fullName} quay trở lại!`,
      fullName: hocSinh.fullName,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống khi đăng nhập." });
  }
});

// API NỘP BÀI TẬP (NÂNG CẤP LÊN MONGODB)
app.post("/api/submit-quiz", async (req, res) => {
  try {
    const { fullName, score } = req.body;

    // Tìm và cập nhật điểm số trực tiếp bằng lệnh của MongoDB
    const hocSinh = await HocSinh.findOneAndUpdate(
      { fullName: fullName },
      { score: score },
      { new: true }, // Trả về dữ liệu sau khi đã cập nhật
    );

    if (!hocSinh) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản học sinh!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã khắc số điểm của em vào hệ thống đám mây! 🏅",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống khi nộp điểm." });
  }
});

// API BẢNG XẾP HẠNG (NÂNG CẤP LÊN MONGODB)
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Lấy top 5 học sinh điểm cao nhất trực tiếp bằng bộ lọc nâng cao của MongoDB
    const bxh = await HocSinh.find({})
      .sort({ score: -1 }) // Sắp xếp điểm giảm dần
      .limit(5); // Chỉ lấy 5 dòng

    res.json({ success: true, leaderboard: bxh });
  } catch (error) {
    res.json({ success: false, leaderboard: [] });
  }
});

// KHỞI ĐỘNG SERVER
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Động cơ Server kết nối MONGODB ATLAS thành công!`);
  console.log(`📐 Học trực tuyến tại: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
