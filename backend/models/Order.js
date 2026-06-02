const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  }],

  totalAmount: {
    type: Number,
    required: true
  },


  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },


  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },


}, {
  timestamps: true
});


module.exports = mongoose.model('Order', orderSchema);
