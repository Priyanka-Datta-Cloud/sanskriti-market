const successResponse = (res, statusCode, message, data = {}) =>
  res.status(statusCode).json({ success: true, message, ...data });

const errorResponse = (res, statusCode, message, errors = null) =>
  res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });

const paginatedResponse = (res, data, page, limit, total, extras = {}) =>
  res.status(200).json({
    success: true, data, page, limit, total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
    ...extras,
  });

module.exports = { successResponse, errorResponse, paginatedResponse };
