const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({ path: 'items.product', select: 'name price images stock isActive store', populate: { path: 'store', select: 'name' } });
    if (!cart) return successResponse(res, 200, 'Cart is empty.', { cart: { items: [], total: 0 } });

    // Filter out unavailable products
    const validItems = cart.items.filter(i => i.product && i.product.isActive);
    const subtotal = validItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shippingCost = subtotal >= 2000 ? 0 : (validItems.length > 0 ? 99 : 0);
    const tax = Math.round(subtotal * 0.05);
    return successResponse(res, 200, 'Cart retrieved.', {
      cart: { items: validItems, subtotal, shippingCost, tax, total: subtotal + shippingCost + tax, itemCount: validItems.length },
    });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return errorResponse(res, 400, 'productId is required.');
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) return errorResponse(res, 404, 'Product not found.');
    if (product.stock < quantity) return errorResponse(res, 400, `Only ${product.stock} unit(s) available.`);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(i => i.product.toString() === productId);
    if (existingIdx > -1) {
      const newQty = cart.items[existingIdx].quantity + parseInt(quantity);
      if (newQty > product.stock) return errorResponse(res, 400, `Only ${product.stock} unit(s) available.`);
      cart.items[existingIdx].quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }
    await cart.save();
    return successResponse(res, 200, 'Added to cart.', { itemCount: cart.items.length });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return errorResponse(res, 400, 'Quantity must be at least 1.');
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return errorResponse(res, 404, 'Cart not found.');
    const item = cart.items.id(req.params.itemId);
    if (!item) return errorResponse(res, 404, 'Item not found in cart.');
    const product = await Product.findById(item.product);
    if (product && quantity > product.stock) return errorResponse(res, 400, `Only ${product.stock} unit(s) available.`);
    item.quantity = parseInt(quantity);
    await cart.save();
    return successResponse(res, 200, 'Cart updated.');
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return errorResponse(res, 404, 'Cart not found.');
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId && i.product.toString() !== req.params.itemId);
    await cart.save();
    return successResponse(res, 200, 'Item removed from cart.', { itemCount: cart.items.length });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    return successResponse(res, 200, 'Cart cleared.');
  } catch (error) { return errorResponse(res, 500, error.message); }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
