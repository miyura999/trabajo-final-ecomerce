const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderItem'
  }],
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