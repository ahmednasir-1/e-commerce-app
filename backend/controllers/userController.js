const User = require('../models/User');
const Order = require('../models/Order');

exports.list = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    const withCounts = await Promise.all(users.map(async (u) => ({
      ...u.toObject(),
      orderCount: await Order.countDocuments({ userId: u._id }),
    })));
    res.json({ success: true, users: withCounts });
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    const orders = await Order.find({ userId: user._id }).populate('items.bookId');
    res.json({ success: true, user, orders });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { next(e); }
};
