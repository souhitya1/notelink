
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useUIStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { BookText, Brain, LogIn, UserPlus } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode } = useUIStore();
  const navigate = useNavigate();
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="font-bold text-2xl text-primary">SyncEDU</div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">
              <LogIn className="h-4 w-4 mr-2" />
              Log in
            </Button>
          </Link>
          <Link to="/register">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Your collaborative
              <span className="text-primary"> study platform</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Take notes, generate flashcards, and collaborate with friends all in one place. Supercharge your learning with our AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Log in to your account
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-8 shadow-md animate-slide-up">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <BookText className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Notes & Collaboration</h3>
                </div>
                <p className="text-muted-foreground">
                  Create and edit notes in a clean, distraction-free editor. Share your notes with specific people or make them public.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-primary">
                  <Brain className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">AI Flashcard Generator</h3>
                </div>
                <p className="text-muted-foreground">
                  Automatically generate flashcards from your notes to aid memorization and test your knowledge effectively.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm font-medium">Try our demo account:</p>
                <p className="text-xs text-muted-foreground">
                  Email: demo@example.com<br />
                  Password: password
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2023 SyncEDU. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
