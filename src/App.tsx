
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUIStore } from "@/lib/store";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import NotesPage from "./pages/NotesPage";
import NoteDetail from "./pages/NoteDetail";
import FlashcardsPage from "./pages/FlashcardsPage";
import FlashcardDetail from "./pages/FlashcardDetail";
import SharedNotesPage from "./pages/SharedNotesPage";
import SummaryGenerator from "./pages/SummaryGenerator";
import NotFound from "./pages/NotFound";

// Layouts
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => {
  const { isDarkMode } = useUIStore();
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/:noteId" element={<NoteDetail />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/flashcards/:deckId" element={<FlashcardDetail />} />
              <Route path="/shared" element={<SharedNotesPage />} />
              <Route path="/summarize" element={<SummaryGenerator />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
