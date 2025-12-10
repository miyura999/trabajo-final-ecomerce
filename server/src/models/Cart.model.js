const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  ,
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartItem'
  }],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);