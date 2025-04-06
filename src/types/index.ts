
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type QuestionStatus = 'completed' | 'revision' | 'redo' | 'todo';

export interface QuestionSheet {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
}

export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  topic: string;
  sheetId: string;
}

export interface UserQuestion {
  userId: string;
  questionId: string;
  status: QuestionStatus;
  lastUpdated: string;
  notes?: string;
}

export interface QuestionWithStatus extends Question {
  status: QuestionStatus;
  lastUpdated?: string;
  notes?: string;
}

export interface Statistic {
  completed: number;
  revision: number;
  redo: number;
  todo: number;
  totalQuestions: number;
}

export interface SheetStatistic extends Statistic {
  sheetId: string;
  sheetName: string;
}

export interface TopicStatistic {
  topic: string;
  completed: number;
  total: number;
}

export interface DailyProgress {
  date: string;
  completed: number;
}
