
import { useState } from "react";
import { useNotesStore, useFlashcardStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Brain, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FlashcardGenerator = () => {
  const { notes } = useNotesStore();
  const { generateFlashcards } = useFlashcardStore();
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!selectedNoteId) return;
    
    setIsGenerating(true);
    try {
      await generateFlashcards(selectedNoteId);
      navigate("/flashcards");
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Generate AI Flashcards</h3>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Select a note and our AI will automatically generate flashcards to help you study the content more effectively.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select a note</label>
          <Select value={selectedNoteId} onValueChange={setSelectedNoteId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a note" />
            </SelectTrigger>
            <SelectContent>
              {notes.map((note) => (
                <SelectItem key={note.id} value={note.id}>
                  {note.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={!selectedNoteId || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Flashcards...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Generate Flashcards
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FlashcardGenerator;
