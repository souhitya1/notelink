
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  sharedWith: string[];
  isPublic: boolean;
  tags: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  noteId: string;
  createdAt: Date;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  noteId: string;
  flashcards: Flashcard[];
  createdAt: Date;
}
