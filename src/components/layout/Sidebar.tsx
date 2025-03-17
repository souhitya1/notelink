
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUIStore, useNotesStore, useFlashcardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookText, 
  Brain, 
  FileText, 
  Home, 
  Plus, 
  Settings, 
  Users,
  X,
  FileDigit
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { notes, createNote } = useNotesStore();
  const { decks } = useFlashcardStore();
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        toggleSidebar();
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out md:transform-none",
        isSidebarOpen ? "transform-none" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg text-primary">SyncEDU</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-sm font-semibold text-sidebar-foreground/70">General</h3>
            </div>
            
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === "/dashboard" && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            
            <Link to="/notes">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname.startsWith("/notes") && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <FileText className="mr-2 h-5 w-5" />
                My Notes
              </Button>
            </Link>
            
            <Link to="/flashcards">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname.startsWith("/flashcards") && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Brain className="mr-2 h-5 w-5" />
                Flashcards
              </Button>
            </Link>
            
            <Link to="/shared">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname.startsWith("/shared") && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Users className="mr-2 h-5 w-5" />
                Shared with me
              </Button>
            </Link>

            <Link to="/summarize">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  location.pathname === "/summarize" && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <FileDigit className="mr-2 h-5 w-5" />
                Summarize Notes
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 space-y-1">
            <div className="flex items-center justify-between px-3 py-2">
              <h3 className="text-sm font-semibold text-sidebar-foreground/70">Recent Notes</h3>
              <Button variant="ghost" size="sm" onClick={createNote}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {notes.slice(0, 5).map((note) => (
              <Link key={note.id} to={`/notes/${note.id}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start truncate text-sm font-normal",
                    location.pathname === `/notes/${note.id}` && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <BookText className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{note.title}</span>
                </Button>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-sm font-semibold text-sidebar-foreground/70">Recent Flashcards</h3>
            </div>
            
            {decks.slice(0, 3).map((deck) => (
              <Link key={deck.id} to={`/flashcards/${deck.id}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start truncate text-sm font-normal",
                    location.pathname === `/flashcards/${deck.id}` && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Brain className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{deck.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </ScrollArea>
      
      <div className="mt-auto border-t p-4">
        <Link to="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              location.pathname === "/settings" && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
