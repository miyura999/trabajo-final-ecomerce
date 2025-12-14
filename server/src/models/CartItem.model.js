const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad mínima es 1'],
    default: 1
  },
  precio: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CartItem', cartItemSchema);