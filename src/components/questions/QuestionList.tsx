
import { useState } from "react";
import { useQuestions } from "@/context/QuestionContext";
import { QuestionStatus } from "@/types";
import { QuestionFilters } from "./QuestionFilters";
import { QuestionTable } from "./QuestionTable";

export function QuestionList() {
  const { activeSheet, getQuestionsWithStatus, updateQuestionStatus } = useQuestions();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | "all">("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  
  if (!activeSheet) {
    return null;
  }
  
  const questions = getQuestionsWithStatus(activeSheet);
  
  // Get unique topics
  const topics = Array.from(new Set(questions.map(q => q.topic)));
  
  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesTopic = topicFilter === "all" || q.topic === topicFilter;
    const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesTopic && matchesDifficulty;
  });
  
  return (
    <div className="space-y-6">
      <QuestionFilters
        topics={topics}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onTopicChange={setTopicFilter}
        onDifficultyChange={setDifficultyFilter}
      />
      
      <QuestionTable 
        questions={filteredQuestions} 
        updateQuestionStatus={updateQuestionStatus} 
      />
    </div>
  );
}
