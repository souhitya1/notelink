
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNotesStore, useFlashcardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Plus } from "lucide-react";
import FlashcardGenerator from "@/components/flashcards/FlashcardGenerator";

const FlashcardsPage = () => {
  const { notes } = useNotesStore();
  const { decks } = useFlashcardStore();
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">My Flashcard Decks</h2>
          
          {decks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {decks.map((deck) => {
                const sourceNote = notes.find(n => n.id === deck.noteId);
                
                return (
                  <Card key={deck.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{deck.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm text-muted-foreground">
                        {deck.flashcards.length} flashcards
                      </div>
                      {sourceNote && (
                        <div className="text-sm text-muted-foreground mt-1">
                          From: {sourceNote.title}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link to={`/flashcards/${deck.id}`} className="w-full">
                        <Button variant="outline" className="w-full justify-between">
                          Study Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Brain className="h-8 w-8 text-muted-foreground mb-2" />
                <CardTitle className="text-lg mb-1">No flashcard decks yet</CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  Generate flashcards from your notes to start studying
                </p>
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

export default FlashcardsPage;
