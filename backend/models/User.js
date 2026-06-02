const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// schema of a user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },

  cart: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },

    quantity: { type: Number, default: 1 }
  }],

},
  { timestamps: true }

);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
