const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  size: String,
  color: String,
  qty: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "جديد" } // جديد / مؤكد / موصل / ملغي
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
