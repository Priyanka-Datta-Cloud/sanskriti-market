require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('../config/db');
const { errorHandler, notFound } = require('../middleware/errorHandler');
const { generateSitemap } = require('../utils/seo');
const Product = require('../models/Product');
const Store = require('../models/Store');

const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');
const cartRoutes = require('../routes/cartRoutes');
const wishlistRoutes = require('../routes/wishlistRoutes');
const orderRoutes = require('../routes/orderRoutes');
const storeRoutes = require('../routes/storeRoutes');
const searchRoutes = require('../routes/searchRoutes');
const aiRoutes = require('../routes/aiRoutes');
const adminRoutes = require('../routes/adminRoutes');
const sellerRoutes = require('../routes/sellerRoutes');

const app = express();

connectDB().catch(() => {
  console.warn('Running without database connection. API data endpoints will fail until MongoDB is configured.');
});

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sanskriti Market API is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    const [products, stores] = await Promise.all([
      Product.find({ isActive: true }).select('slug').limit(500),
      Store.find({ isActive: true }).select('slug').limit(100),
    ]);
    const xml = generateSitemap(baseUrl, products, stores);
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch {
    res.sendFile(path.join(__dirname, '../public/sitemap.xml'));
  }
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/robots.txt'));
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const filePath = path.join(__dirname, '../frontend', req.path.endsWith('.html') ? req.path : 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Sanskriti Market server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
