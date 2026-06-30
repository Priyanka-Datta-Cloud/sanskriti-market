module.exports = {
  secret: process.env.JWT_SECRET || 'fallback_dev_secret_change_me',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
