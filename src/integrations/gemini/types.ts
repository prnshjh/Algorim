// src/integrations/gemini/types.ts
export interface EvaluationResult {
    correctness: number;
    timeComplexity: string;
    spaceComplexity: string;
    feedback: string;
    suggestions: string[];
  }
  
  export interface InterviewQuestion {
    question: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    sampleInput?: string;
    sampleOutput?: string;
  }