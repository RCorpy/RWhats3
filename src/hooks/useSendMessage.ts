// hooks/useSendMessage.ts
import { useMessageStore, MessageStatus } from "../stores/messageStore";
import { useChatStore } from "../stores/chatStore";
import { v4 as uuidv4 } from "uuid";
import { useSendFile } from "./useSendFile";

export function useSendMessage(chatId?: string) {
  const { sendFile } = useSendFile(chatId);
  const addMessage = useMessageStore((s) => s.addMessage);
  const setMessages = useMessageStore((s) => s.setMessages);
  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const updateChat = useChatStore((s) => s.updateChat);
  const messages = useMessageStore((s) => (chatId ? s.messages[chatId] : []));

  const sendMessage = async (content: string, file?: File) => {
    if (!chatId || (!content && !file)) return;

    if (file) {
      await sendFile(file); // Let existing logic handle everything
      return;
    }

    const tempId = uuidv4();
    const tempMsg = {
      id: tempId,
      chatId,
      senderId: "me",
      content,
      timestamp: Date.now(),
      status: MessageStatus.SENDING,
    };

    addMessage(chatId, tempMsg);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempMsg),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const saved = await res.json();

      setMessages(chatId, messages.filter((m) => m.id !== tempId));
      addMessage(chatId, saved);

      if (chat) {
        updateChat(chatId, {
          ...chat,
          lastMessage: saved.content,
          timestamp: saved.timestamp,
          unreadCount: 0,
        });
      }
    } catch (err) {
      console.error("Message send error:", err);
    }
  };

  return { sendMessage };
}
