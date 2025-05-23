// src/stores/chatStore.ts
import { create } from 'zustand';

interface Chat {
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
  clearChats: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
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

  clearChats: () => set({ chats: {} }),
}));
