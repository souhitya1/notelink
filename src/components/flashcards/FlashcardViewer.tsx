
import { useState } from "react";
import { useFlashcardStore } from "@/lib/store";
import { Flashcard } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardViewerProps {
  deckId: string;
}

const FlashcardViewer = ({ deckId }: FlashcardViewerProps) => {
  const { decks } = useFlashcardStore();
  const deck = decks.find(d => d.id === deckId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  
  if (!deck) {
    return (
      <div className="text-center my-8">
        <h3 className="text-xl font-medium">Flashcard deck not found</h3>
      </div>
    );
  }
  
  if (deck.flashcards.length === 0) {
    return (
      <div className="text-center my-8">
        <h3 className="text-xl font-medium">No flashcards in this deck</h3>
        <p className="text-muted-foreground mt-2">
          Try generating flashcards from one of your notes
        </p>
      </div>
    );
  }
  
  const currentCard = deck.flashcards[currentIndex];
  const isCompleted = Object.keys(completed).length === deck.flashcards.length;
  
  const goToNext = () => {
    // Mark current card as completed
    setCompleted(prev => ({ ...prev, [currentCard.id]: true }));
    
    if (currentIndex < deck.flashcards.length - 1) {
      // If not at the end of the deck, go to next card
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // We're at the end of the deck
      const remainingCards = deck.flashcards.filter(card => !completed[card.id] && card.id !== currentCard.id);
      
      if (remainingCards.length > 0) {
        // Find the index of the first uncompleted card
        const nextIncompleteIndex = deck.flashcards.findIndex(card => 
          !completed[card.id] && card.id !== currentCard.id
        );
        
        if (nextIncompleteIndex !== -1) {
          setCurrentIndex(nextIncompleteIndex);
          setShowAnswer(false);
        }
      }
      // If no cards remaining, it will stay on the last card and show isCompleted message
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };
  
  const resetDeck = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted({});
  };
  
  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };
  
  const progress = Math.round((Object.keys(completed).length / deck.flashcards.length) * 100);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{deck.name}</h2>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} of {deck.flashcards.length} cards
        </div>
      </div>
      
      <div className="w-full bg-secondary h-2 rounded-full mb-6">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-center mb-8">
        <div 
          className="w-full max-w-2xl perspective-1000 h-64 md:h-80"
          onClick={flipCard}
        >
          <div
            className={cn(
              "relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer",
              showAnswer ? "rotate-y-180" : ""
            )}
          >
            <Card className="absolute w-full h-full backface-hidden p-8 flex flex-col justify-center items-center">
              <div className="text-xl text-center">{currentCard.front}</div>
              <div className="mt-auto text-xs text-muted-foreground">Click to flip</div>
            </Card>
            
            <Card className="absolute w-full h-full backface-hidden p-8 flex flex-col justify-center items-center rotate-y-180 bg-primary/5">
              <div className="text-xl text-center">{currentCard.back}</div>
              <div className="mt-auto text-xs text-muted-foreground">Click to flip</div>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={goToPrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button variant="outline" onClick={resetDeck}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        
        <Button onClick={goToNext}>
          {currentIndex < deck.flashcards.length - 1 || !isCompleted ? (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Complete"
          )}
        </Button>
      </div>
      
      {isCompleted && (
        <div className="mt-8 text-center text-primary font-semibold">
          Congratulations! You have completed this deck.
        </div>
      )}
    </div>
  );
};

export default FlashcardViewer;
