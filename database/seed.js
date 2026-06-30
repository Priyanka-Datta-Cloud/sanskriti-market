require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sanskriti_market';

const PRODUCTS = [
  // PAINTINGS
  { name: 'Madhubani Lotus Garden Painting', category: 'paintings', region: 'bihar', craftType: 'madhubani', price: 1800, comparePrice: 2500, description: 'Hand-painted Madhubani artwork on handmade paper. Uses natural colours from turmeric, indigo, and flowers. Each piece is unique and signed by the artist.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, isSustainable: true, stock: 8, rating: 4.8, reviewCount: 24, soldCount: 67, tags: ['madhubani', 'painting', 'bihar', 'folk art'], images: [{ url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600', alt: 'Madhubani painting' }] },
  { name: 'Warli Tribal Canvas Painting', category: 'paintings', region: 'other', craftType: 'warli', price: 2800, comparePrice: 4000, description: 'Authentic Warli painting by a tribal artist from Maharashtra. White rice-paste figures on terracotta background. Signed by the artist. Ready to hang.', isHandmade: true, isHeritageCraft: true, isSustainable: true, isFeatured: true, stock: 11, rating: 4.7, reviewCount: 31, soldCount: 52, tags: ['warli', 'tribal', 'maharashtra'], images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600', alt: 'Warli painting' }] },
  { name: 'Tanjore Gold Leaf Painting — Ganesha', category: 'paintings', region: 'tamil-nadu', craftType: 'tanjore', price: 4500, comparePrice: 6000, description: 'Traditional Tanjore painting of Lord Ganesha with 24K gold leaf work. Made on hardboard. Framed and ready to hang. Certificate of authenticity included.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, stock: 6, rating: 4.9, reviewCount: 18, soldCount: 34, tags: ['tanjore', 'gold leaf', 'ganesha', 'tamil nadu'], images: [{ url: 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=600', alt: 'Tanjore painting' }] },

  // TEXTILES
  { name: 'Kashmir Pashmina Shawl — Natural Ivory', category: 'textiles', region: 'kashmir', craftType: 'pashmina', price: 8500, comparePrice: 12000, description: 'Authentic hand-spun Kashmir Pashmina from Changthangi goats. GI certified. Ring test certified. Comes in a premium gift box.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, isSustainable: true, stock: 5, rating: 4.9, reviewCount: 41, soldCount: 89, tags: ['pashmina', 'kashmir', 'shawl', 'luxury'], images: [{ url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600', alt: 'Pashmina shawl' }] },
  { name: 'Banarasi Silk Saree — Crimson Zari', category: 'textiles', region: 'uttar-pradesh', craftType: 'banarasi', price: 12000, comparePrice: 18000, description: 'Handwoven Banarasi silk saree with real gold zari brocade. Woven in Varanasi. Takes 21 days to complete. GI certified. Comes with matching blouse piece.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, stock: 4, rating: 5.0, reviewCount: 32, soldCount: 56, tags: ['banarasi', 'silk', 'saree', 'wedding'], images: [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', alt: 'Banarasi silk saree' }] },
  { name: 'Bandhani Dupatta — Saffron Red', category: 'textiles', region: 'rajasthan', craftType: 'bandhani', price: 1600, comparePrice: 2200, description: 'Hand-tied and dyed Bandhani dupatta. Over 50,000 hand-tied knots. Washes well, colours are fast. Pure cotton fabric.', isHandmade: true, isHeritageCraft: true, giTagged: true, stock: 18, rating: 4.5, reviewCount: 28, soldCount: 74, tags: ['bandhani', 'dupatta', 'rajasthan'], images: [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b984a?w=600', alt: 'Bandhani dupatta' }] },
  { name: 'Kantha Embroidery Cushion Set', category: 'textiles', region: 'west-bengal', craftType: 'kantha', price: 2400, comparePrice: 3200, description: 'Set of 2 hand-embroidered Kantha cushion covers on natural cotton. Running stitch patterns — fish, lotus, tree of life motifs. Machine washable.', isHandmade: true, isSustainable: true, isHeritageCraft: true, stock: 15, rating: 4.6, reviewCount: 19, soldCount: 48, tags: ['kantha', 'embroidery', 'cushion', 'bengal'], images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', alt: 'Kantha cushion' }] },
  { name: 'Chikankari White Kurta — Lucknow', category: 'textiles', region: 'uttar-pradesh', craftType: 'chikankari', price: 3200, comparePrice: 4500, description: 'Delicate Lucknow Chikankari embroidery on fine white cotton. Shadow work, jali, and phanda stitches. GI certified. Available S to XXL.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, stock: 12, rating: 4.7, reviewCount: 35, soldCount: 61, tags: ['chikankari', 'lucknow', 'kurta'], images: [{ url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600', alt: 'Chikankari kurta' }] },
  { name: 'Sambalpuri Silk Ikat Stole', category: 'textiles', region: 'odisha', craftType: 'sambalpuri', price: 3800, comparePrice: 5500, description: 'Handwoven Sambalpuri silk stole with traditional ikat weave. GI protected craft of Odisha. Perfect for festive occasions.', isHandmade: true, isHeritageCraft: true, giTagged: true, stock: 9, rating: 4.8, reviewCount: 22, soldCount: 37, tags: ['sambalpuri', 'ikat', 'odisha', 'silk'], images: [{ url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', alt: 'Sambalpuri ikat' }] },

  // POTTERY
  { name: 'Jaipur Blue Pottery Vase Set of 3', category: 'pottery', region: 'rajasthan', craftType: 'blue-pottery', price: 2200, comparePrice: 3000, description: 'Set of 3 handcrafted Jaipur Blue Pottery vases. Made from quartz stone powder — NO clay used. GI certified. Each piece unique.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, stock: 12, rating: 4.7, reviewCount: 18, soldCount: 43, tags: ['blue pottery', 'jaipur', 'vase'], images: [{ url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600', alt: 'Blue pottery vase' }] },
  { name: 'Blue Pottery Tea Set — 6 Cups', category: 'pottery', region: 'rajasthan', craftType: 'blue-pottery', price: 3600, comparePrice: 5000, description: 'Complete blue pottery tea set with 6 cups, 6 saucers, and 1 teapot. Microwave and dishwasher safe. Perfect gift set.', isHandmade: true, isHeritageCraft: true, giTagged: true, stock: 8, rating: 4.6, reviewCount: 15, soldCount: 29, tags: ['blue pottery', 'tea set', 'kitchen'], images: [{ url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600', alt: 'Blue pottery tea set' }] },

  // SCULPTURES
  { name: 'Dokra Brass Elephant Figurine', category: 'sculptures', region: 'west-bengal', craftType: 'dokra', price: 3200, comparePrice: 4500, description: 'Lost-wax cast Dokra brass elephant. Made using the 4000-year-old cire-perdue technique. Each piece is unique — no two identical.', isHandmade: true, isHeritageCraft: true, isSustainable: true, isFeatured: true, stock: 7, rating: 4.7, reviewCount: 14, soldCount: 29, tags: ['dokra', 'brass', 'elephant', 'tribal'], images: [{ url: 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=600', alt: 'Dokra elephant' }] },
  { name: 'Bronze Nataraja — Chola Style', category: 'sculptures', region: 'tamil-nadu', craftType: 'bronze-casting', price: 8500, comparePrice: 12000, description: 'Hand-cast bronze Nataraja in classical Chola style. Made in Swamimalai, Tamil Nadu. Height 12 inches. Teak wood base and certificate included.', isHandmade: true, isHeritageCraft: true, giTagged: true, isFeatured: true, stock: 3, rating: 5.0, reviewCount: 8, soldCount: 12, tags: ['bronze', 'nataraja', 'chola', 'tamil nadu'], images: [{ url: 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=600', alt: 'Bronze Nataraja' }] },

  // TOYS
  { name: 'Channapatna Wooden Animal Set', category: 'toys', region: 'other', craftType: 'channapatna', price: 950, comparePrice: 1400, description: 'Set of 6 hand-turned Channapatna wooden animals. Made from ivory wood with natural vegetable lac dye. Safe for children aged 2+. GI certified.', isHandmade: true, isSustainable: true, giTagged: true, isHeritageCraft: true, isFeatured: true, stock: 25, rating: 4.6, reviewCount: 55, soldCount: 120, tags: ['channapatna', 'toys', 'wooden', 'children'], images: [{ url: 'https://images.unsplash.com/photo-1566847438217-76e02a251ce4?w=600', alt: 'Channapatna toys' }] },

  // JEWELRY
  { name: 'Kundan Meenakari Necklace Set', category: 'jewelry', region: 'rajasthan', craftType: 'meenakari', price: 4500, comparePrice: 7000, description: 'Handcrafted Kundan Meenakari necklace set with earrings and maang tikka. Gold-plated base with peacock enamel motif. Comes in velvet box.', isHandmade: true, isHeritageCraft: true, isFeatured: true, stock: 8, rating: 4.8, reviewCount: 27, soldCount: 45, tags: ['kundan', 'meenakari', 'necklace', 'wedding'], images: [{ url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600', alt: 'Kundan necklace' }] },
  { name: 'Dokra Tribal Necklace — Peacock', category: 'jewelry', region: 'west-bengal', craftType: 'dokra', price: 1800, comparePrice: 2500, description: 'Hand-cast Dokra brass necklace with peacock pendant. 4000-year-old lost-wax technique. Oxidised brass finish. Each piece unique.', isHandmade: true, isHeritageCraft: true, isSustainable: true, stock: 14, rating: 4.5, reviewCount: 19, soldCount: 38, tags: ['dokra', 'necklace', 'tribal', 'brass'], images: [{ url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600', alt: 'Dokra necklace' }] },

  // HOME DECOR
  { name: 'Brass Diya Set of 5 — Diwali', category: 'home-decor', region: 'uttar-pradesh', craftType: 'brassware', price: 1200, comparePrice: 1800, description: 'Set of 5 handcrafted brass diyas with floral engravings. Made by Moradabad artisans. Perfect for Diwali, puja, or home decoration.', isHandmade: true, isHeritageCraft: true, isFeatured: true, stock: 30, rating: 4.7, reviewCount: 62, soldCount: 145, tags: ['brass', 'diya', 'diwali', 'home decor'], images: [{ url: 'https://images.unsplash.com/photo-1605627079912-97c3810a11a4?w=600', alt: 'Brass diyas' }] },

  // FOOD & SPICES
  { name: 'Premium Indian Spice Box — 7 Spices', category: 'other', region: 'other', craftType: 'food', price: 850, comparePrice: 1200, description: 'Traditional masala dabba with 7 premium whole spices: Kashmiri red chilli, turmeric, cumin, coriander, cardamom, black pepper, garam masala. 100% natural, no preservatives.', isHandmade: false, isSustainable: true, isFeatured: true, stock: 40, rating: 4.8, reviewCount: 48, soldCount: 132, tags: ['spices', 'masala', 'food', 'gift', 'cooking'], images: [{ url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600', alt: 'Indian spice box' }] },
  { name: "Grandma's Mango Pickle — 500g", category: 'other', region: 'other', craftType: 'food', price: 280, comparePrice: 400, description: 'Traditional raw mango pickle made using a 100-year-old family recipe. Sun-dried mangoes in mustard oil. No preservatives. Ships in air-tight glass jar. Lasts 12 months.', isHandmade: true, isSustainable: true, isFeatured: true, stock: 60, rating: 4.6, reviewCount: 89, soldCount: 210, tags: ['pickle', 'mango', 'food', 'traditional', 'achaar'], images: [{ url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600', alt: 'Mango pickle' }] },
  { name: 'Assorted Indian Sweets Box — 500g', category: 'other', region: 'other', craftType: 'food', price: 650, comparePrice: 900, description: 'A curated box of 6 traditional Indian sweets: Gulab Jamun, Rasgulla, Kaju Katli, Ladoo, Barfi, and Halwa. Made fresh by mithai artisans. No preservatives. Ships within 24 hours.', isHandmade: true, isFeatured: true, stock: 25, rating: 4.5, reviewCount: 34, soldCount: 78, tags: ['sweets', 'mithai', 'gift', 'ladoo', 'barfi'], images: [{ url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600', alt: 'Indian sweets' }] },
  { name: 'Kashmiri Saffron — 1 gram Premium', category: 'other', region: 'kashmir', craftType: 'food', price: 450, comparePrice: 600, description: 'Premium Grade A Kashmiri Saffron from Pampore region. GI certified. Deep red threads, strong aroma, intense golden colour. 1 gram in glass vial with authenticity seal.', isHandmade: false, isSustainable: true, giTagged: true, isFeatured: true, stock: 50, rating: 4.9, reviewCount: 76, soldCount: 190, tags: ['saffron', 'kashmir', 'spice', 'premium', 'kesar'], images: [{ url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600', alt: 'Kashmir saffron' }] },

  // BOOKS
  { name: 'The Art of Indian Weaving — Coffee Table Book', category: 'other', region: 'other', craftType: 'books', price: 1200, comparePrice: 1800, description: '280-page coffee table book documenting India\'s greatest weaving traditions. 300+ photographs, artisan interviews, historical context. Hardcover, 12x10 inches.', isHandmade: false, isSustainable: true, isFeatured: true, stock: 20, rating: 4.8, reviewCount: 22, soldCount: 45, tags: ['book', 'weaving', 'coffee table', 'gift', 'art'], images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', alt: 'Indian art book' }] },
  { name: 'Madhubani Colouring Book — 30 Designs', category: 'other', region: 'bihar', craftType: 'books', price: 350, comparePrice: 500, description: '30 authentic Madhubani designs for colouring. Designed by Mithila artists. Printed on 200 GSM paper. Great for adults and children. Cultural info about each motif included.', isHandmade: false, isSustainable: true, stock: 45, rating: 4.5, reviewCount: 38, soldCount: 92, tags: ['colouring book', 'madhubani', 'activity', 'gift', 'kids'], images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', alt: 'Madhubani colouring book' }] },
];

async function seed() {
  console.log('\n🌱 Starting Sanskriti Market seed...\n');
  const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`✅ MongoDB connected: ${conn.connection.host}`);

  const User = require('../models/User');
  const Store = require('../models/Store');
  const Product = require('../models/Product');
  const Cart = require('../models/Cart');
  const Wishlist = require('../models/Wishlist');

  await Promise.all([User.deleteMany({}), Store.deleteMany({}), Product.deleteMany({}), Cart.deleteMany({}), Wishlist.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  const admin = await User.create({ name: 'Sanskriti Admin', email: process.env.ADMIN_EMAIL || 'admin@sanskritimarket.com', password: process.env.ADMIN_PASSWORD || 'Admin@123456', role: 'admin', isVerified: true });
  await Cart.create({ user: admin._id, items: [] });
  console.log(`✅ Admin: ${admin.email}`);

  const seller = await User.create({ name: 'Priya Sharma', email: 'seller@sanskritimarket.com', password: 'Seller@123456', role: 'seller', isVerified: true });
  const store = await Store.create({ name: "Priya's Craft Studio", slug: 'priyas-craft-studio', description: 'Authentic handcrafted products from the heart of India.', tagline: 'Where every piece tells a story', owner: seller._id, location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' }, isActive: true, isVerified: true });
  seller.storeId = store._id;
  await seller.save();
  await Cart.create({ user: seller._id, items: [] });
  await Wishlist.create({ user: seller._id, products: [] });
  console.log(`✅ Seller: ${seller.email} | Store: ${store.name}`);

  const customer = await User.create({ name: 'Rahul Verma', email: 'customer@sanskritimarket.com', password: 'Customer@123456', role: 'customer' });
  await Cart.create({ user: customer._id, items: [] });
  await Wishlist.create({ user: customer._id, products: [] });
  console.log(`✅ Customer: ${customer.email}`);

  const products = await Product.insertMany(PRODUCTS.map(p => ({ ...p, seller: seller._id, store: store._id, isActive: true, isApproved: true })));
  console.log(`✅ ${products.length} products created`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SEED COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👑 Admin    → ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  console.log(`🛍️  Seller   → seller@sanskritimarket.com / Seller@123456`);
  console.log(`🛒 Customer → customer@sanskritimarket.com / Customer@123456`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
