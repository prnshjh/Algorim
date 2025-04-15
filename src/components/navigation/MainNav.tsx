
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { BarChart3, BookOpen, LogOut, User, LayoutList, ClipboardCheck, MessageCircleCode, Code } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";



export function MainNav() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b shadow-sm dark:border-border dark:bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <Code className="h-7 w-7 mr-2 text-primary" />
            <span className="font-bold text-lg"> Algorim </span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/sheets"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${isActive("/sheets") ? "text-primary" : "text-foreground/70"
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                Sheets
              </Link>
              <Link
                to="/questions"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${isActive("/questions") ? "text-primary" : "text-foreground/70"
                  }`}
              >
                <LayoutList className="h-4 w-4" />
                Questions
              </Link>
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${isActive("/profile") ? "text-primary" : "text-foreground/70"
                  }`}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>

              <Link
                to="/interview"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                  isActive("/interview") ? "text-primary" : "text-foreground/70"
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                Mock Interview
              </Link>

              

              <Link
                to="/askai"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${isActive("/askai") ? "text-primary" : "text-foreground/70"
                  }`}
              >
                <MessageCircleCode className="h-4 w-4" />
                AskAI
              </Link>


            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>

              <Link to="/profile">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-2 hover:bg-primary/5"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-medium">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="font-medium">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
