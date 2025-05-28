import { useMessageStore, MessageStatus } from "../stores/messageStore";
import { useChatStore } from "../stores/chatStore";
import { useState } from "react";
import { createTempMessage } from "../utils/createTempMessage"

export function useSendMessage(chatId?: string) {
  const messages = useMessageStore((s) =>
    chatId ? s.messages[chatId] : []
  );
  const addMessage = useMessageStore((s) => s.addMessage);
  const setMessages = useMessageStore((s) => s.setMessages);
  const updateChat = useChatStore((s) => s.updateChat);
  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeIfShouting = (text: string) => {
    const isAllUppercase = text === text.toUpperCase();
    if (!isAllUppercase) return text;
    return text
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(" ");
};

  const send = (content: string) => {
    const formatted = normalizeIfShouting(content.trim());
    if (!formatted || !chatId || sending) return;

    setSending(true);
    setError(null);

    const tempMsg = createTempMessage(chatId, formatted);
    addMessage(chatId, tempMsg);

    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tempMsg),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to send message");
        return res.json();
      })
      .then((saved) => {
        setMessages(chatId, messages.filter((m) => m.id !== tempMsg.id));
        addMessage(chatId, {
          id: saved.id,
          chatId: saved.chatId,
          senderId: saved.senderId,
          content: saved.content,
          timestamp: saved.timestamp,
          status: saved.status,
        });

        if (chat) {
          updateChat(chatId, {
            ...chat,
            lastMessage: saved.content,
            timestamp: saved.timestamp,
            unreadCount: 0,
          });
        }
      })
      .catch((err) => {
        setError("Error sending message. Please try again.");
        console.error("Error sending message:", err);
      })
      .finally(() => setSending(false));
  };

  return { send, sending, error };
}
