const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticateUser } = require('../middleware/auth');
const c = require('../controllers/authController');

router.post('/send-otp',validate, c.sendOtp);
router.post('/verify-otp',validate, c.verifyOtp);

// backend/routes/auth.js
router.post('/send-email-otp',  c.sendEmailOtp);
router.post('/verify-email-otp', c.verifyEmailOtp);



router.post('/signup', validate, c.signup);

router.post('/login',validate, c.login);

router.get('/me', authenticateUser, c.me);

module.exports = router;
