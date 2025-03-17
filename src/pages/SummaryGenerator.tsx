
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookText, FileText, Copy } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const SummaryGenerator = () => {
  const { isAuthenticated } = useAuthStore();
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to summarize");
      return;
    }

    setIsGenerating(true);
    
    // In a real application, this would call an AI service API
    // For demo purposes, we're using a timeout to simulate API call
    setTimeout(() => {
      // Generate a simple summary by extracting key sentences
      const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      // Take first sentence and approximately 20% of the remaining ones
      const summaryLength = Math.max(1, Math.ceil(sentences.length * 0.2));
      const summaryText = sentences.slice(0, summaryLength)
        .join(". ")
        .trim() + ".";
      
      setSummary(summaryText);
      setIsGenerating(false);
      toast.success("Summary generated successfully");
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const resetForm = () => {
    setInputText("");
    setSummary("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notes Summarizer</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Input Text
            </CardTitle>
            <CardDescription>
              Paste your notes or text you want to summarize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your notes here..."
              className="min-h-[40vh] resize-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetForm}>
                Clear
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !inputText.trim()}
              >
                {isGenerating ? "Generating..." : "Generate Summary"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookText className="h-5 w-5" />
              Summary
            </CardTitle>
            <CardDescription>
              The generated summary will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-md p-4 min-h-[40vh] relative">
              {summary ? (
                <>
                  <p className="whitespace-pre-wrap">{summary}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(summary)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Your summary will appear here</p>
                </div>
              )}
            </div>
            {!isAuthenticated && summary && (
              <div className="mt-4 p-3 bg-primary/10 text-primary rounded-md text-sm">
                <p>Create an account to save this summary as a note!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isAuthenticated && summary && (
        <Card>
          <CardContent className="pt-6">
            <Button className="w-full" onClick={() => {
              toast.success("Summary saved as a new note");
              resetForm();
            }}>
              Save as Note
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SummaryGenerator;
