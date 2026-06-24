const Product = require('../models/Product');
const User = require('../models/User');
const { generateRecommendations } = require('./geminiService');

const getPersonalizedRecommendations = async (userId, limit = 8) => {
  let userContext = { preferredCategories: [], recentViews: [], role: 'guest' };

  if (userId) {
    const user = await User.findById(userId).populate('browsingHistory.productId', 'category name');
    if (user) {
      const categories = user.browsingHistory
        .map((h) => h.productId?.category)
        .filter(Boolean);
      const categoryCount = {};
      categories.forEach((c) => { categoryCount[c] = (categoryCount[c] || 0) + 1; });
      userContext.preferredCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat);
      userContext.recentViews = user.browsingHistory.slice(-5).map((h) => h.productId?.name).filter(Boolean);
      userContext.role = user.role;
    }
  }

  if (userContext.preferredCategories.length === 0) {
    userContext.preferredCategories = ['textiles', 'jewelry', 'pottery', 'home-decor'];
  }

  const aiResult = await generateRecommendations(userContext);

  const products = await Product.find({
    isActive: true,
    category: { $in: userContext.preferredCategories },
  })
    .populate('store', 'name slug')
    .sort({ rating: -1, soldCount: -1 })
    .limit(limit);

  if (products.length < limit) {
    const more = await Product.find({ isActive: true })
      .populate('store', 'name slug')
      .sort({ isFeatured: -1, rating: -1 })
      .limit(limit - products.length);
    products.push(...more);
  }

  return {
    products,
    aiInsights: aiResult.recommendations,
    aiPowered: aiResult.aiPowered,
  };
};

const getSimilarProducts = async (productId, limit = 4) => {
  const product = await Product.findById(productId);
  if (!product) return [];

  return Product.find({
    _id: { $ne: productId },
    isActive: true,
    $or: [
      { category: product.category },
      { tags: { $in: product.tags } },
      { store: product.store },
    ],
  })
    .populate('store', 'name slug')
    .sort({ rating: -1 })
    .limit(limit);
};

const getTrendingProducts = async (limit = 8) => {
  return Product.find({ isActive: true })
    .populate('store', 'name slug')
    .sort({ viewCount: -1, soldCount: -1 })
    .limit(limit);
};

const getFeaturedProducts = async (limit = 8) => {
  return Product.find({ isActive: true, isFeatured: true })
    .populate('store', 'name slug')
    .sort({ rating: -1 })
    .limit(limit);
};

module.exports = {
  getPersonalizedRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  getFeaturedProducts,
};
