const { GoogleGenerativeAI } = require('@google/generative-ai');
const geminiConfig = require('../config/gemini');

let genAI = null;

const getClient = () => {
  if (!geminiConfig.apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
  }
  return genAI;
};

const chat = async (message, history = []) => {
  const client = getClient();
  if (!client) {
    return {
      reply: "Namaste! I'm Sanskriti Market's assistant. I'm currently offline, but you can browse our handcrafted treasures in textiles, pottery, jewelry, and more. How may I help you discover Indian craftsmanship today?",
      offline: true,
    };
  }

  try {
    const model = client.getGenerativeModel({ model: geminiConfig.model });
    const chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: geminiConfig.chatSystemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am ready to assist customers of Sanskriti Market.' }] },
        ...history.map((h) => ({
          role: h.role,
          parts: [{ text: h.content }],
        })),
      ],
    });

    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();
    return { reply, offline: false };
  } catch (error) {
    console.error('Gemini chat error:', error.message);
    return {
      reply: "I apologize, I'm having trouble connecting right now. Please try again or browse our curated collection of handcrafted Indian products.",
      offline: true,
      error: error.message,
    };
  }
};

const generateRecommendations = async (userContext) => {
  const client = getClient();
  if (!client) {
    return getFallbackRecommendations(userContext);
  }

  try {
    const model = client.getGenerativeModel({ model: geminiConfig.model });
    const prompt = `${geminiConfig.recommendationPrompt}\n\nUser context: ${JSON.stringify(userContext)}\n\nRespond with ONLY a valid JSON array, no markdown.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    const recommendations = JSON.parse(text);
    return { recommendations, aiPowered: true };
  } catch (error) {
    console.error('Gemini recommendation error:', error.message);
    return getFallbackRecommendations(userContext);
  }
};

const getFallbackRecommendations = (userContext) => {
  const categories = userContext?.preferredCategories || ['textiles', 'pottery', 'jewelry'];
  const recommendations = categories.slice(0, 3).map((cat, i) => ({
    name: `Handcrafted ${cat.charAt(0).toUpperCase() + cat.slice(1)} Collection`,
    category: cat,
    reason: `Based on your interest in ${cat}`,
    priceRange: '₹500 - ₹5,000',
    priority: i + 1,
  }));
  return { recommendations, aiPowered: false };
};

const generateProductStory = async (productData) => {
  const client = getClient();
  if (!client) {
    return {
      narrative: `This exquisite ${productData.name} is handcrafted by skilled artisans in ${productData.region || 'India'}, using traditional ${productData.craftTechnique || 'techniques'} passed down through generations. Each piece tells a story of cultural heritage and meticulous craftsmanship.`,
      offline: true,
    };
  }

  try {
    const model = client.getGenerativeModel({ model: geminiConfig.model });
    const prompt = `Write a compelling product story (200-300 words) for this handcrafted Indian product:
Name: ${productData.name}
Category: ${productData.category}
Materials: ${(productData.materials || []).join(', ')}
Region: ${productData.region || 'India'}
Technique: ${productData.craftTechnique || 'traditional handcraft'}
Make it emotional, culturally rich, and suitable for a luxury marketplace.`;
    const result = await model.generateContent(prompt);
    return { narrative: result.response.text(), offline: false };
  } catch (error) {
    return {
      narrative: `Discover the artistry behind ${productData.name} — a testament to India's rich craft heritage.`,
      offline: true,
    };
  }
};

module.exports = { chat, generateRecommendations, generateProductStory };
