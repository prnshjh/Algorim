
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MainNav } from "@/components/navigation/MainNav";
import { ProgressChart } from "@/components/analytics/ProgressChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuestions } from "@/context/QuestionContext";

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const { getSheetStatistics } = useQuestions();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  const sheetStats = getSheetStatistics();
  
  // Calculate overall stats
  const overallStats = sheetStats.reduce(
    (acc, sheet) => {
      acc.completed += sheet.completed;
      acc.total += sheet.totalQuestions;
      return acc;
    },
    { completed: 0, total: 0 }
  );
  
  const completionPercentage = overallStats.total > 0 
    ? Math.round((overallStats.completed / overallStats.total) * 100) 
    : 0;
  
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-background">
      <MainNav />
      <div className="container mx-auto py-8 px-4 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
            Analytics Dashboard
          </h1>
          {user && (
            <div className="mt-2 md:mt-0 text-muted-foreground">
              Welcome, <span className="font-semibold">{user.name}</span>
            </div>
          )}
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-all duration-300 border-t-4 border-t-status-completed dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardDescription>Overall Completion</CardDescription>
              <CardTitle className="text-3xl">{completionPercentage}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {overallStats.completed} of {overallStats.total} questions
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-300 border-t-4 border-t-primary dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardDescription>Sheets</CardDescription>
              <CardTitle className="text-3xl">{sheetStats.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Active question sheets
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-300 border-t-4 border-t-status-completed dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardDescription>Questions Completed</CardDescription>
              <CardTitle className="text-3xl">{overallStats.completed}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Across all sheets
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-300 border-t-4 border-t-status-revision dark:bg-card/80 dark:backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardDescription>Questions Remaining</CardDescription>
              <CardTitle className="text-3xl">{overallStats.total - overallStats.completed}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Left to complete
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <ProgressChart />
      </div>
    </div>
  );
};

export default Profile;
