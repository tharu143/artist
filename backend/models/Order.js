const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true }, // Consider ref: 'User' if linking to User model
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total: { type: Number, required: true },
  description: { type: String },
  pictureUrl: { type: String, default: null },
  proofUrl: { type: String, default: null },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;