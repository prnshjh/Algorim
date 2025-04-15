// src/integrations/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMENI_AI_API);

export const evaluateCode = async (question: string, code: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `Evaluate this code solution for the question: ${question}\n\nCode:\n${code}\n\nProvide feedback on correctness, time complexity, space complexity, and suggestions for improvement. Format as JSON.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};