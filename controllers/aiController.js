const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured.');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const heritageGuide = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return errorResponse(res, 400, 'Message is required.');
    const model = getModel();
    const prompt = `You are a knowledgeable Indian craft heritage expert for Sanskriti Market — an authentic Indian artisan marketplace. Answer questions about Indian crafts, food, spices, textiles, jewelry, art, culture, and traditions. Keep answers warm, engaging, and under 200 words. Always mention cultural significance. User question: ${message}`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Response generated.', { response: result.response.text() });
  } catch (error) {
    console.error('[AI Error]', error.message);
    return errorResponse(res, 500, 'AI service temporarily unavailable. Please try again.');
  }
};

const giftFinder = async (req, res) => {
  try {
    const { budget, occasion, recipient, preferences } = req.body;
    const model = getModel();
    const products = await Product.find({ isActive: true, isApproved: true, ...(budget ? { price: { $lte: parseInt(budget) } } : {}) }).select('name price category region craftType').limit(20);
    const prompt = `You are a gift expert for Sanskriti Market. Recommend 3-4 gifts from this list:\n${products.map(p => `• ${p.name} (₹${p.price})`).join('\n')}\nBudget: ₹${budget||'any'}, Occasion: ${occasion||'general'}, Recipient: ${recipient||'someone special'}. Be warm and culturally informative. Under 200 words.`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Recommendations ready.', { response: result.response.text(), products: products.slice(0, 4) });
  } catch (error) {
    return errorResponse(res, 500, 'AI service temporarily unavailable.');
  }
};

const generateProductDescription = async (req, res) => {
  try {
    const { name, category, region, craftType, price } = req.body;
    if (!name) return errorResponse(res, 400, 'Product name required.');
    const model = getModel();
    const prompt = `Write a 3-sentence product description for "${name}" — a ${craftType||'traditional'} craft from ${region||'India'}. Price ₹${price||'premium'}. Highlight cultural heritage, craftsmanship, and uniqueness. Under 100 words.`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Description generated.', { description: result.response.text() });
  } catch (error) {
    return errorResponse(res, 500, 'AI service temporarily unavailable.');
  }
};

module.exports = { heritageGuide, giftFinder, generateProductDescription };
