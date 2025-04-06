
import { useQuestions } from "@/context/QuestionContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, LayoutList } from "lucide-react";

interface SheetSelectorProps {
  isStandalone?: boolean;
}

export function SheetSelector({ isStandalone = false }: SheetSelectorProps) {
  const { sheets, activeSheet, setActiveSheet, getSheetStatistics } = useQuestions();
  const navigate = useNavigate();
  const statistics = getSheetStatistics();
  
  const handleSelectSheet = (sheetId: string) => {
    setActiveSheet(sheetId);
    if (isStandalone) {
      navigate("/questions");
    }
  };
  
  return (
    <div className="space-y-6">
      {!isStandalone && (
        <h2 className="text-xl font-semibold mb-4">Question Sheets</h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sheets.map((sheet) => {
          const stats = statistics.find(s => s.sheetId === sheet.id);
          const completedPercentage = stats 
            ? Math.round((stats.completed / stats.totalQuestions) * 100) 
            : 0;
          
          return (
            <Card 
              key={sheet.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                activeSheet === sheet.id ? 'border-primary border-2' : ''
              }`}
              onClick={() => handleSelectSheet(sheet.id)}
            >
              <div className="flex flex-col h-full">
                <h3 className="font-medium text-xl">{sheet.name}</h3>
                <p className="text-muted-foreground mt-2 mb-6">{sheet.description}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{completedPercentage}%</span>
                  </div>
                  <Progress value={completedPercentage} className="h-2" />
                  
                  <div className="grid grid-cols-4 gap-2 mt-6 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-status-completed/10 rounded-full p-1.5 mb-1">
                        <CheckCircle className="h-5 w-5 text-status-completed" />
                      </div>
                      <div className="font-medium">{stats?.completed || 0}</div>
                      <div className="text-xs text-muted-foreground">Done</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-status-revision/10 rounded-full p-1.5 mb-1">
                        <Clock className="h-5 w-5 text-status-revision" />
                      </div>
                      <div className="font-medium">{stats?.revision || 0}</div>
                      <div className="text-xs text-muted-foreground">Revise</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-status-redo/10 rounded-full p-1.5 mb-1">
                        <AlertCircle className="h-5 w-5 text-status-redo" />
                      </div>
                      <div className="font-medium">{stats?.redo || 0}</div>
                      <div className="text-xs text-muted-foreground">Redo</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-muted rounded-full p-1.5 mb-1">
                        <LayoutList className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="font-medium">{stats?.todo || 0}</div>
                      <div className="text-xs text-muted-foreground">Todo</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant={activeSheet === sheet.id ? "default" : "outline"} 
                  className="w-full mt-6 font-medium"
                  onClick={() => handleSelectSheet(sheet.id)}
                >
                  {activeSheet === sheet.id 
                    ? isStandalone 
                      ? "View Questions"
                      : "Currently Selected" 
                    : isStandalone 
                      ? "Start Practicing"
                      : "Select Sheet"
                  }
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
