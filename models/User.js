const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: {
      street: String, city: String, state: String,
      pincode: String, country: { type: String, default: 'India' },
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    browsingHistory: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      viewedAt: { type: Date, default: Date.now },
    }],
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  return rawToken;
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id, name: this.name, email: this.email,
    role: this.role, avatar: this.avatar, phone: this.phone,
    address: this.address, storeId: this.storeId, createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
