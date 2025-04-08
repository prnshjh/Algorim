
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QuestionsProvider } from "./context/QuestionContext";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Questions from "./pages/Questions";
import Sheets from "./pages/Sheets";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DisplaySVG from "./components/ui/DisplaySVG";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <QuestionsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/sheets" element={<Sheets />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dsa" element={<DisplaySVG />} />
                <Route path="*" element={<NotFound />} />
              
              </Routes>
            </TooltipProvider>
          </QuestionsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
