// src/stores/messageStore.ts
import { create } from "zustand";

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  SENDING = "sending",
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  status: MessageStatus;
  file?: File | string;
  referenceContent?: string;
}

interface MessageStore {
  messages: Record<string, Message[]>;

  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  prependMessages: (chatId: string, messages: Message[]) => void;
  updateMessageStatus: (chatId: string, messageId: string, status: MessageStatus) => void;
  removeMessage: (chatId: string, messageId: string) => void;
  clearMessages: () => void;
  updateMessage: (chatId: string, messageId: string, partialUpdate: Partial<Message>) => void;
}

export const useMessageStore = create<MessageStore>()((set, get) => ({
  messages: {},

  setMessages: (chatId, msgs) =>
    set((state) => {
      const currentMsgs = state.messages[chatId] || [];
      if (
        currentMsgs.length === msgs.length &&
        msgs.length > 0 &&
        currentMsgs[currentMsgs.length - 1].id === msgs[msgs.length - 1].id
      ) {
        return state; // no change needed
      }
      return {
        messages: { ...state.messages, [chatId]: msgs },
      };
    }),

  addMessage: (chatId, message) =>
    set((state) => {
      const currentMsgs = state.messages[chatId] || [];
      const exists = currentMsgs.some((m) => m.id === message.id);
      if (exists) return state;

      return {
        messages: {
          ...state.messages,
          [chatId]: [...currentMsgs, message],
        },
      };
    }),

  prependMessages: (chatId, messages) =>
    set((state) => {
      const currentMsgs = state.messages[chatId] || [];
      const newMsgs = messages.filter(
        (m) => !currentMsgs.some((cm) => cm.id === m.id)
      );
      return {
        messages: {
          ...state.messages,
          [chatId]: [...newMsgs, ...currentMsgs],
        },
      };
    }),

  updateMessageStatus: (chatId, messageId, status) =>
    set((state) => {
      const msgs = state.messages[chatId] || [];
      const index = msgs.findIndex((m) => m.id === messageId);
      if (index === -1) return state;

      const updatedMsg = { ...msgs[index], status };
      const updatedMsgs = [...msgs];
      updatedMsgs[index] = updatedMsg;

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMsgs,
        },
      };
    }),

  removeMessage: (chatId, messageId) =>
    set((state) => {
      const msgs = state.messages[chatId] || [];
      const updatedMsgs = msgs.filter((m) => m.id !== messageId);
      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMsgs,
        },
      };
    }),
  updateMessage: (
    chatId: string,
    messageId: string,
    partialUpdate: Partial<Message>
  ) =>
    set((state) => {
      const msgs = state.messages[chatId] || [];
      const index = msgs.findIndex((m) => m.id === messageId);
      if (index === -1) return state;

      const updatedMsg = { ...msgs[index], ...partialUpdate };
      const updatedMsgs = [...msgs];
      updatedMsgs[index] = updatedMsg;

      return {
        messages: {
          ...state.messages,
          [chatId]: updatedMsgs,
        },
      };
    }),


  clearMessages: () => set({ messages: {} }),
}));
