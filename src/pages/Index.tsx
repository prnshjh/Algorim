
import { Link } from "react-router-dom";
import { MainNav } from "@/components/navigation/MainNav";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutList, BarChart3 } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-3xl w-full text-center">
          <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4"> Algorim </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Track your progress, organize your practice, and master data structures and algorithms efficiently.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <Link to="/sheets" className="w-full">
              <div className="bg-card hover:bg-card/80 border rounded-lg p-6 text-center transition-all hover:shadow-md h-full flex flex-col">
                <BookOpen className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Question Sheets</h2>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Browse and select from various question collections.
                </p>
                <Button variant="outline" className="w-full">
                  View Sheets
                </Button>
              </div>
            </Link>
            
            <Link to="/questions" className="w-full">
              <div className="bg-card hover:bg-card/80 border rounded-lg p-6 text-center transition-all hover:shadow-md h-full flex flex-col">
                <LayoutList className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Practice Questions</h2>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Start solving problems and track your progress.
                </p>
                <Button variant="outline" className="w-full">
                  Start Practice
                </Button>
              </div>
            </Link>
            
            <Link to="/profile" className="w-full">
              <div className="bg-card hover:bg-card/80 border rounded-lg p-6 text-center transition-all hover:shadow-md h-full flex flex-col">
                <BarChart3 className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Analytics</h2>
                <p className="text-muted-foreground mb-6 flex-grow">
                  View your progress statistics and performance.
                </p>
                <Button variant="outline" className="w-full">
                  View Analytics
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
