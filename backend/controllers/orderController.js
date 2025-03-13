const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.name }).populate('productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArtistOrders = async (req, res) => {
  try {
    const orders = await Order.find({ artistId: req.user.id }).populate('productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// backend/controllers/orderController.js
exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('productId') // Populate productId
      .populate('artistId'); // Optional: Populate artistId if needed
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  const { productId, customer, total, description } = req.body;
  const pictureUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const product = await Product.findById(productId);
    const order = new Order({
      customer,
      productId,
      artistId: product.artistId,
      total,
      description,
      pictureUrl,
    });
    await order.save();

    const payment = new Payment({
      orderId: order._id,
      artistId: product.artistId,
      amount: total * 0.72, // Assuming 28% commission
    });
    await payment.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.uploadProof = async (req, res) => {
  const proofUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { proofUrl }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};