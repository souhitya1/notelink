
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FlashcardViewer from "@/components/flashcards/FlashcardViewer";

const FlashcardDetail = () => {
  const { deckId } = useParams<{ deckId: string }>();
  
  if (!deckId) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium">Flashcard deck not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Link to="/flashcards">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Flashcards
          </Button>
        </Link>
      </div>
      
      <FlashcardViewer deckId={deckId} />
    </div>
  );
};

export default FlashcardDetail;
