
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useQuestions } from "@/context/QuestionContext";
import { MainNav } from "@/components/navigation/MainNav";
import { QuestionList } from "@/components/questions/QuestionList";
import { Button } from "@/components/ui/button";
import { ListFilter, BookOpen, ArrowLeft } from "lucide-react";

const Questions = () => {
  const { isAuthenticated } = useAuth();
  const { activeSheet, sheets } = useQuestions();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Find the active sheet details
  const currentSheet = sheets.find(sheet => sheet.id === activeSheet);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <div className="container mx-auto py-8 px-4 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/sheets" className="text-muted-foreground hover:text-primary transition-colors">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sheets
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <ListFilter className="h-7 w-7 text-primary" />
              <span className="text-3xl font-bold text-blue-500">{currentSheet.name}</span>
            </div>
            
            {currentSheet && (
              <div className="mt-2 text-muted-foreground">
                {currentSheet.description}
              </div>
            )}
          </div>
          
          {!activeSheet && (
            <Button onClick={() => navigate("/sheets")} className="whitespace-nowrap">
              <BookOpen className="mr-2 h-4 w-4" />
              Select a Sheet
            </Button>
          )}
        </div>
        
        <div className="mt-4">
          {activeSheet ? (
            <QuestionList />
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-lg border border-border">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Sheet Selected</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Please select a question sheet to view and track your progress on questions.
              </p>
              <Button onClick={() => navigate("/sheets")}>
                Go to Sheets
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
