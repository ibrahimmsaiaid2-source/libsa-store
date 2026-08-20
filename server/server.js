// ==========================================================
// LIBSA — server.js (المحرك / Back-end)
// كايستقبل الطلبيات من الفورما ديال الزبون، كايتحقق منها،
// وكيخزنها فـ MongoDB (عبر MongoDB Atlas)
// ==========================================================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Order = require("./models/Order");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// ---------- الاتصال بقاعدة البيانات ----------
if (!MONGO_URI) {
  console.warn("⚠️  MONGO_URI ماشي معرف فـ .env — راجع .env.example");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ تصلنا مزيان مع MongoDB"))
    .catch(err => console.error("❌ ماقدرناش نتصلو بـ MongoDB:", err.message));
}

// ---------- الصفحة الرئيسية ديال الـ API (للتأكد أن السيرفر خدام) ----------
app.get("/", (req, res) => {
  res.send("LIBSA API خدامة 🚀 — استعمل POST /api/orders باش تصيفط طلبية.");
});

// ---------- استقبال طلبية جديدة ----------
app.post("/api/orders", async (req, res) => {
  try {
    const { fullName, phone, city, address, items, total } = req.body;

    if (!fullName || !phone || !city || !address || !items || !items.length) {
      return res.status(400).json({ error: "خاصك تعمر جميع المعلومات وتزيد شي منتج للسلة." });
    }

    const order = await Order.create({ fullName, phone, city, address, items, total });
    res.status(201).json({ message: "تم تسجيل الطلبية بنجاح", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "وقع خطأ فالسيرفر، عاود حاول من بعد." });
  }
});

// ---------- جلب جميع الطلبيات (للمتابعة اليدوية / لوحة تحكم بسيطة) ----------
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "وقع خطأ فجلب الطلبيات." });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 السيرفر خدام على http://localhost:${PORT}`);
});
