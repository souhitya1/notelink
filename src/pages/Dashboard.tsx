
import { useNotesStore, useFlashcardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Brain, Plus, Users } from "lucide-react";
import NoteCard from "@/components/notes/NoteCard";
import FlashcardGenerator from "@/components/flashcards/FlashcardGenerator";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { notes, createNote } = useNotesStore();
  const { decks } = useFlashcardStore();
  
  const recentNotes = notes.slice(0, 3);
  const sharedNotes = notes.filter(note => note.sharedWith.length > 0);
  const publicNotes = notes.filter(note => note.isPublic);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={createNote}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">
              {notes.length > 0 
                ? `Last updated ${new Date(notes[0].updatedAt).toLocaleDateString()}` 
                : "No notes yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcard Decks</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decks.length}</div>
            <p className="text-xs text-muted-foreground">
              {decks.length > 0 
                ? `${decks.reduce((acc, deck) => acc + deck.flashcards.length, 0)} total flashcards` 
                : "No flashcards yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Notes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedNotes.length}</div>
            <p className="text-xs text-muted-foreground">
              {publicNotes.length} public notes
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Notes</h2>
            <Link to="/notes">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>
          
          {recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <BookText className="h-8 w-8 text-muted-foreground mb-2" />
                <CardTitle className="text-lg mb-1">No notes yet</CardTitle>
                <CardDescription>Create your first note to get started</CardDescription>
                <Button className="mt-4" onClick={createNote}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Note
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Flashcards</h2>
          <FlashcardGenerator />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
