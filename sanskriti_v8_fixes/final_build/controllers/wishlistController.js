const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price images slug rating store');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    return successResponse(res, 200, 'Wishlist retrieved.', { wishlist });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return errorResponse(res, 404, 'Product not found.');

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate('products', 'name price images slug rating');
    return successResponse(res, 200, 'Added to wishlist.', { wishlist });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return errorResponse(res, 404, 'Wishlist not found.');

    wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate('products', 'name price images slug rating');
    return successResponse(res, 200, 'Removed from wishlist.', { wishlist });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const checkWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const isInWishlist = wishlist?.products.some((p) => p.toString() === req.params.productId) || false;
    return successResponse(res, 200, 'Wishlist status.', { isInWishlist });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, checkWishlist };
