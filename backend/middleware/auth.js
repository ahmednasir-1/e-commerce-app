const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.authenticateUser = async (req, res, next) => {
  try {

    const header = req.headers.authorization;

    // if header does not contain token or not in proper format e.g 'Bearer z4fndfirt'
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const token = header.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) 
      return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user;
    next();

  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin only' });
  }
  next();
};
