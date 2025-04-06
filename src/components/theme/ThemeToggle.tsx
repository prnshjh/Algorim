
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="relative h-9 w-9 rounded-full border-muted bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ${theme === 'dark' ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100'}`} />
              <Moon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-100 rotate-0 scale-100'}`} />
            </div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Switch to {theme === "dark" ? "light" : "dark"} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
