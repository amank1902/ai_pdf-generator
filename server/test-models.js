const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    
    const models = await genAI.listModels();
    
    console.log('Available models that support generateContent:\n');
    
    for await (const model of models) {
      if (model.supportedGenerationMethods.includes('generateContent')) {
        console.log('✓', model.name);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
