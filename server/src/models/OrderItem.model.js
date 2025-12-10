const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precio: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  // Datos del producto al momento de la compra
  nombreProducto: String,
  imagenProducto: String
}, {
  timestamps: true
});

module.exports = mongoose.model('OrderItem', orderItemSchema);