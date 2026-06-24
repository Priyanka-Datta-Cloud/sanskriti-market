const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const Store = require('../models/Store');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const jwtConfig = require('../config/jwt');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (id) => jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return errorResponse(res, 400, 'Email already registered.');
    const validRoles = ['customer', 'seller'];
    const userRole = validRoles.includes(role) ? role : 'customer';
    const user = await User.create({ name, email, password, role: userRole });
    if (userRole === 'seller') {
      const store = await Store.create({
        name: `${name}'s Craft Studio`,
        description: 'Handcrafted treasures from the heart of India.',
        tagline: 'Artisan creations with soul.',
        owner: user._id,
        location: { country: 'India' },
      });
      user.storeId = store._id;
      await user.save();
    }
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, products: [] });
    await sendWelcomeEmail(user);
    const token = generateToken(user._id);
    res.cookie('token', token, jwtConfig.cookieOptions);
    return successResponse(res, 201, 'Registration successful.', { user: user.toPublicJSON(), token });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return errorResponse(res, 401, 'Invalid email or password.');
    if (!user.isActive) return errorResponse(res, 403, 'Account deactivated.');
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id);
    res.cookie('token', token, jwtConfig.cookieOptions);
    return successResponse(res, 200, 'Login successful.', { user: user.toPublicJSON(), token });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const logout = async (req, res) => {
  res.cookie('token', '', { ...jwtConfig.cookieOptions, maxAge: 0 });
  return successResponse(res, 200, 'Logged out successfully.');
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('storeId', 'name slug logo');
    return successResponse(res, 200, 'Profile retrieved.', { user: user.toPublicJSON() });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'address'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    if (req.file) req.user.avatar = req.file.path;
    await req.user.save();
    return successResponse(res, 200, 'Profile updated.', { user: req.user.toPublicJSON() });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return successResponse(res, 200, 'If that email exists, a reset link has been sent.');
    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    await sendPasswordResetEmail(user, rawToken);
    return successResponse(res, 200, 'If that email exists, a reset link has been sent.');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');
    if (!user) return errorResponse(res, 400, 'Token is invalid or has expired.');
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = generateToken(user._id);
    return successResponse(res, 200, 'Password reset successful.', { token });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];
const loginValidation = [
  body('email').isEmail().withMessage('Valid email required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

module.exports = { register, login, logout, getMe, updateProfile, forgotPassword, resetPassword, registerValidation, loginValidation };
