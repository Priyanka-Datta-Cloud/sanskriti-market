const { GoogleGenerativeAI } = require('@google/generative-ai');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const heritageGuide = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) return errorResponse(res, 400, 'Message is required.');

    const model = getModel();
    const prompt = `You are a helpful customer support and heritage expert for Sanskriti Market — an authentic Indian artisan marketplace that sells handcrafted Indian products, spices, food, and books.

Answer customer questions about:
- Product authenticity (how to verify, GI tags, certifications)
- Indian crafts (Madhubani, Pashmina, Warli, Bandhani, Blue Pottery, Banarasi Silk, Dokra, Channapatna, Chikankari)
- Indian food, spices (saffron, masalas), chutneys, pickles, sweets
- Shipping (we ship worldwide, 5-7 days India, 10-15 days international)
- Returns (7-day easy returns for undamaged items)
- Payments (COD available, secure online payment)
- How to sell on Sanskriti Market (register as seller, add products, get verified)
- Gift recommendations
- Care instructions for products
- Cultural significance of crafts

Policy information:
- Free shipping above Rs 2000
- 7-day return policy
- All products verified by our team
- GI certified products marked with GI Tag badge
- Sellers can register free at /register.html

Be warm, helpful, and specific. Answer in under 180 words. If asked something unrelated to Indian products or this marketplace, politely redirect.

Customer question: ${message}`;

    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Response generated.', { response: result.response.text() });
  } catch (error) {
    console.error('[AI Error]', error.message);
    return errorResponse(res, 500, 'AI service temporarily unavailable. Please try again shortly.');
  }
};

const giftFinder = async (req, res) => {
  try {
    const { budget, occasion, recipient } = req.body;
    const model = getModel();
    const prompt = `You are a gift expert for Sanskriti Market. Suggest 3 authentic Indian gift ideas. Budget: Rs${budget || 'any'}, Occasion: ${occasion || 'general'}, For: ${recipient || 'someone special'}. Include estimated prices and why each is a great gift. Under 200 words.`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Gift recommendations ready.', { response: result.response.text() });
  } catch (error) {
    return errorResponse(res, 500, 'AI service temporarily unavailable.');
  }
};

const generateProductDescription = async (req, res) => {
  try {
    const { name, region, craftType, price } = req.body;
    if (!name) return errorResponse(res, 400, 'Product name required.');
    const model = getModel();
    const prompt = `Write a compelling 3-sentence product description for "${name}" — a ${craftType || 'traditional'} craft from ${region || 'India'}. Price Rs${price || 'premium'}. Highlight cultural heritage, craftsmanship technique, and uniqueness. Under 100 words.`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Description generated.', { description: result.response.text() });
  } catch (error) {
    return errorResponse(res, 500, 'AI service temporarily unavailable.');
  }
};

module.exports = { heritageGuide, giftFinder, generateProductDescription };
