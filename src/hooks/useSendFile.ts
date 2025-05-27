import { useState } from "react";
import { useMessageStore, MessageStatus } from "../stores/messageStore";
import { useChatStore } from "../stores/chatStore";
import { v4 as uuidv4 } from "uuid";

export function useSendFile(chatId?: string) {
  const addMessage = useMessageStore((s) => s.addMessage);
  const setMessages = useMessageStore((s) => s.setMessages);
  const updateChat = useChatStore((s) => s.updateChat);
  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const messages = useMessageStore((s) => (chatId ? s.messages[chatId] : []));

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendFile = async (file: File) => {

    if (!chatId || sending) return;

    setSending(true);
    setError(null);

    const tempId = uuidv4();
    const tempMsg = {
      id: tempId,
      chatId,
      senderId: "me",
      content: file.name,
      timestamp: Date.now(),
      status: MessageStatus.SENDING,
      file: URL.createObjectURL(file), // for UI preview if needed
    };

    addMessage(chatId, tempMsg);

    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("senderId", "me");
    formData.append("content", `[FILE:${file.name}]`);
    formData.append("file", file);

    try {
        const res = await fetch("/api/messages", {
        method: "POST",
        body: formData,
        });

      if (!res.ok) throw new Error("Failed to send file");

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
      setError("Error sending file. Please try again.");
      console.error("File send error:", err);
    } finally {
      setSending(false);
    }
  };

  return { sendFile, sending, error };
}
