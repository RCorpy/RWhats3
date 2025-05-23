import { create } from 'zustand';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

interface MessageStore {
  messages: Record<string, Message[]>; // Keyed by chatId
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>()((set) => ({
  messages: {},

  setMessages: (chatId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: msgs },
    })),

  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),

  clearMessages: () => set({ messages: {} }),
}));
