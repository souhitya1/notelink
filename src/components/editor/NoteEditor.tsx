
import { useState, useEffect } from "react";
import { useNotesStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileEdit, 
  Save, 
  Share2, 
  Trash, 
  Globe, 
  Lock,
  Tag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface NoteEditorProps {
  noteId: string;
}

const NoteEditor = ({ noteId }: NoteEditorProps) => {
  const { notes, updateNote, deleteNote, shareNote, togglePublicNote } = useNotesStore();
  const note = notes.find(n => n.id === noteId);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsEdited(false);
    }
  }, [note]);

  if (!note) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <FileEdit className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium">No note selected</h3>
          <p>Select a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateNote(noteId, { title, content });
    setIsEdited(false);
    toast.success("Note saved successfully");
  };

  const handleDelete = () => {
    deleteNote(noteId);
  };

  const handleShare = () => {
    if (shareEmail.trim()) {
      shareNote(noteId, shareEmail.trim());
      setShareEmail("");
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !note.tags.includes(tagInput.trim())) {
      const updatedTags = [...note.tags, tagInput.trim()];
      updateNote(noteId, { tags: updatedTags });
      setTagInput("");
      toast.success("Tag added successfully");
    }
  };

  const handleTagRemove = (tag: string) => {
    const updatedTags = note.tags.filter(t => t !== tag);
    updateNote(noteId, { tags: updatedTags });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsEdited(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsEdited(true);
  };

  return (
    <div className="note-editor space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <Input
          value={title}
          onChange={handleTitleChange}
          className="text-xl font-bold border-none shadow-none focus-visible:ring-0 px-0 text-foreground"
          placeholder="Note title"
        />
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => togglePublicNote(noteId)}
          >
            {note.isPublic ? (
              <>
                <Globe className="h-4 w-4 mr-1" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-1" />
                Private
              </>
            )}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Note</DialogTitle>
                <DialogDescription>
                  Enter the email address of the person you want to share this note with.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="colleague@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleShare}>Share</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant={isEdited ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            disabled={!isEdited}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Note</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this note? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex space-x-2 items-center">
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <div 
              key={tag} 
              className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
            >
              <span>{tag}</span>
              <button 
                onClick={() => handleTagRemove(tag)}
                className="ml-1 hover:text-destructive"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag"
            className="w-24 h-8 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleTagAdd}
          >
            <Tag className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="min-h-[60vh] bg-card rounded-md border">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your notes here..."
          className="min-h-[60vh] border-none rounded-md p-4 resize-none focus-visible:ring-0"
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default NoteEditor;
