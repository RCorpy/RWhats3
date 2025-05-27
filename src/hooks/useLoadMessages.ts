import { useEffect } from "react";
import { useChatStore } from "../stores/chatStore";
import { useMessageStore } from "../stores/messageStore";

export function useLoadMessages(chatId?: string) {
  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const updateChat = useChatStore((s) => s.updateChat);
  const setMessages = useMessageStore((s) => s.setMessages);

  useEffect(() => {
    if (!chatId) return;

    fetch(`/api/messages/${chatId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch messages");
        return res.json();
      })
      .then((data) => {
        setMessages(chatId, data);

        if (!chat && data.length > 0) {
          const firstMessage = data[0];
          updateChat(chatId, {
            id: chatId,
            name: chatId,
            timestamp: firstMessage.timestamp,
            unreadCount: 0,
            lastMessage: firstMessage.content,
          });
        }
      })
      .catch((err) => {
        console.error("Error loading messages:", err);
      });
  }, [chatId, chat, updateChat, setMessages]);
}
