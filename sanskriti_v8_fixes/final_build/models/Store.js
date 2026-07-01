const mongoose = require('mongoose');
const slugify = require('slugify');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, unique: true },
    description: { type: String, maxlength: 2000 },
    tagline: { type: String, maxlength: 200 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    location: {
      city: String,
      state: String,
      region: String,
      country: { type: String, default: 'India' },
    },
    craftSpecialty: [{ type: String }],
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    establishedYear: Number,
    story: String,
    policies: {
      shipping: String,
      returns: String,
    },
  },
  { timestamps: true }
);

storeSchema.index({ name: 'text', description: 'text' });
storeSchema.index({ slug: 1 });

storeSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Store', storeSchema);
