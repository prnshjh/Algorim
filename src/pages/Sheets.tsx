
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MainNav } from "@/components/navigation/MainNav";
import { SheetSelector } from "@/components/questions/SheetSelector";

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
        
        <div className="mt-6">
          <SheetSelector isStandalone={true} />
        </div>
      </div>
    </div>
  );
};

export default Sheets;
