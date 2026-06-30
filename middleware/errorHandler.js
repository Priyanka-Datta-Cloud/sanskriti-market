const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 400, messages.join(', '));
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 400, `${field} already exists.`);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 400, 'Invalid ID format.');
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid token.');
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Token expired.');
  }

  return errorResponse(res, err.statusCode || 500, err.message || 'Internal server error.');
};

const notFound = (req, res) => {
  return errorResponse(res, 404, `Route not found: ${req.originalUrl}`);
};

module.exports = { errorHandler, notFound };
