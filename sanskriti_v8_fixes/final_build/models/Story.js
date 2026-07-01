const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    title: { type: String, required: true, maxlength: 200 },
    artisan: {
      name: { type: String, required: true },
      photo: String,
      bio: String,
      yearsOfExperience: Number,
      location: String,
    },
    origin: {
      region: String,
      state: String,
      heritage: String,
      technique: String,
      materials: [String],
    },
    narrative: { type: String, required: true, maxlength: 10000 },
    timeline: [{
      year: String,
      event: String,
    }],
    gallery: [{ url: String, caption: String }],
    culturalSignificance: String,
    sustainability: String,
    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
