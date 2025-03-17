
import { useParams } from "react-router-dom";
import NoteEditor from "@/components/editor/NoteEditor";

const NoteDetail = () => {
  const { noteId } = useParams<{ noteId: string }>();
  
  if (!noteId) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium">Note not found</h2>
      </div>
    );
  }

  return <NoteEditor noteId={noteId} />;
};

export default NoteDetail;
