const { cloudinary } = require('../config/cloudinary');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 400, 'No images uploaded.');
    }
    const images = req.files.map((file, i) => ({
      url: file.path,
      publicId: file.filename,
      alt: req.body.alt || `Product image ${i + 1}`,
    }));
    return successResponse(res, 200, 'Images uploaded.', { images });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return errorResponse(res, 400, 'publicId is required.');
    await cloudinary.uploader.destroy(publicId);
    return successResponse(res, 200, 'Image deleted.');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { uploadProductImages, deleteImage };
