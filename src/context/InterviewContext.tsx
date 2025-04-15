// src/context/InterviewContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type InterviewContextType = {
  currentQuestion: string;
  timer: number;
  code: string;
  evaluation: any;
  difficulty: string;
  topic: string;
  timeLimit: number;
  setCurrentQuestion: (question: string) => void;
  setTimer: (time: number) => void;
  setCode: (code: string) => void;
  setEvaluation: (evalData: any) => void;
  setDifficulty: (difficulty: string) => void;
  setTopic: (topic: string) => void;
  setTimeLimit: (time: number) => void;
};

const InterviewContext = createContext<InterviewContextType>({} as InterviewContextType);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [timer, setTimer] = useState(0);
  const [code, setCode] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('Arrays');
  const [timeLimit, setTimeLimit] = useState(30);

  return (
    <InterviewContext.Provider
      value={{
        currentQuestion,
        timer,
        code,
        evaluation,
        difficulty,
        topic,
        timeLimit,
        setCurrentQuestion,
        setTimer,
        setCode,
        setEvaluation,
        setDifficulty,
        setTopic,
        setTimeLimit
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterview = () => useContext(InterviewContext);