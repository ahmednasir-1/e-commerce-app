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


  // backend/models/Order.js
  shippingAddress: {
    street:
    {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String
    },
    country: {
      type: String,
      required: true
    },
  },
  
  paymentMethod: {
    type: String,
    enum: ['cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },

}, {
  timestamps: true
});


module.exports = mongoose.model('Order', orderSchema);
