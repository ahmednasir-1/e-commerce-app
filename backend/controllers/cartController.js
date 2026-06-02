const User = require('../models/User');
const Book = require('../models/Book');

const getPopulatedCart = async (userId) => {
  const user = await User.findById(userId).populate('cart.bookId');
  return user.cart;
};

exports.get = async (req, res, next) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json({ success: true, cart });
  } catch (e) { next(e); }
};

exports.add = async (req, res, next) => {
  try {
    const { bookId, quantity = 1 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.stock === 0) return res.status(400).json({ message: 'This book is out of stock' });

    const user = await User.findById(req.user._id);
    const existing = user.cart.find(i => i.bookId.toString() === bookId);

    if (existing) {
      if (existing.quantity + quantity > book.stock)
        return res.status(400).json({
          message: `Only ${book.stock} copies available. You already have ${existing.quantity} in cart.`
        });
      existing.quantity += quantity;
    } else {
      if (quantity > book.stock)
        return res.status(400).json({ message: `Only ${book.stock} copies available` });
      user.cart.push({ bookId, quantity });
    }

    await user.save();
    const cart = await getPopulatedCart(req.user._id); // ✅
    res.json({ success: true, cart });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (quantity > book.stock)
      return res.status(400).json({ message: `Only ${book.stock} copies available` });
    if (quantity < 1)
      return res.status(400).json({ message: 'Quantity must be at least 1' });

    const user = await User.findById(req.user._id);
    const item = user.cart.find(i => i.bookId.toString() === bookId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = quantity;
    await user.save();
    const cart = await getPopulatedCart(req.user._id); // ✅
    res.json({ success: true, cart });
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(i => i.bookId.toString() !== req.params.bookId);
    await user.save();
    const cart = await getPopulatedCart(req.user._id); // ✅ fixed: was calling populated()
    res.json({ success: true, cart });
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