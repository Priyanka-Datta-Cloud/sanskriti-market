const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock slug');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    const subtotal = cart.items.reduce((sum, item) => {
      if (!item.product) return sum;
      return sum + item.product.price * item.quantity;
    }, 0);
    return successResponse(res, 200, 'Cart retrieved.', { cart, subtotal });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return errorResponse(res, 404, 'Product not found.');
    if (product.stock < quantity) return errorResponse(res, 400, 'Insufficient stock.');

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await cart.populate('items.product', 'name price images stock slug');

    return successResponse(res, 200, 'Added to cart.', { cart });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return errorResponse(res, 404, 'Cart not found.');

    const item = cart.items.id(req.params.itemId);
    if (!item) return errorResponse(res, 404, 'Item not found.');

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      const product = await Product.findById(item.product);
      if (product.stock < quantity) return errorResponse(res, 400, 'Insufficient stock.');
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock slug');
    return successResponse(res, 200, 'Cart updated.', { cart });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return errorResponse(res, 404, 'Cart not found.');

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    return successResponse(res, 200, 'Item removed.', { cart });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    return successResponse(res, 200, 'Cart cleared.');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
