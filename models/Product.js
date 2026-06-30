const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true },
    description: { type: String, required: true, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 300 },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    category: {
      type: String,
      required: true,
      enum: ['textiles', 'pottery', 'jewelry', 'woodwork', 'metalwork', 'paintings', 'home-decor', 'accessories', 'other'],
    },
    subcategory: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    images: [{ url: String, alt: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    stock: { type: Number, default: 1, min: 0 },
    sku: { type: String, default: '' },
    weight: { type: Number, default: 0 },
    dimensions: { length: Number, width: Number, height: Number },
    materials: [{ type: String }],
    origin: { type: String, default: 'India' },
    region: { type: String, default: '' },
    craftTechnique: { type: String, default: '' },
    isHandmade: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ store: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1 });

productSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
