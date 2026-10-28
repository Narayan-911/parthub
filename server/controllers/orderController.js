const Order = require('../models/Order');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Helper to optionally extract user from Authorization header if present
 */
const getOptionalUser = async (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'parthub_secret');
      const user = await User.findById(decoded.id).select('_id');
      return user ? user._id : null;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * @desc    Create new order with server-side total calculation & stock updates
 * @route   POST /api/orders
 * @access  Public (Guest) or Authenticated
 */
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // 1. Validate order items
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    // 2. Validate shipping address fields
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.email ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zip
    ) {
      res.status(400);
      throw new Error('Please provide complete shipping address (name, email, address, city, state, zip)');
    }

    // 3. Resolve products & calculate server-side totals
    let calculatedTotalPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      if (!item.productId && !item.product) {
        res.status(400);
        throw new Error('Each order item must specify a product ID');
      }

      const prodId = item.productId || item.product;

      if (!mongoose.Types.ObjectId.isValid(prodId)) {
        res.status(400);
        throw new Error(`Invalid product ID: ${prodId}`);
      }

      const product = await Product.findById(prodId);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found with ID ${prodId}`);
      }

      const qty = Number(item.quantity) || 1;
      if (qty <= 0) {
        res.status(400);
        throw new Error(`Invalid quantity for product ${product.name}`);
      }

      if (product.stock < qty) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      // Decrement stock
      product.stock -= qty;
      await product.save();

      calculatedTotalPrice += product.price * qty;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        quantity: qty,
        price: product.price,
      });
    }

    // 4. Resolve user if logged in
    const userId = req.user ? req.user._id : await getOptionalUser(req);

    // 5. Create Order document
    const order = await Order.create({
      user: userId,
      orderItems: verifiedOrderItems,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        email: shippingAddress.email.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        zip: shippingAddress.zip.trim(),
      },
      paymentMethod: paymentMethod || 'Card (Simulated)',
      totalPrice: Number(calculatedTotalPrice.toFixed(2)),
      isPaid: true,
      paidAt: Date.now(),
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID (for confirmation receipt)
 * @route   GET /api/orders/:id
 * @access  Public or Protected
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error(`Order not found (invalid ID format: ${id})`);
    }

    const order = await Order.findById(id)
      .populate('user', 'name username email')
      .populate('orderItems.product', 'name imageUrl category price');

    if (!order) {
      res.status(404);
      throw new Error(`Order not found with ID ${id}`);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
};
