
import { Link } from "react-router-dom";
import { Note } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Lock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  // Truncate content for preview
  const previewContent = note.content.length > 150
    ? note.content.substring(0, 150) + "..."
    : note.content;

  return (
    <Link to={`/notes/${note.id}`}>
      <Card className="note-card group h-full flex flex-col">
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {note.title}
            </h3>
            <div>
              {note.isPublic ? (
                <Globe className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-4">
            {previewContent}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t mt-auto">
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
            </div>
            
            {note.sharedWith.length > 0 && (
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span>Shared with {note.sharedWith.length}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default NoteCard;
