import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Question,
  QuestionSheet,
  QuestionStatus,
  QuestionWithStatus,
  SheetStatistic,
  TopicStatistic,
  DailyProgress,
} from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuestionsState {
  sheets: QuestionSheet[];
  questions: Record<string, Question[]>;
  userQuestionStatuses: Record<string, { status: QuestionStatus; lastUpdated?: string }>;
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
  getDailyProgress: () => Promise<DailyProgress[]>;
}

const initialState: QuestionsState = {
  sheets: [],
  questions: {},
  userQuestionStatuses: {},
  activeSheet: null,
  loading: true,
  error: null,
};

const QuestionsContext = createContext<QuestionContextType>({
  ...initialState,
  setActiveSheet: () => {},
  updateQuestionStatus: async () => {},
  getQuestionsWithStatus: () => [],
  getSheetStatistics: () => [],
  getTopicStatistics: () => [],
  getDailyProgress: async () => [],
});

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<QuestionsState>(initialState);
  const { isAuthenticated, user } = useAuth();

  // Fetch sheets and questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));

        const { data: sheetsData, error: sheetsError } = await supabase.from("sheets").select("*");
        if (sheetsError) throw new Error(sheetsError.message);

        const sheets: QuestionSheet[] = sheetsData.map((sheet) => ({
          id: sheet.id,
          name: sheet.name,
          description: sheet.description,
          totalQuestions: sheet.total_questions,
        }));

        const questions: Record<string, Question[]> = {};
        for (const sheet of sheets) {
          const { data: questionsData, error: questionsError } = await supabase
            .from("questions")
            .select("*")
            .eq("sheet_id", sheet.id);

          if (questionsError) throw new Error(questionsError.message);

          questions[sheet.id] = questionsData.map((q) => ({
            id: q.id,
            title: q.title,
            difficulty: q.difficulty as "Easy" | "Medium" | "Hard",
            url: q.url,
            topic: q.topic,
            sheetId: q.sheet_id,
          }));
        }

        setState((prev) => ({
          ...prev,
          sheets,
          questions,
          activeSheet: prev.activeSheet || (sheets.length > 0 ? sheets[0].id : null),
          loading: false,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "An error occurred while fetching data",
        }));
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  // Fetch user question statuses (status + last_updated)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchStatuses = async () => {
      const { data, error } = await supabase
        .from("user_question_status")
        .select("question_id, status, last_updated")
        .eq("user_id", user.id);

      if (!error && data) {
        const userQuestionStatuses: Record<string, { status: QuestionStatus; lastUpdated?: string }> = {};
        data.forEach((row) => {
          userQuestionStatuses[row.question_id] = {
            status: row.status as QuestionStatus,
            lastUpdated: row.last_updated,
          };
        });
        setState((prev) => ({
          ...prev,
          userQuestionStatuses,
        }));
      }
    };

    fetchStatuses();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (state.activeSheet === null && state.sheets.length > 0) {
      setState((prev) => ({
        ...prev,
        activeSheet: state.sheets[0].id,
      }));
    }
  }, [state.activeSheet, state.sheets]);

  const setActiveSheet = (sheetId: string) => {
    setState((prev) => ({ ...prev, activeSheet: sheetId }));
  };

  // Update status and last_updated
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
      const now = new Date().toISOString();
      const { data: existingStatus } = await supabase
        .from("user_question_status")
        .select("id")
        .eq("user_id", user.id)
        .eq("question_id", questionId)
        .single();

      let lastUpdated = now;

      if (existingStatus) {
        const { data, error } = await supabase
          .from("user_question_status")
          .update({
            status,
            last_updated: now,
          })
          .eq("user_id", user.id)
          .eq("question_id", questionId)
          .select()
          .single();

        if (error) throw new Error(error.message);
        lastUpdated = data?.last_updated || now;
      } else {
        const { data, error } = await supabase
          .from("user_question_status")
          .insert({
            user_id: user.id,
            question_id: questionId,
            status,
            last_updated: now,
          })
          .select()
          .single();

        if (error) throw new Error(error.message);
        lastUpdated = data?.last_updated || now;
      }

      setState((prev) => ({
        ...prev,
        userQuestionStatuses: {
          ...prev.userQuestionStatuses,
          [questionId]: { status, lastUpdated },
        },
      }));

      const question = Object.values(state.questions)
        .flat()
        .find((q) => q.id === questionId);

      if (question) {
        const statusText =
          status === "completed"
            ? "Completed"
            : status === "revision"
            ? "Marked for revision"
            : status === "redo"
            ? "Marked to do again"
            : "Added to todo";

        toast({
          title: statusText,
          description: question.title,
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to update status",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Use lastUpdated from userQuestionStatuses
  const getQuestionsWithStatus = (sheetId: string): QuestionWithStatus[] => {
    const questions = state.questions[sheetId] || [];
    return questions.map((q) => ({
      ...q,
      status: state.userQuestionStatuses[q.id]?.status || "todo",
      lastUpdated: state.userQuestionStatuses[q.id]?.lastUpdated || null,
    }));
  };

  // Sheet statistics
  const getSheetStatistics = (): SheetStatistic[] => {
    return state.sheets.map((sheet) => {
      const questions = state.questions[sheet.id] || [];
      const stats = questions.reduce(
        (acc, q) => {
          const status = state.userQuestionStatuses[q.id]?.status || "todo";
          acc[status]++;
          return acc;
        },
        { completed: 0, revision: 0, redo: 0, todo: 0, totalQuestions: questions.length }
      );
      return {
        ...stats,
        sheetId: sheet.id,
        sheetName: sheet.name,
      };
    });
  };

  // Topic statistics
  const getTopicStatistics = (): TopicStatistic[] => {
    const allQuestions = Object.values(state.questions).flat();
    const topicMap: Record<string, { completed: number; total: number }> = {};

    allQuestions.forEach((q) => {
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { completed: 0, total: 0 };
      }
      topicMap[q.topic].total++;
      if (state.userQuestionStatuses[q.id]?.status === "completed") {
        topicMap[q.topic].completed++;
      }
    });

    return Object.entries(topicMap).map(([topic, stats]) => ({
      topic,
      completed: stats.completed,
      total: stats.total,
    }));
  };

  // Daily progress
  const getDailyProgress = async (): Promise<DailyProgress[]> => {
    if (!user) {
      return [];
    }

    const today = new Date();
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (13 - i));
      return date.toISOString().split("T")[0];
    });

    const dailyCompletedMap: Record<string, number> = {};

    last14Days.forEach((date) => {
      dailyCompletedMap[date] = 0;
    });

    const completedQuestionIds = Object.entries(state.userQuestionStatuses)
      .filter(([_, obj]) => obj.status === "completed")
      .map(([questionId]) => questionId);

    if (completedQuestionIds.length > 0) {
      const { data: statusDataArray, error } = await supabase
        .from("user_question_status")
        .select("question_id, last_updated")
        .in("question_id", completedQuestionIds)
        .eq("user_id", user.id);

      if (!error && statusDataArray) {
        statusDataArray.forEach((statusData) => {
          const date = new Date(statusData.last_updated).toISOString().split("T")[0];
          if (dailyCompletedMap[date] !== undefined) {
            dailyCompletedMap[date]++;
          }
        });
      }
    }

    return last14Days.map((date) => ({
      date,
      completed: dailyCompletedMap[date] || 0,
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
        getDailyProgress,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => useContext(QuestionsContext);