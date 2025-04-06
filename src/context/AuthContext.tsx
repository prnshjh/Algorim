
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent flash of unauthenticated content
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // Store intended destination when redirected to login
  const redirectPath = location.state?.from || "/questions";

  useEffect(() => {
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session);
        
        if (event === 'SIGNED_IN' && session) {
          try {
            // Using setTimeout to prevent potential deadlocks
            setTimeout(async () => {
              // Get user profile
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              const user: User = {
                id: session.user.id,
                name: profile?.name || session.user.email?.split('@')[0] || 'User',
                email: profile?.email || session.user.email || '',
                role: 'user',
                createdAt: profile?.created_at || session.user.created_at,
              };
              
              setState({
                user,
                token: session.access_token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              
              // Navigate after login if not already on the target page
              if (location.pathname === '/login' || location.pathname === '/register') {
                navigate("/questions");
              }
            }, 0);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setState(prev => ({ ...prev, isLoading: false }));
          }
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          const user: User = {
            id: session.user.id,
            name: profile?.name || session.user.email?.split('@')[0] || 'User',
            email: profile?.email || session.user.email || '',
            role: 'user',
            createdAt: profile?.created_at || session.user.created_at,
          };
          
          setState({
            user,
            token: session.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to check authentication status",
        });
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error.message 
        }));
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Success toast notification
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      // Auth state change listener will handle the rest
      // We don't set isLoading false here as that will be handled by the listener
    } catch (error: any) {
      console.error("Login error:", error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "An error occurred during login"
      }));
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error.message 
        }));
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      // The auth state change listener will handle navigation
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "An error occurred during registration"
      }));
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await supabase.auth.signOut();
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Navigate after logout
      navigate("/");
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || "An error occurred during logout"
      }));
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
