const User = require('../models/User');
const generateToken = require('../utils/token');
const { sendOtp, checkOtp } = require('../config/twilio');

// user enter phone no. [signup]
exports.sendOtp = async (req, res, next) => {
  try {

    const { phone } = req.body;

    await sendOtp(phone);

    res.json({ success: true, message: 'OTP sent' });

  } catch (e) {
     next(e); 
    }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const result = await checkOtp(phone, otp);

    if (result.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    res.json({ success: true, message: 'Phone verified' });

  } catch (e) { 
    next(e); 
  }
};

// signup form after otp verification
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { phone }] });

    if (exists) 
      return res.status(400).json({ success: false, message: 'Email or phone already in use' });

    const user = await User.create({ name, email, password, phone, isPhoneVerified: true });

    // jwt token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (e) { 
    next(e); 
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (e) { 
    next(e); 
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
