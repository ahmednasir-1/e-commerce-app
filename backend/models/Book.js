const mongoose = require('mongoose');

// schema of a Book
const bookSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Children', 'Other'],
    default: 'Other',
  },

  image:
  {
    type: String,
    default: ''
  },
  
  stock: {
    type: Number,
    default: 0,
    min: 0
  },

}, {
  timestamps: true
});


module.exports = mongoose.model('Book', bookSchema);
