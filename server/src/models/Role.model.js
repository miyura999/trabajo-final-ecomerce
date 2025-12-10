const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del rol es obligatorio'],
    enum: ['admin', 'cliente'],
    unique: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);