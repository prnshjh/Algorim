import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Question,
  QuestionSheet,
  QuestionStatus,
  QuestionWithStatus,
  SheetStatistic,
  TopicStatistic,
  DailyProgress
} from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuestionsState {
  sheets: QuestionSheet[];
  questions: Record<string, Question[]>;
  userQuestionStatuses: Record<string, QuestionStatus>;
  activeSheet: string | null;
  loading: boolean;
  error: string | null;
}

interface QuestionContextType extends QuestionsState {
  setActiveSheet: (sheetId: string) => void;
  updateQuestionStatus: (questionId: string, status: QuestionStatus) => Promise<void>;
  getQuestionsWithStatus: (sheetId: string) => QuestionWithStatus[];
  getSheetStatistics: () => SheetStatistic[];
  getTopicStatistics: () => TopicStatistic[];
  getDailyProgress: () => Promise<DailyProgress[]>; // Changed to Promise<DailyProgress[]>
}

const initialState: QuestionsState = {
  sheets: [],
  questions: {},
  userQuestionStatuses: {},
  activeSheet: null,
  loading: true,
  error: null
};

const QuestionsContext = createContext<QuestionContextType>({
  ...initialState,
  setActiveSheet: () => {},
  updateQuestionStatus: async () => {},
  getQuestionsWithStatus: () => [],
  getSheetStatistics: () => [],
  getTopicStatistics: () => [],
  getDailyProgress: async () => [] // Updated to match the new return type
});

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<QuestionsState>(initialState);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        try {
          setState(prev => ({ ...prev, loading: true }));
          
          const { data: sheetsData, error: sheetsError } = await supabase
            .from('sheets')
            .select('*');
            
          if (sheetsError) {
            throw new Error(sheetsError.message);
          }
          
          const sheets: QuestionSheet[] = sheetsData.map(sheet => ({
            id: sheet.id,
            name: sheet.name,
            description: sheet.description,
            totalQuestions: sheet.total_questions
          }));
          
          const questions: Record<string, Question[]> = {};
          
          for (const sheet of sheets) {
            const { data: questionsData, error: questionsError } = await supabase
              .from('questions')
              .select('*')
              .eq('sheet_id', sheet.id);
              
            if (questionsError) {
              throw new Error(questionsError.message);
            }
            
            questions[sheet.id] = questionsData.map(q => ({
              id: q.id,
              title: q.title,
              difficulty: q.difficulty as 'Easy' | 'Medium' | 'Hard',
              url: q.url,
              topic: q.topic,
              sheetId: q.sheet_id
            }));
          }
          
          setState(prev => ({
            ...prev,
            sheets,
            questions,
            activeSheet: sheets.length > 0 ? sheets[0].id : null,
            loading: false
          }));
        } catch (error: any) {
          console.error("Error fetching data:", error);
          setState(prev => ({
            ...prev,
            loading: false,
            error: error.message || "An error occurred while fetching data"
          }));
        }
      } else {
        try {
          setState(prev => ({ ...prev, loading: true }));
          
          const { data: sheetsData, error: sheetsError } = await supabase
            .from('sheets')
            .select('*');
            
          if (sheetsError) {
            throw new Error(sheetsError.message);
          }
          
          const sheets: QuestionSheet[] = sheetsData.map(sheet => ({
            id: sheet.id,
            name: sheet.name,
            description: sheet.description,
            totalQuestions: sheet.total_questions
          }));
          
          const questions: Record<string, Question[]> = {};
          
          for (const sheet of sheets) {
            const { data: questionsData, error: questionsError } = await supabase
              .from('questions')
              .select('*')
              .eq('sheet_id', sheet.id);
              
            if (questionsError) {
              throw new Error(questionsError.message);
            }
            
            questions[sheet.id] = questionsData.map(q => ({
              id: q.id,
              title: q.title,
              difficulty: q.difficulty as 'Easy' | 'Medium' | 'Hard',
              url: q.url,
              topic: q.topic,
              sheetId: q.sheet_id
            }));
          }
          
          const userQuestionStatuses: Record<string, QuestionStatus> = {};
          
          if (user) {
            const { data: statusData, error: statusError } = await supabase
              .from('user_question_status')
              .select('*')
              .eq('user_id', user.id);
              
            if (statusError) {
              throw new Error(statusError.message);
            }
            
            statusData.forEach(status => {
              userQuestionStatuses[status.question_id] = status.status as QuestionStatus;
            });
          }
          
          setState(prev => ({
            ...prev,
            sheets,
            questions,
            userQuestionStatuses,
            activeSheet: sheets.length > 0 ? sheets[0].id : null,
            loading: false
          }));
        } catch (error: any) {
          console.error("Error fetching data:", error);
          setState(prev => ({
            ...prev,
            loading: false,
            error: error.message || "An error occurred while fetching data"
          }));
        }
      }
    };
    
    fetchData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const channel = supabase
      .channel('question-status-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_question_status',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setState(prev => {
          const newUserQuestionStatuses = { ...prev.userQuestionStatuses };
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            newUserQuestionStatuses[payload.new.question_id] = payload.new.status as QuestionStatus;
          } else if (payload.eventType === 'DELETE') {
            delete newUserQuestionStatuses[payload.old.question_id];
          }
          
          return {
            ...prev,
            userQuestionStatuses: newUserQuestionStatuses
          };
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user]);

  const setActiveSheet = (sheetId: string) => {
    setState(prev => ({ ...prev, activeSheet: sheetId }));
  };

  const updateQuestionStatus = async (questionId: string, status: QuestionStatus) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update question status",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: existingStatus } = await supabase
        .from('user_question_status')
        .select('id')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .single();
      
      if (existingStatus) {
        const { error } = await supabase
          .from('user_question_status')
          .update({ 
            status, 
            last_updated: new Date().toISOString() 
          })
          .eq('user_id', user.id)
          .eq('question_id', questionId);
          
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('user_question_status')
          .insert({
            user_id: user.id,
            question_id: questionId,
            status,
            last_updated: new Date().toISOString()
          });
          
        if (error) throw new Error(error.message);
      }
      
      setState(prev => ({
        ...prev,
        userQuestionStatuses: {
          ...prev.userQuestionStatuses,
          [questionId]: status
        }
      }));
      
      const question = Object.values(state.questions)
        .flat()
        .find(q => q.id === questionId);
      
      if (question) {
        const statusText = status === 'completed' ? 'Completed' : 
                         status === 'revision' ? 'Marked for revision' : 
                         status === 'redo' ? 'Marked to do again' : 'Added to todo';
                         
        toast({
          title: statusText,
          description: question.title,
        });
      }
    } catch (error: any) {
      console.error("Error updating question status:", error);
      toast({
        title: "Failed to update status",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const getQuestionsWithStatus = (sheetId: string): QuestionWithStatus[] => {
    const questions = state.questions[sheetId] || [];
    
    return questions.map(q => ({
      ...q,
      status: state.userQuestionStatuses[q.id] || 'todo',
      lastUpdated: new Date().toISOString()
    }));
  };

  const getSheetStatistics = (): SheetStatistic[] => {
    return state.sheets.map(sheet => {
      const questions = state.questions[sheet.id] || [];
      
      const stats = questions.reduce(
        (acc, q) => {
          const status = state.userQuestionStatuses[q.id] || 'todo';
          acc[status]++;
          return acc;
        },
        { completed: 0, revision: 0, redo: 0, todo: 0, totalQuestions: questions.length }
      );
      
      return {
        ...stats,
        sheetId: sheet.id,
        sheetName: sheet.name
      };
    });
  };

  const getTopicStatistics = (): TopicStatistic[] => {
    const allQuestions = Object.values(state.questions).flat();
    const topicMap: Record<string, { completed: number, total: number }> = {};
    
    allQuestions.forEach(q => {
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { completed: 0, total: 0 };
      }
      
      topicMap[q.topic].total++;
      
      if (state.userQuestionStatuses[q.id] === 'completed') {
        topicMap[q.topic].completed++;
      }
    });
    
    return Object.entries(topicMap).map(([topic, stats]) => ({
      topic,
      completed: stats.completed,
      total: stats.total
    }));
  };

  const getDailyProgress = async (): Promise<DailyProgress[]> => {
    if (!user) {
      return [];
    }
    
    const today = new Date();
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (13 - i));
      return date.toISOString().split('T')[0];
    });
    
    const dailyCompletedMap: Record<string, number> = {};
    
    last14Days.forEach(date => {
      dailyCompletedMap[date] = 0;
    });
    
    const completedQuestionIds = Object.entries(state.userQuestionStatuses)
      .filter(([_, status]) => status === 'completed')
      .map(([questionId]) => questionId);
    
    if (completedQuestionIds.length > 0) {
      const { data: statusDataArray, error } = await supabase
        .from('user_question_status')
        .select('question_id, last_updated')
        .in('question_id', completedQuestionIds)
        .eq('user_id', user.id);
        
      if (!error && statusDataArray) {
        statusDataArray.forEach(statusData => {
          const date = new Date(statusData.last_updated).toISOString().split('T')[0];
          
          if (dailyCompletedMap[date] !== undefined) {
            dailyCompletedMap[date]++;
          }
        });
      }
    }
    
    return last14Days.map(date => ({
      date,
      completed: dailyCompletedMap[date] || 0
    }));
  };

  return (
    <QuestionsContext.Provider
      value={{
        ...state,
        setActiveSheet,
        updateQuestionStatus,
        getQuestionsWithStatus,
        getSheetStatistics,
        getTopicStatistics,
        getDailyProgress
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => useContext(QuestionsContext);
