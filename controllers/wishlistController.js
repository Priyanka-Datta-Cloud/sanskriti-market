const Wishlist = require('../models/Wishlist');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getWishlist = async (req, res) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id })
      .populate({ path: 'products', select: 'name price images rating isActive store', match: { isActive: true } });
    const products = (wl?.products || []).filter(Boolean);
    return successResponse(res, 200, 'Wishlist retrieved.', { products, count: products.length });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return errorResponse(res, 400, 'productId required.');
    let wl = await Wishlist.findOne({ user: req.user._id });
    if (!wl) wl = await Wishlist.create({ user: req.user._id, products: [] });
    const idx = wl.products.findIndex(p => p.toString() === productId);
    let action;
    if (idx > -1) { wl.products.splice(idx, 1); action = 'removed'; }
    else { wl.products.push(productId); action = 'added'; }
    await wl.save();
    return successResponse(res, 200, `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist.`, { action, count: wl.products.length });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

module.exports = { getWishlist, toggleWishlist };
