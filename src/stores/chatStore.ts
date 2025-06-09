// src/stores/chatStore.ts
import { create } from 'zustand';
// src/stores/chatStore.ts

export interface Participant {
  waId: string;
  name: string;
  color?: string; // Will be assigned in the frontend for display
  isAdmin?: boolean
}

export interface Chat {
  id: string; // This will be waId (user or group)
  name:string;
  picture?: string;
  lastMessage?: string;
  timestamp: number;
  unreadCount: number;
  isTyping?: boolean;
  isGroup?: boolean;       // New field
  participants?: Participant[]; // New field
  isMuted?: boolean;
  isPinned?: boolean;
  isBlocked?: boolean;
}

interface ChatStore {
  chats: Record<string, Chat>;
  setChats: (chats: Chat[]) => void;
  updateChat: (id: string, chat: Partial<Chat>) => void;
  addOrUpdateChat: (chat: Chat) => void;
  removeChat: (id: string) => void;
  clearChats: () => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  chats: {},

  setChats: (chats) => {
    const chatMap: Record<string, Chat> = {};
    chats.forEach((chat) => {
      chatMap[chat.id] = chat;
    });
    set({ chats: chatMap });
  },

  updateChat: (id, chatData) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [id]: { ...state.chats[id], ...chatData },
      },
    })),

  addOrUpdateChat: (chat) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [chat.id]: {
          ...state.chats[chat.id],
          ...chat,
        },
      },
    })),

  removeChat: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.chats;
      return { chats: rest };
    }),

  clearChats: () => set({ chats: {} }),
}));
