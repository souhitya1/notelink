
import { create } from 'zustand';
import { Note, User, FlashcardDeck } from '@/types';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  createNote: () => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;
  shareNote: (id: string, email: string) => void;
  togglePublicNote: (id: string) => void;
}

interface FlashcardState {
  decks: FlashcardDeck[];
  currentDeck: FlashcardDeck | null;
  generateFlashcards: (noteId: string) => Promise<void>;
  setCurrentDeck: (deck: FlashcardDeck | null) => void;
}

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

// Mock user data for demonstration
const mockUsers = [
  { id: '1', email: 'demo@example.com', name: 'Demo User', password: 'password' }
];

// Sample notes for demo
const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Biology 101: Cell Structure',
    content: 'Cells are the basic structural and functional units of life. They are composed of organelles such as the nucleus, mitochondria, and endoplasmic reticulum.\n\nThe nucleus contains genetic material (DNA) that controls cellular activities.\n\nMitochondria are the powerhouses of the cell, generating energy through cellular respiration.',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-15'),
    ownerId: '1',
    sharedWith: [],
    isPublic: false,
    tags: ['biology', 'science', 'cells']
  },
  {
    id: '2',
    title: 'History: World War II Overview',
    content: 'World War II (1939-1945) was a global conflict involving most of the world\'s nations.\n\nKey events:\n- Germany invaded Poland on September 1, 1939\n- Japan attacked Pearl Harbor on December 7, 1941\n- D-Day invasion occurred on June 6, 1944\n- Germany surrendered on May 8, 1945\n- Japan surrendered on September 2, 1945 after atomic bombings',
    createdAt: new Date('2023-06-12'),
    updatedAt: new Date('2023-06-14'),
    ownerId: '1',
    sharedWith: [],
    isPublic: true,
    tags: ['history', 'world war II']
  }
];

// Simulate generating flashcards from note content
const generateFlashcardsFromNote = (note: Note): Flashcard[] => {
  // In a real app, this would be handled by an AI service
  // Here we're just splitting on paragraphs and creating basic flashcards
  const lines = note.content.split('\n').filter(line => line.trim().length > 0);
  
  return lines.map((line, index) => {
    // Create simple front/back based on line content
    const parts = line.split(':');
    let front, back;
    
    if (parts.length > 1) {
      front = parts[0].trim();
      back = parts.slice(1).join(':').trim();
    } else {
      front = `Question about ${note.title}`;
      back = line.trim();
    }
    
    return {
      id: `${note.id}-card-${index}`,
      front,
      back,
      noteId: note.id,
      createdAt: new Date()
    };
  });
};

// Auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        // Simulate API call
        const mockUser = mockUsers.find(u => u.email === email);
        
        if (mockUser && password === 'password') {
          const { password, ...user } = mockUser as any;
          set({ user, isAuthenticated: true });
          toast.success('Logged in successfully');
        } else {
          toast.error('Invalid email or password');
          throw new Error('Invalid credentials');
        }
      },
      
      register: async (email, name, password) => {
        // Simulate API call
        if (mockUsers.some(u => u.email === email)) {
          toast.error('User already exists');
          throw new Error('User already exists');
        }
        
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          password
        };
        
        mockUsers.push(newUser);
        const { password: _, ...user } = newUser;
        set({ user, isAuthenticated: true });
        toast.success('Account created successfully');
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

// Notes store
export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: sampleNotes,
      currentNote: null,
      
      createNote: () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const newNote: Note = {
          id: Math.random().toString(36).substr(2, 9),
          title: 'Untitled Note',
          content: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: user.id,
          sharedWith: [],
          isPublic: false,
          tags: []
        };
        
        set(state => ({
          notes: [newNote, ...state.notes],
          currentNote: newNote
        }));
        
        toast.success('New note created');
      },
      
      updateNote: (id, data) => {
        set(state => ({
          notes: state.notes.map(note => 
            note.id === id 
              ? { ...note, ...data, updatedAt: new Date() } 
              : note
          ),
          currentNote: state.currentNote?.id === id 
            ? { ...state.currentNote, ...data, updatedAt: new Date() } 
            : state.currentNote
        }));
      },
      
      deleteNote: (id) => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote
        }));
        toast.success('Note deleted');
      },
      
      setCurrentNote: (note) => {
        set({ currentNote: note });
      },
      
      shareNote: (id, email) => {
        // In a real app, this would send an invitation to the user
        set(state => ({
          notes: state.notes.map(note => 
            note.id === id 
              ? { ...note, sharedWith: [...note.sharedWith, email] } 
              : note
          )
        }));
        toast.success(`Note shared with ${email}`);
      },
      
      togglePublicNote: (id) => {
        set(state => ({
          notes: state.notes.map(note => 
            note.id === id 
              ? { ...note, isPublic: !note.isPublic } 
              : note
          ),
          currentNote: state.currentNote?.id === id 
            ? { ...state.currentNote, isPublic: !state.currentNote.isPublic } 
            : state.currentNote
        }));
      }
    }),
    {
      name: 'notes-storage'
    }
  )
);

// Flashcard store
export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      decks: [],
      currentDeck: null,
      
      generateFlashcards: async (noteId) => {
        const note = useNotesStore.getState().notes.find(n => n.id === noteId);
        if (!note) return;
        
        // Generate flashcards using our helper function
        const flashcards = generateFlashcardsFromNote(note);
        
        const newDeck: FlashcardDeck = {
          id: Math.random().toString(36).substr(2, 9),
          name: `${note.title} Flashcards`,
          noteId: note.id,
          flashcards,
          createdAt: new Date()
        };
        
        set(state => ({
          decks: [newDeck, ...state.decks],
          currentDeck: newDeck
        }));
        
        toast.success('Flashcards generated successfully');
      },
      
      setCurrentDeck: (deck) => {
        set({ currentDeck: deck });
      }
    }),
    {
      name: 'flashcard-storage'
    }
  )
);

// UI store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarOpen: true,
      
      toggleDarkMode: () => {
        set(state => ({ isDarkMode: !state.isDarkMode }));
      },
      
      toggleSidebar: () => {
        set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
      }
    }),
    {
      name: 'ui-storage'
    }
  )
);
