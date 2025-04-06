
import { QuestionWithStatus, QuestionStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuestionStatusMenu } from "./QuestionStatusMenu";
import { DifficultyBadge } from "./DifficultyBadge";
import { DateDisplay } from "./DateDisplay";

interface QuestionTableProps {
  questions: QuestionWithStatus[];
  updateQuestionStatus: (questionId: string, status: QuestionStatus) => Promise<void>;
}

export const QuestionTable = ({ questions, updateQuestionStatus }: QuestionTableProps) => {
  return (
    <div className="rounded-md shadow-sm border overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Status</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="w-[120px]">Difficulty</TableHead>
            <TableHead className="w-[150px]">Topic</TableHead>
            <TableHead className="w-[120px]">Last Practiced</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
                No questions match your filters
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => (
              <TableRow key={question.id} className="hover:bg-muted/50">
                <TableCell>
                  <QuestionStatusMenu 
                    questionId={question.id}
                    status={question.status}
                    updateQuestionStatus={updateQuestionStatus}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{question.title}</div>
                </TableCell>
                <TableCell>
                  <DifficultyBadge difficulty={question.difficulty} />
                </TableCell>
                <TableCell className="text-muted-foreground">{question.topic}</TableCell>
                <TableCell className="text-muted-foreground">
                  <DateDisplay dateString={question.lastUpdated} />
                </TableCell>
                <TableCell className="text-right">
                  <a 
                    href={question.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 inline-flex items-center"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-3 w-3" />
                      Solve
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
