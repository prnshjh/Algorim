
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface DateDisplayProps {
  dateString?: string;
}

export const DateDisplay = ({ dateString }: DateDisplayProps) => {
  const formatDate = (date?: string) => {
    if (!date) return "Never";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Calendar className="h-3.5 w-3.5" />
      {formatDate(dateString)}
    </div>
  );
};
