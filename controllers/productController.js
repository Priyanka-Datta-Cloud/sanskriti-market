const Product = require('../models/Product');
const Store = require('../models/Store');
const Story = require('../models/Story');
const User = require('../models/User');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { calculatePagination, getImagePlaceholder } = require('../utils/helpers');
const { getSimilarProducts } = require('../services/recommendationService');

const getProducts = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit);
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.store) filter.store = req.query.store;
    if (req.query.featured === 'true') filter.isFeatured = true;
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'rating') sort = { rating: -1 };
    if (req.query.sort === 'popular') sort = { soldCount: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).populate('store', 'name slug logo').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return paginatedResponse(res, products, page, limit, total);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getProduct = async (req, res) => {
  try {
    const query = req.params.slug
      ? { slug: req.params.slug }
      : { _id: req.params.id };

    const product = await Product.findOne(query)
      .populate('store', 'name slug logo location craftSpecialty rating')
      .populate('story');

    if (!product || !product.isActive) {
      return errorResponse(res, 404, 'Product not found.');
    }

    product.viewCount += 1;
    await product.save();

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          browsingHistory: {
            $each: [{ productId: product._id, viewedAt: new Date() }],
            $slice: -20,
          },
        },
      });
    }

    const similar = await getSimilarProducts(product._id);
    return successResponse(res, 200, 'Product retrieved.', { product, similar });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 400, 'Seller store not found.');

    const productData = {
      ...req.body,
      seller: req.user._id,
      store: store._id,
      images: req.body.images || [{ url: getImagePlaceholder(req.body.category), alt: req.body.name }],
    };

    const product = await Product.create(productData);
    store.productCount += 1;
    await store.save();

    return successResponse(res, 201, 'Product created.', { product });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return errorResponse(res, 404, 'Product not found.');

    Object.assign(product, req.body);
    await product.save();
    return successResponse(res, 200, 'Product updated.', { product });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
    if (!product) return errorResponse(res, 404, 'Product not found.');

    product.isActive = false;
    await product.save();
    return successResponse(res, 200, 'Product deactivated.');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getProductStory = async (req, res) => {
  try {
    const story = await Story.findOne({ product: req.params.productId }).populate('product', 'name category');
    if (!story) return errorResponse(res, 404, 'Story not found.');
    story.viewCount += 1;
    await story.save();
    return successResponse(res, 200, 'Story retrieved.', { story });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const createProductStory = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.body.productId, seller: req.user._id });
    if (!product) return errorResponse(res, 404, 'Product not found.');

    let story = await Story.findOne({ product: product._id });
    if (story) {
      Object.assign(story, req.body);
      await story.save();
    } else {
      story = await Story.create({ ...req.body, product: product._id });
      product.story = story._id;
      await product.save();
    }

    return successResponse(res, 201, 'Story saved.', { story });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStory,
  createProductStory,
};
