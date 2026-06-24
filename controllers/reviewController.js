const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');

const getProductReviews = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const filter = { product: req.params.productId };
    if (req.query.rating) filter.rating = parseInt(req.query.rating);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit),
      Review.countDocuments(filter),
    ]);

    const ratingAgg = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(req.params.productId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 },
          stars: { $push: '$rating' } } },
    ]);

    const stats = ratingAgg[0] || { avgRating: 0, total: 0 };
    const breakdown = [5,4,3,2,1].map(star => ({
      star,
      count: (ratingAgg[0]?.stars || []).filter(s => s === star).length,
    }));

    return paginatedResponse(res, reviews, page, limit, total, { avgRating: stats.avgRating, breakdown });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const createReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return errorResponse(res, 404, 'Product not found.');

    const existing = await Review.findOne({ product: product._id, user: req.user._id });
    if (existing) return errorResponse(res, 400, 'You have already reviewed this product.');

    const order = await Order.findOne({
      user: req.user._id,
      'items.product': product._id,
      status: 'delivered',
    });

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
      isVerifiedPurchase: !!order,
    });

    // Update product rating
    const agg = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (agg[0]) {
      product.rating = Math.round(agg[0].avg * 10) / 10;
      product.reviewCount = agg[0].count;
      await product.save();
    }

    await review.populate('user', 'name avatar');
    return successResponse(res, 201, 'Review submitted.', { review });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) return errorResponse(res, 404, 'Review not found.');
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.title !== undefined) review.title = req.body.title;
    if (req.body.comment !== undefined) review.comment = req.body.comment;
    await review.save();
    return successResponse(res, 200, 'Review updated.', { review });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };
    const review = await Review.findOneAndDelete(filter);
    if (!review) return errorResponse(res, 404, 'Review not found.');

    const agg = await Review.aggregate([
      { $match: { product: review.product } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(review.product, {
      rating: agg[0]?.avg || 0,
      reviewCount: agg[0]?.count || 0,
    });

    return successResponse(res, 200, 'Review deleted.');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    if (!review) return errorResponse(res, 404, 'Review not found.');
    return successResponse(res, 200, 'Marked as helpful.', { helpful: review.helpful });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview, markHelpful };
