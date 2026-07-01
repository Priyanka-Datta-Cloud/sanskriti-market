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
    if (!message || !message.trim()) {
      return errorResponse(res, 400, 'Message is required.');
    }
    const model = getModel();
    const prompt = `You are a knowledgeable Indian craft heritage expert for Sanskriti Market. Answer questions about Indian crafts, food, spices, textiles, jewelry, art, culture and traditions. Keep answers warm and under 200 words. User question: ${message}`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Response generated.', {
      response: result.response.text()
    });
  } catch (error) {
    console.error('[AI heritageGuide Error]', error.message);
    return errorResponse(res, 500, 'AI service temporarily unavailable.');
  }
};

const giftFinder = async (req, res) => {
  try {
    const { budget, occasion, recipient } = req.body;
    const model = getModel();
    const prompt = `You are a gift expert for Sanskriti Market. Recommend 3 Indian craft gifts. Budget: Rs${budget || 'any'}, Occasion: ${occasion || 'general'}, For: ${recipient || 'someone'}. Under 200 words.`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Recommendations ready.', {
      response: result.response.text()
    });
  } catch (error) {
    console.error('[AI giftFinder Error]', error.message);
    return errorResponse(res, 500, 'AI service temporarily unavailable.');
  }
};

const generateProductDescription = async (req, res) => {
  try {
    const { name, region, craftType, price } = req.body;
    if (!name) return errorResponse(res, 400, 'Product name required.');
    const model = getModel();
    const prompt = `Write a 3-sentence product description for "${name}" — a ${craftType || 'traditional'} craft from ${region || 'India'}. Price Rs${price || 'premium'}. Highlight heritage and craftsmanship. Under 100 words.`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Description generated.', {
      description: result.response.text()
    });
  } catch (error) {
    console.error('[AI generateProductDescription Error]', error.message);
    return errorResponse(res, 500, 'AI service temporarily unavailable.');
  }
};

module.exports = { heritageGuide, giftFinder, generateProductDescription };