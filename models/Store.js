const mongoose = require('mongoose');
const slugify = require('slugify');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, unique: true },
    description: { type: String, maxlength: 2000 },
    tagline: { type: String, maxlength: 200 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    location: { city: String, state: String, region: String, country: { type: String, default: 'India' } },
    socialLinks: { instagram: String, facebook: String, youtube: String, website: String },
    craftTypes: [String],
    bio: { type: String, maxlength: 3000 },
    story: { type: String, maxlength: 5000 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    rating: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    returnPolicy: { type: String, default: '7-day return policy on all items.' },
    shippingPolicy: { type: String, default: 'Ships within 3-5 business days across India.' },
  },
  { timestamps: true }
);

storeSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

module.exports = mongoose.models.Store || mongoose.model('Store', storeSchema);
