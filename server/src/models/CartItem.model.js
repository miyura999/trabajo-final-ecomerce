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

// Calcular subtotal antes de guardar - SIN next()
cartItemSchema.pre('save', function() {
  this.subtotal = this.cantidad * this.precio;
});

module.exports = mongoose.model('CartItem', cartItemSchema);