// src/stores/chatStore.ts
import { create } from 'zustand';

export interface Chat {
  id: string;
  name: string;
  picture?: string;
  lastMessage?: string;
  timestamp: number;
  unreadCount: number;
  isTyping?: boolean;
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
