
import { useAuthStore, useNotesStore } from "@/lib/store";
import NoteCard from "@/components/notes/NoteCard";
import { Earth, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SharedNotesPage = () => {
  const { user } = useAuthStore();
  const { notes } = useNotesStore();
  
  const sharedWithMe = notes.filter(note => 
    note.ownerId !== user?.id && 
    (note.sharedWith.includes(user?.email || '') || note.isPublic)
  );
  
  const sharedByMe = notes.filter(note => 
    note.ownerId === user?.id && 
    (note.sharedWith.length > 0 || note.isPublic)
  );
  
  const publicNotes = sharedWithMe.filter(note => note.isPublic);
  const privateShares = sharedWithMe.filter(note => !note.isPublic);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shared Notes</h1>
      </div>
      
      <Tabs defaultValue="shared-with-me">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="shared-with-me" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Shared with me
          </TabsTrigger>
          <TabsTrigger value="shared-by-me" className="flex items-center">
            <Earth className="mr-2 h-4 w-4" />
            Shared by me
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="shared-with-me" className="space-y-6 mt-6">
          {sharedWithMe.length > 0 ? (
            <>
              {privateShares.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Shared Directly With Me</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {privateShares.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}
              
              {publicNotes.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Public Notes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {publicNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No shared notes yet</h3>
              <p className="text-muted-foreground">
                When someone shares a note with you, it will appear here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shared-by-me" className="space-y-6 mt-6">
          {sharedByMe.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedByMe.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium mb-2">You haven't shared any notes</h3>
              <p className="text-muted-foreground">
                When you share a note or make it public, it will appear here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SharedNotesPage;
