
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { MainNav } from "@/components/navigation/MainNav";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only redirect if authenticated and not in the process of loading
    if (isAuthenticated && !isLoading) {
      navigate("/questions");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <MainNav />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fadeIn">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient">
              Welcome Back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to track your DSA progress
            </p>
          </div>
          
          <div className="glass-card p-1 rounded-xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
