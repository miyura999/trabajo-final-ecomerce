const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  imagen: {
      type: String,
      default: ''
  },
  estado: {
    type: String,
    enum: ['disponible', 'agotado', 'descontinuado'],
    default: 'disponible'
  }
}, {
  timestamps: true
});

// Índices para búsqueda
productSchema.index({ nombre: 'text', descripcion: 'text' });

module.exports = mongoose.model('Product', productSchema);