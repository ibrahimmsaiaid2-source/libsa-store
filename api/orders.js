const mongoose = require('mongoose');

// الاتصال بقاعدة البيانات MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ibrahimmsaiaid2:Ibrahim2026@libsa-store.mongodb.net/libsa-store?retryWrites=true&w=majority";

let isConnected = false;
async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}

// تعريف Schema الطلب
const OrderSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  city: String,
  address: String,
  cart: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// التعامل مع الطلبات (POST & GET)
module.exports = async (req, res) => {
  // تفعيل CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'POST') {
      const orderData = req.body;
      const newOrder = new Order(orderData);
      await newOrder.save();
      return res.status(201).json({ success: true, message: "تم تسجيل الطلب بنجاح", orderId: newOrder._id });
    } 
    
    if (req.method === 'GET') {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};