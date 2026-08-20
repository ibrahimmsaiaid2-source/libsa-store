const mongoose = require('mongoose');

// Connect to MongoDB
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(process.env.MONGODB_URI);
}

// Order Schema
const orderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    city: String,
    address: String,
    items: Array,
    total: Number,
    date: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const newOrder = new Order(req.body);
            await newOrder.save();
            return res.status(201).json({ success: true, message: "Order created!" });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const orders = await Order.find().sort({ date: -1 });
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};