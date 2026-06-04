const User = require('../models/User');
const generateToken = require('../utils/token');
const { sendOtp, checkOtp } = require('../config/twilio');
const { sendVerificationEmail } = require('../utils/email');
const crypto = require('crypto');

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


// Helper — generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Temporary store for OTPs (use Redis in production)
const otpStore = new Map();

// send-email-otp
exports.sendEmailOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) 
      return res.status(400).json({ message: 'Email already registered' });

    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP temporarily
    otpStore.set(email, { otp, expires });

    await sendVerificationEmail(email, name, otp);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// email verification otp
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);
    if (!stored) 
      return res.status(400).json({ message: 'OTP not found. Request a new one.' });

    if (Date.now() > stored.expires) 
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    
    if (stored.otp !== otp) 
      return res.status(400).json({ message: 'Invalid OTP.' });

    otpStore.delete(email); // clear after use
    res.json({ success: true, message: 'Email verified!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
