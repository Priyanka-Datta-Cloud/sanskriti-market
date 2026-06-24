const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set.');
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const heritageGuide = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return errorResponse(res, 400, 'Message is required.');
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a knowledgeable Indian craft heritage expert for Sanskriti Market — an Indian artisan marketplace. Answer questions about Indian crafts, textiles, art forms, and traditions warmly and engagingly. Always mention the cultural significance, region of origin, and techniques. Keep answers under 200 words. If the question is not about Indian crafts or culture, politely redirect.\n\nUser: ${message}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return successResponse(res, 200, 'AI response.', { response });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const giftFinder = async (req, res) => {
  try {
    const { budget, occasion, recipient, preferences } = req.body;
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const products = await Product.find({ isActive: true, isApproved: true, price: { $lte: budget || 5000 } })
      .select('name price category region craftType description').limit(20);

    const prompt = `You are a gift recommendation expert for Sanskriti Market, an Indian handcraft marketplace. 
Budget: ₹${budget || 'any'}
Occasion: ${occasion || 'general'}
Recipient: ${recipient || 'someone special'}
Preferences: ${preferences || 'authentic Indian crafts'}

Available products from our catalog:
${products.map(p => `- ${p.name} (₹${p.price}) — ${p.category} from ${p.region || 'India'}`).join('\n')}

Recommend 3-4 perfect gifts from this list with brief, warm explanations of why each is perfect. Format as a friendly, enthusiastic recommendation.`;

    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Gift recommendations.', {
      response: result.response.text(),
      products: products.slice(0, 4),
    });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

const generateProductDescription = async (req, res) => {
  try {
    const { name, category, region, craftType, materials, price } = req.body;
    if (!name) return errorResponse(res, 400, 'Product name is required.');
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Write a compelling product description for an Indian handcraft marketplace called Sanskriti Market.
Product: ${name}
Category: ${category || 'handcraft'}
Region: ${region || 'India'}
Craft type: ${craftType || 'traditional'}
Materials: ${materials || 'natural materials'}
Price: ₹${price || 'premium'}

Write 3-4 sentences that highlight the cultural heritage, craftsmanship, and uniqueness. Make buyers feel connected to the artisan story. Do NOT use generic phrases. Focus on what makes this specific craft special.`;
    const result = await model.generateContent(prompt);
    return successResponse(res, 200, 'Description generated.', { description: result.response.text() });
  } catch (error) { return errorResponse(res, 500, error.message); }
};

module.exports = { heritageGuide, giftFinder, generateProductDescription };
