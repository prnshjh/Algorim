
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MainNav } from "@/components/navigation/MainNav";
import { SheetSelector } from "@/components/questions/SheetSelector";
import { BookOpen } from "lucide-react";

const Sheets = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <div className="container mx-auto py-8 px-4 animate-fadeIn">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Question Sheets</h1>
        </div>
        
        <p className="mb-8 text-muted-foreground max-w-3xl">
          Select a question sheet to start tracking your progress. Each sheet contains a collection of data structure and algorithm questions organized by topic and difficulty.
        </p>
        
        <div className="mt-6">
          <SheetSelector isStandalone={true} />
        </div>
      </div>
    </div>
  );
};

export default Sheets;
