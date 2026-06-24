const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true },
    description: { type: String, required: true, maxlength: 3000 },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['textiles', 'pottery', 'jewelry', 'paintings', 'sculptures', 'woodwork', 'metalwork', 'leather', 'home-decor', 'toys', 'accessories', 'other'],
    },
    region: {
      type: String,
      enum: ['rajasthan', 'kashmir', 'gujarat', 'west-bengal', 'tamil-nadu', 'odisha', 'uttar-pradesh', 'bihar', 'maharashtra', 'kerala', 'punjab', 'himachal-pradesh', 'other'],
    },
    craftType: { type: String },
    images: [{
      url: { type: String, required: true },
      publicId: String,
      alt: String,
    }],
    stock: { type: Number, default: 10, min: 0 },
    sku: { type: String },
    tags: [String],
    isHandmade: { type: Boolean, default: true },
    isSustainable: { type: Boolean, default: false },
    isHeritageCraft: { type: Boolean, default: false },
    giTagged: { type: Boolean, default: false },
    materials: [String],
    dimensions: { length: Number, width: Number, height: Number, unit: { type: String, default: 'cm' } },
    weight: { value: Number, unit: { type: String, default: 'g' } },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', tags: 'text', craftType: 'text' });
productSchema.index({ category: 1, region: 1, price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
