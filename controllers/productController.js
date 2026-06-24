const Product = require('../models/Product');
const Store = require('../models/Store');
const slugify = require('slugify');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { calculatePagination } = require('../utils/helpers');

const getProducts = async (req, res) => {
  try {
    const { page, limit, skip } = calculatePagination(req.query.page, req.query.limit || 12);
    const filter = { isActive: true, isApproved: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.region) filter.region = req.query.region;
    if (req.query.craftType) filter.craftType = new RegExp(req.query.craftType, 'i');
    if (req.query.isHandmade === 'true') filter.isHandmade = true;
    if (req.query.isSustainable === 'true') filter.isSustainable = true;
    if (req.query.isHeritageCraft === 'true') filter.isHeritageCraft = true;
    if (req.query.giTagged === 'true') filter.giTagged = true;
    if (req.query.isFeatured === 'true') filter.isFeatured = true;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.rating) filter.rating = { $gte: parseFloat(req.query.rating) };
    if (req.query.store) filter.store = req.query.store;
    if (req.query.seller) filter.seller = req.query.seller;

    // Text search
    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    else if (req.query.sort === 'price_desc') sort = { price: -1 };
    else if (req.query.sort === 'rating') sort = { rating: -1 };
    else if (req.query.sort === 'bestseller') sort = { soldCount: -1 };
    else if (req.query.sort === 'newest') sort = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('seller', 'name avatar')
        .populate('store', 'name slug logo'),
      Product.countDocuments(filter),
    ]);

    return paginatedResponse(res, products, page, limit, total);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getProduct = async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };

    const product = await Product.findOne({ ...query, isActive: true })
      .populate('seller', 'name avatar')
      .populate('store', 'name slug logo tagline');

    if (!product) return errorResponse(res, 404, 'Product not found.');

    // Increment view count
    Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).exec();

    return successResponse(res, 200, 'Product retrieved.', { product });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return errorResponse(res, 404, 'Create a store first.');

    // Handle images — from Cloudinary upload or direct URLs
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((f, i) => ({
        url: f.path,
        publicId: f.filename,
        alt: `${req.body.name} image ${i + 1}`,
      }));
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [{ url: req.body.images }];
    }

    const slug = slugify(req.body.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);

    const product = await Product.create({
      ...req.body,
      images,
      slug,
      seller: req.user._id,
      store: store._id,
      isApproved: req.user.role === 'admin',
    });

    return successResponse(res, 201, 'Product created.', { product });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, seller: req.user._id };

    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((f, i) => ({
        url: f.path,
        publicId: f.filename,
        alt: `${req.body.name || 'Product'} image ${i + 1}`,
      }));
    }

    const product = await Product.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
    if (!product) return errorResponse(res, 404, 'Product not found or not authorized.');
    return successResponse(res, 200, 'Product updated.', { product });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, seller: req.user._id };
    const product = await Product.findOneAndUpdate(filter, { isActive: false }, { new: true });
    if (!product) return errorResponse(res, 404, 'Product not found or not authorized.');
    return successResponse(res, 200, 'Product deactivated.');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isApproved: true, isFeatured: true })
      .sort({ soldCount: -1 }).limit(8)
      .populate('store', 'name slug');
    return successResponse(res, 200, 'Featured products.', { products });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isApproved: true })
      .sort({ createdAt: -1 }).limit(8)
      .populate('store', 'name slug');
    return successResponse(res, 200, 'New arrivals.', { products });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getNewArrivals };
