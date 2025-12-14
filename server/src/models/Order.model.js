const mongoose = require('mongoose');

// ✅ Schema para items embebidos (NO es un modelo separado)
const orderItemSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  nombreProducto: {
    type: String,
    required: true
  },
  imagenProducto: {
    type: String,
    default: ''
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
  }
}, { _id: false }); // ← IMPORTANTE: _id: false para items embebidos

// ✅ Schema principal de Order
const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],  // ← Array de OBJETOS, NO referencias
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_produccion', 'enviando', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  direccionEnvio: {
    calle: { type: String, required: true },
    ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    pais: { type: String, required: true }
  },
  telefono: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);