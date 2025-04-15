// src/hooks/useInterviewFlow.ts
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMENI_AI_API);

export const useInterviewFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuestions = async (topic: string, difficulty: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const prompt = `Generate a ${difficulty.toLowerCase()} difficulty coding interview question about ${topic}. 
        Return only the question text with no additional formatting or explanation.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return [response.text()];
    } catch (err) {
      setError('Failed to generate question. Please try again.');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

 // Update in src/hooks/useInterviewFlow.ts
const submitSolution = async (question: string, code: string) => {
    try {
      setIsLoading(true);
      setError('');
  
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const prompt = `Act as a senior coding interview expert. Evaluate this solution:
      
      Question: ${question}
      Code: ${code}
      
      Provide JSON response with these EXACT keys:
      {
        "correctness": 0-100,
        "timeComplexity": "Big O notation",
        "spaceComplexity": "Big O notation", 
        "feedback": "concise technical analysis"
      }
      
      Rules:
      1. Return ONLY valid JSON without markdown
      2. No extra text outside JSON
      3. Use double quotes for strings
      4. Escape special characters
      5. Validate time/space complexity strictly`;
  
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean Gemini response
      const cleaned = text.replace(/```json/g, '')
                         .replace(/```/g, '')
                         .trim();
      
      return JSON.parse(cleaned);
    } catch (err) {
      console.error('Evaluation error:', err);
      setError('Failed to evaluate. Please check your code syntax and try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateQuestions, submitSolution, isLoading, error };
};