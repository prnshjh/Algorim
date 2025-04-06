
import { QuestionStatus } from "@/types";
import { CheckCircle, Clock, AlertCircle, Circle } from "lucide-react";

interface StatusIconProps {
  status: QuestionStatus;
}

export const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-status-completed" />;
    case "revision":
      return <Clock className="h-5 w-5 text-status-revision" />;
    case "redo":
      return <AlertCircle className="h-5 w-5 text-status-redo" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
};
