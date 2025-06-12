// hooks/useSendMessage.ts
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMessageStore, MessageStatus } from "../stores/messageStore";
import { useChatStore } from "../stores/chatStore";

export function useSendMessage(chatId?: string) {
  const addMessage = useMessageStore((s) => s.addMessage);
  const setMessages = useMessageStore((s) => s.setMessages);
  const messages = useMessageStore((s) => (chatId ? s.messages[chatId] : []));
  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const updateChat = useChatStore((s) => s.updateChat);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    content: string,
    file?: File,
    referenceContent?: string
  ) => {
    if (!chatId || (!content && !file) || sending) return;

    setSending(true);
    setError(null);

    const tempId = uuidv4();
    const timestamp = Date.now();

    const tempMsg = {
      id: tempId,
      chatId,
      senderId: "me",
      content: file ? file.name : content,
      timestamp,
      status: MessageStatus.SENDING,
      file: undefined,
      referenceContent,
    };

    addMessage(chatId, tempMsg);

    try {
      const formData = new FormData();
      formData.append("id", tempId);
      formData.append("chatId", chatId);
      formData.append("senderId", "me");
      formData.append("content", content || `[FILE:${file?.name}]`);
      formData.append("timestamp", String(timestamp));
      if (file) formData.append("file", file);
      if (referenceContent) formData.append("referenceContent", referenceContent);
      console.log("referenceContent: ", referenceContent);
      const res = await fetch("/api/messages", {
        method: "POST",
        body: formData,
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
      setError("Error sending message.");
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  return { sendMessage, sending, error };
}


