const User = require('../models/User');

const populated = (userId) => User.findById(userId).populate('cart.bookId');

exports.get = async (req, res, next) => {
  try {
    const user = await populated(req.user._id);
    res.json({ success: true, cart: user.cart });
  } catch (e) { next(e); }
};

exports.add = async (req, res, next) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.bookId.toString() === bookId);
    if (item) item.quantity += quantity;
    else user.cart.push({ bookId, quantity });
    await user.save();
    const updated = await populated(req.user._id);
    res.json({ success: true, cart: updated.cart });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.bookId.toString() === bookId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });
    item.quantity = quantity;
    await user.save();
    const updated = await populated(req.user._id);
    res.json({ success: true, cart: updated.cart });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.bookId.toString() !== req.params.bookId);
    await user.save();
    const updated = await populated(req.user._id);
    res.json({ success: true, cart: updated.cart });
  } catch (e) { next(e); }
};

exports.clear = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ success: true, cart: [] });
  } catch (e) { next(e); }
};
