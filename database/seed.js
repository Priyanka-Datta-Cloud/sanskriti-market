require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sanskriti_market';

async function seed() {
  console.log('🌱 Starting seed...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const User = require('../models/User');
  const Store = require('../models/Store');
  const Product = require('../models/Product');
  const Cart = require('../models/Cart');
  const Wishlist = require('../models/Wishlist');

  await Promise.all([
    User.deleteMany({}),
    Store.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Wishlist.deleteMany({}),
  ]);
  console.log('🗑️ Cleared existing data');

  const admin = await User.create({
    name: 'Sanskriti Admin',
    email: process.env.ADMIN_EMAIL || 'admin@sanskritimarket.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isVerified: true,
  });
  console.log('✅ Admin created: ' + admin.email);

  const seller = await User.create({
    name: 'Priya Sharma',
    email: 'seller@sanskritimarket.com',
    password: 'Seller@123456',
    role: 'seller',
    isVerified: true,
  });

  const store = await Store.create({
    name: "Priya's Craft Studio",
    slug: 'priyas-craft-studio',
    description: 'Authentic handcrafted products from the heart of India.',
    tagline: 'Where every piece tells a story',
    owner: seller._id,
    location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
    isActive: true,
    isVerified: true,
  });

  seller.storeId = store._id;
  await seller.save();
  console.log('✅ Seller created: ' + seller.email);

  const customer = await User.create({
    name: 'Rahul Verma',
    email: 'customer@sanskritimarket.com',
    password: 'Customer@123456',
    role: 'customer',
  });

  await Cart.create({ user: customer._id, items: [] });
  await Cart.create({ user: seller._id, items: [] });
  await Cart.create({ user: admin._id, items: [] });
  await Wishlist.create({ user: customer._id, products: [] });
  await Wishlist.create({ user: seller._id, products: [] });

  const products = [
    {
      name: 'Madhubani Lotus Garden Painting',
      category: 'paintings',
      region: 'bihar',
      craftType: 'madhubani',
      price: 1800,
      comparePrice: 2500,
      description: 'Hand-painted Madhubani artwork on handmade paper featuring the traditional lotus garden motif.',
      isHandmade: true,
      isHeritageCraft: true,
      giTagged: true,
      isFeatured: true,
      stock: 8,
      rating: 4.8,
      reviewCount: 24,
      soldCount: 67,
      tags: ['madhubani', 'painting', 'bihar'],
      images: [{ url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600', alt: 'Madhubani painting' }],
      seller: seller._id,
      store: store._id,
      isActive: true,
      isApproved: true,
    },
    {
      name: 'Kashmir Pashmina Shawl',
      category: 'textiles',
      region: 'kashmir',
      craftType: 'pashmina',
      price: 8500,
      comparePrice: 12000,
      description: 'Authentic hand-spun and hand-woven Kashmir Pashmina. GI certified.',
      isHandmade: true,
      isHeritageCraft: true,
      giTagged: true,
      isFeatured: true,
      stock: 5,
      rating: 4.9,
      reviewCount: 41,
      soldCount: 89,
      tags: ['pashmina', 'kashmir', 'shawl'],
      images: [{ url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600', alt: 'Pashmina shawl' }],
      seller: seller._id,
      store: store._id,
      isActive: true,
      isApproved: true,
    },
    {
      name: 'Jaipur Blue Pottery Vase Set',
      category: 'pottery',
      region: 'rajasthan',
      craftType: 'blue-pottery',
      price: 2200,
      comparePrice: 3000,
      description: 'Set of 3 handcrafted Jaipur Blue Pottery vases. GI certified from Jaipur.',
      isHandmade: true,
      isHeritageCraft: true,
      giTagged: true,
      isFeatured: true,
      stock: 12,
      rating: 4.7,
      reviewCount: 18,
      soldCount: 43,
      tags: ['blue pottery', 'jaipur', 'vase'],
      images: [{ url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600', alt: 'Blue pottery' }],
      seller: seller._id,
      store: store._id,
      isActive: true,
      isApproved: true,
    },
    {
      name: 'Banarasi Silk Saree',
      category: 'textiles',
      region: 'uttar-pradesh',
      craftType: 'banarasi',
      price: 12000,
      comparePrice: 18000,
      description: 'Handwoven Banarasi silk saree with real gold zari brocade. GI certified.',
      isHandmade: true,
      isHeritageCraft: true,
      giTagged: true,
      isFeatured: true,
      stock: 4,
      rating: 5.0,
      reviewCount: 32,
      soldCount: 56,
      tags: ['banarasi', 'silk', 'saree'],
      images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Banarasi saree' }],
      seller: seller._id,
      store: store._id,
      isActive: true,
      isApproved: true,
    },
    {
      name: 'Channapatna Wooden Toy Set',
      category: 'toys',
      region: 'other',
      craftType: 'channapatna',
      price: 950,
      comparePrice: 1400,
      description: 'Set of 6 hand-turned Channapatna wooden toys. Safe for children. GI certified.',
      isHandmade: true,
      isSustainable: true,
      giTagged: true,
      isFeatured: true,
      stock: 25,
      rating: 4.6,
      reviewCount: 55,
      soldCount: 120,
      tags: ['channapatna', 'toys', 'wooden'],
      images: [{ url: 'https://images.unsplash.com/photo-1566847438217-76e02a251ce4?w=600', alt: 'Channapatna toys' }],
      seller: seller._id,
      store: store._id,
      isActive: true,
      isApproved: true,
    },
  ];

  await Product.insertMany(products);
  console.log('✅ 5 products created');

  console.log('\n🎉 Seed complete!\n');
  console.log('👑 Admin    → ' + admin.email + ' / ' + (process.env.ADMIN_PASSWORD || 'Admin@123456'));
  console.log('🛍️  Seller   → seller@sanskritimarket.com / Seller@123456');
  console.log('🛒 Customer → customer@sanskritimarket.com / Customer@123456');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});