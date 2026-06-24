require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sanskriti_market';

const PRODUCTS = [
  { name: 'Madhubani Lotus Garden Painting', category: 'paintings', region: 'bihar', craftType: 'madhubani', price: 1800, comparePrice: 2500, description: 'Hand-painted Madhubani artwork on handmade paper featuring the traditional lotus garden motif. Uses natural colours made from turmeric, indigo, and flower pigments. Each piece is unique and signed by the artist.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, isSustainable: true, stock: 8, rating: 4.8, reviewCount: 24, soldCount: 67, tags: ['madhubani', 'painting', 'bihar', 'folk art', 'wall art'], images: [{ url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600', alt: 'Madhubani painting' }] },
  { name: 'Kashmir Pashmina Shawl – Natural Ivory', category: 'textiles', region: 'kashmir', craftType: 'pashmina', price: 8500, comparePrice: 12000, description: 'Authentic hand-spun and hand-woven Kashmir Pashmina from Changthangi goats. Natural ivory colour with traditional paisley border embroidery. GI certified. Ring test certified — passes through a standard ring.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, isSustainable: true, stock: 5, rating: 4.9, reviewCount: 41, soldCount: 89, tags: ['pashmina', 'kashmir', 'shawl', 'luxury', 'GI tag'], images: [{ url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600', alt: 'Pashmina shawl' }] },
  { name: 'Jaipur Blue Pottery Vase Set', category: 'pottery', region: 'rajasthan', craftType: 'blue-pottery', price: 2200, comparePrice: 3000, description: 'Set of 3 handcrafted Jaipur Blue Pottery vases. Made from quartz stone powder with cobalt blue Persian-inspired floral motifs. No clay used — the traditional Mughal method. GI certified from Jaipur.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, stock: 12, rating: 4.7, reviewCount: 18, soldCount: 43, tags: ['blue pottery', 'jaipur', 'vase', 'home decor', 'rajasthan'], images: [{ url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600', alt: 'Blue pottery vase' }] },
  { name: 'Banarasi Silk Saree – Crimson Zari', category: 'textiles', region: 'uttar-pradesh', craftType: 'banarasi', price: 12000, comparePrice: 18000, description: 'Handwoven Banarasi silk saree with real gold zari brocade on crimson base. Traditional Mughal floral kalga motif. Woven in Varanasi by a third-generation weaver family. Takes 21 days to complete. GI certified.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, stock: 4, rating: 5.0, reviewCount: 32, soldCount: 56, tags: ['banarasi', 'silk', 'saree', 'wedding', 'varanasi', 'zari'], images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Banarasi silk saree' }] },
  { name: 'Channapatna Wooden Toy Set – Animals', category: 'toys', region: 'other', craftType: 'channapatna', price: 950, comparePrice: 1400, description: 'Set of 6 hand-turned Channapatna wooden toys shaped as Indian animals — elephant, peacock, cow, horse, tiger, and monkey. Made from ivory wood with natural vegetable lac dye. Safe for children aged 2+. GI certified from Karnataka.', isHandmade: true, isSustainable: true, giTagged: true, isHeritageCraft: true, isFeatured: true, stock: 25, rating: 4.6, reviewCount: 55, soldCount: 120, tags: ['channapatna', 'toys', 'wooden', 'children', 'karnataka', 'eco'], images: [{ url: 'https://images.unsplash.com/photo-1566847438217-76e02a251ce4?w=600', alt: 'Channapatna toys' }] },
  { name: 'Dokra Brass Elephant Figurine', category: 'sculptures', region: 'west-bengal', craftType: 'dokra', price: 3200, comparePrice: 4500, description: 'Lost-wax cast Dokra brass elephant with traditional tribal motifs. Made by the Dhokra Damar community of West Bengal using the 4000-year-old cire-perdue technique. Each piece is unique — no two are identical. Ideal as a home decor showpiece.', isHandmade: true, isHeritageCraft: true, isSustainable: true, stock: 7, rating: 4.7, reviewCount: 14, soldCount: 29, tags: ['dokra', 'brass', 'elephant', 'tribal', 'bengal', 'sculpture'], images: [{ url: 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=600', alt: 'Dokra elephant' }] },
  { name: 'Rajasthani Bandhani Dupatta – Saffron', category: 'textiles', region: 'rajasthan', craftType: 'bandhani', price: 1600, comparePrice: 2200, description: 'Hand-tied and dyed Bandhani dupatta in saffron and red with traditional dot patterns. Made in Jaipur by artisans who have practiced the craft for three generations. Over 50,000 hand-tied knots. Washes well, colours are fast.', isHandmade: true, isHeritageCraft: true, giTagged: true, stock: 18, rating: 4.5, reviewCount: 28, soldCount: 74, tags: ['bandhani', 'dupatta', 'rajasthan', 'tie-dye', 'festival wear'], images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b984a?w=600', alt: 'Bandhani dupatta' }] },
  { name: 'Kantha Embroidery Cushion Cover Set', category: 'textiles', region: 'west-bengal', craftType: 'kantha', price: 2400, comparePrice: 3200, description: 'Set of 2 hand-embroidered Kantha cushion covers on natural cotton. Running stitch patterns inspired by Bengali folk motifs — fish, lotus, tree of life. Each cover takes 4 days of work. Machine washable.', isHandmade: true, isSustainable: true, isHeritageCraft: true, stock: 15, rating: 4.6, reviewCount: 19, soldCount: 48, tags: ['kantha', 'embroidery', 'cushion', 'bengal', 'home decor'], images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', alt: 'Kantha cushion' }] },
  { name: 'Sambalpuri Silk Ikat Stole', category: 'textiles', region: 'odisha', craftType: 'sambalpuri', price: 3800, comparePrice: 5500, description: 'Handwoven Sambalpuri silk stole with traditional ikat weave. The bandha (tie-resist) dyeing happens before weaving, creating the characteristic blurred-edge geometric patterns. GI protected craft of Odisha.', isHandmade: true, isHeritageCraft: true, giTagged: true, stock: 9, rating: 4.8, reviewCount: 22, soldCount: 37, tags: ['sambalpuri', 'ikat', 'odisha', 'silk', 'stole'], images: [{ url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', alt: 'Sambalpuri ikat' }] },
  { name: 'Warli Tribal Art Painting on Canvas', category: 'paintings', region: 'other', craftType: 'warli', price: 2800, comparePrice: 4000, description: 'Authentic Warli painting on canvas by a Warli tribal artist from Maharashtra. White rice-paste figures on terracotta background depicting the Tarpa dance festival scene. Signed by the artist. Ready to hang.', isHandmade: true, isHeritageCraft: true, isSustainable: true, stock: 11, rating: 4.7, reviewCount: 31, soldCount: 52, tags: ['warli', 'painting', 'tribal', 'maharashtra', 'canvas'], images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600', alt: 'Warli painting' }] },
];

async function seed() {
  console.log('🌱 Starting seed...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Store.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Wishlist.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Sanskriti Admin',
    email: process.env.ADMIN_EMAIL || 'admin@sanskritimarket.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    isVerified: true,
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create demo seller
  const seller = await User.create({
    name: 'Priya Sharma',
    email: 'seller@sanskritimarket.com',
    password: 'Seller@123456',
    role: 'seller',
    isVerified: true,
  });

  // Create store
  const store = await Store.create({
    name: "Priya's Craft Studio",
    slug: 'priyas-craft-studio',
    description: 'Authentic handcrafted products from the heart of India, made with love and generations of tradition.',
    tagline: 'Where every piece tells a story',
    owner: seller._id,
    location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
    isActive: true,
    isVerified: true,
  });
  seller.storeId = store._id;
  await seller.save();
  console.log(`✅ Seller created: ${seller.email} | Store: ${store.name}`);

  // Create demo customer
  const customer = await User.create({
    name: 'Rahul Verma',
    email: 'customer@sanskritimarket.com',
    password: 'Customer@123456',
    role: 'customer',
  });
  await Cart.create({ user: customer._id, items: [] });
  await Wishlist.create({ user: customer._id, products: [] });
  await Cart.create({ user: seller._id, items: [] });
  await Cart.create({ user: admin._id, items: [] });
  console.log(`✅ Customer created: ${customer.email}`);

  // Create products
  const products = await Product.insertMany(
    PRODUCTS.map(p => ({
      ...p,
      seller: seller._id,
      store: store._id,
      isActive: true,
      isApproved: true,
    }))
  );
  console.log(`✅ ${products.length} products created`);

  console.log('\n🎉 Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin    → admin@sanskritimarket.com  / Admin@123456');
  console.log('🛍️  Seller   → seller@sanskritimarket.com / Seller@123456');
  console.log('🛒 Customer → customer@sanskritimarket.com / Customer@123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
