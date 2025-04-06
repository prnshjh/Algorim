
import { QuestionStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIcon } from "./StatusIcon";

interface QuestionStatusMenuProps {
  questionId: string;
  status: QuestionStatus;
  updateQuestionStatus: (questionId: string, status: QuestionStatus) => Promise<void>;
}

export const QuestionStatusMenu = ({ 
  questionId, 
  status, 
  updateQuestionStatus 
}: QuestionStatusMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <StatusIcon status={status} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => updateQuestionStatus(questionId, "completed")}>
          <CheckCircle className="mr-2 h-4 w-4 text-status-completed" />
          <span>Completed</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateQuestionStatus(questionId, "revision")}>
          <Clock className="mr-2 h-4 w-4 text-status-revision" />
          <span>Needs Revision</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateQuestionStatus(questionId, "redo")}>
          <AlertCircle className="mr-2 h-4 w-4 text-status-redo" />
          <span>Do Again</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateQuestionStatus(questionId, "todo")}>
          <Circle className="mr-2 h-4 w-4" />
          <span>Todo</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
