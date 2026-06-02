const Order = require('../models/Order');
const User = require('../models/User');
const Book = require('../models/Book');
const { sendSms } = require('../config/twilio');


exports.place = async (req, res, next) => {
  try {

    const { shippingAddress } = req.body;

    // check the user cart if the cart is empty then no order will be placed
    const user = await User.findById(req.user._id).populate('cart.bookId');
    if (!user.cart.length) 
      return res.status(400).json({ success: false, message: 'Cart is empty' });


    const items = user.cart.map((i) => ({
      bookId: i.bookId._id,
      quantity: i.quantity,
      price: i.bookId.price,
    }));

    const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

    // create Order
    const order = await Order.create({ 
      userId: user._id, 
      items, 
      totalAmount, 
      shippingAddress 
    });

    // empty the user cart
    user.cart = [];

    await user.save();

    // send sms to user about order
    try {
      await sendSms(user.phone, `Your order #${order._id} has been placed! Total: $${totalAmount.toFixed(2)}. We'll notify you when it ships.`);
    } catch (e) { 
      console.warn('SMS failed:', e.message); 
    }

    res.status(201).json({ success: true, order });

  } catch (e) { 
    next(e); 
  }
};

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('items.bookId').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (e) { next(e); }
};

exports.getOne = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.bookId').populate('userId', 'name email');
    if (!order) 
      return res.status(404).json({ success: false, message: 'Order not found' });

    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json({ success: true, order });
  } catch (e) { next(e); }
};


exports.listAll = async (req, res, next) => {
  try {
    
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find().populate('userId', 'name email phone').populate('items.bookId').sort('-createdAt').skip(skip).limit(Number(limit)),
      Order.countDocuments(),
    ]);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (e) { next(e); }
};


// update the status of a order
exports.updateStatus = async (req, res, next) => {

  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(req.params.id, 
      { status }, 
      { new: true }).populate('userId');

    if (!order) 
      return res.status(404).json({ success: false, message: 'Order not found' });

    // send sms to user of order status
    try {
      await sendSms(order.userId.phone, `Order #${order._id} status updated to: ${status}. Thank you for shopping with BookStore!`);

    } catch (e) { 
      console.warn('SMS failed:', e.message); 
    }
    res.json({ success: true, order });

  } catch (e) { 
    next(e);
   }
};
