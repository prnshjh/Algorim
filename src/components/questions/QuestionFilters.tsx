
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { QuestionStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFiltersProps {
  topics: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: QuestionStatus | "all") => void;
  onTopicChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
}

export const QuestionFilters = ({
  topics,
  onSearchChange,
  onStatusChange,
  onTopicChange,
  onDifficultyChange,
}: QuestionFiltersProps) => {
  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <Input
            placeholder="Search questions..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <Select
            defaultValue="all"
            onValueChange={(value) => onStatusChange(value as QuestionStatus | "all")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="revision">Needs Revision</SelectItem>
              <SelectItem value="redo">Needs to Do Again</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            defaultValue="all"
            onValueChange={onTopicChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            defaultValue="all"
            onValueChange={onDifficultyChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
