import { useEffect, useState } from "react";
import { useQuestions } from "@/context/QuestionContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import { DailyProgress } from "@/types";

export function ProgressChart() {
  const { getSheetStatistics, getTopicStatistics, getDailyProgress } = useQuestions();
  const { theme } = useTheme();
  const sheetStats = getSheetStatistics();
  const topicStats = getTopicStatistics();
  
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyProgress = async () => {
      setIsLoading(true);
      try {
        const progressData = await getDailyProgress();
        setDailyProgress(progressData);
      } catch (error) {
        console.error("Error fetching daily progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyProgress();
  }, [getDailyProgress]);
  
  const sheetChartData = sheetStats.map(stat => ({
    name: stat.sheetName,
    completed: stat.completed,
    revision: stat.revision,
    redo: stat.redo,
    todo: stat.todo,
    total: stat.totalQuestions
  }));
  
  const overallStats = sheetStats.reduce(
    (acc, sheet) => {
      acc.completed += sheet.completed;
      acc.revision += sheet.revision;
      acc.redo += sheet.redo;
      acc.todo += sheet.todo;
      acc.total += sheet.totalQuestions;
      return acc;
    },
    { completed: 0, revision: 0, redo: 0, todo: 0, total: 0 }
  );
  
  const pieChartData = [
    { name: "Completed", value: overallStats.completed, color: "#10B981" },
    { name: "Revision", value: overallStats.revision, color: "#FBBF24" },
    { name: "Redo", value: overallStats.redo, color: "#EF4444" },
    { name: "Todo", value: overallStats.todo, color: theme === "dark" ? "#94A3B8" : "#64748B" }
  ].filter(item => item.value > 0);
  
  const topTopicsData = [...topicStats]
    .sort((a, b) => (b.completed / b.total) - (a.completed / a.total))
    .slice(0, 5)
    .map(topic => ({
      name: topic.topic,
      completed: topic.completed,
      remaining: topic.total - topic.completed,
      percentComplete: Math.round((topic.completed / topic.total) * 100)
    }));
  
  const axisColor = theme === "dark" ? "#e2e8f0" : "#64748b";
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all duration-300 dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              Your progress across all question sheets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-status-completed">
                  {overallStats.completed}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-status-revision">
                  {overallStats.revision}
                </div>
                <div className="text-xs text-muted-foreground">Revision</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-status-redo">
                  {overallStats.redo}
                </div>
                <div className="text-xs text-muted-foreground">Redo</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">
                  {overallStats.total}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300 dark:bg-card/80 dark:backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>
              Questions completed per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyProgress}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.getDate().toString();
                      }} 
                      stroke={axisColor}
                    />
                    <YAxis allowDecimals={false} stroke={axisColor} />
                    <Tooltip
                      formatter={(value, name) => [value, 'Questions']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString();
                      }}
                      contentStyle={{ 
                        backgroundColor: theme === "dark" ? "#1e293b" : "white",
                        borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                        color: theme === "dark" ? "white" : "black"
                      }}
                    />
                    <Bar dataKey="completed" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="hover:shadow-md transition-all duration-300 dark:bg-card/80 dark:backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sheet Progress</CardTitle>
          <CardDescription>
            Breakdown by question sheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sheetChartData} layout="vertical">
                <XAxis type="number" stroke={axisColor} />
                <YAxis type="category" dataKey="name" width={100} stroke={axisColor} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === "dark" ? "#1e293b" : "white",
                    borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                    color: theme === "dark" ? "white" : "black"
                  }}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                <Bar dataKey="revision" stackId="a" fill="#FBBF24" name="Revision" />
                <Bar dataKey="redo" stackId="a" fill="#EF4444" name="Redo" />
                <Bar dataKey="todo" stackId="a" fill={theme === "dark" ? "#94A3B8" : "#64748B"} name="Todo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all duration-300 dark:bg-card/80 dark:backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Top Topics</CardTitle>
          <CardDescription>
            Your strongest topics based on completion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTopicsData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} stroke={axisColor} />
                <YAxis type="category" dataKey="name" width={120} stroke={axisColor} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Completion Rate']}
                  contentStyle={{ 
                    backgroundColor: theme === "dark" ? "#1e293b" : "white",
                    borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                    color: theme === "dark" ? "white" : "black"
                  }}  
                />
                <Bar dataKey="percentComplete" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
