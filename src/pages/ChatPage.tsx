import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../stores/chatStore";
import { useMessageStore, MessageStatus } from "../stores/messageStore";
import { useEffect, useState } from "react";

import MessageBubble from "../components/MessageBubble";
import { formatDateChip } from "../utils/formatDateChip";
import MessageInput from "../components/MessageInput";

export default function ChatPage() {
  // ===== Get Route Params and Navigation =====
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  // ===== Access Chat and Message Stores =====
  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const updateChat = useChatStore((s) => s.updateChat);

  const messages = useMessageStore((s) => (chatId ? s.messages[chatId] : []));
  const setMessages = useMessageStore((s) => s.setMessages);
  const addMessage = useMessageStore((s) => s.addMessage);

  // ===== Local State =====
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== Load Messages on Mount =====
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

  // ===== Render Fallback if Chat is Not Found =====
  if (!chat) {
    return (
      <div className="p-4">
        Chat not found.{" "}
        <a href="/chats" className="text-blue-500 underline">
          Go back to chats
        </a>
      </div>
    );
  }

  // ===== Handle Send Message =====
  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatId || sending) return;

    setSending(true);
    setError(null);

    const message = {
      id: `${Date.now()}`, 
      chatId,
      senderId: "me",
      content: newMessage.trim(),
      timestamp: Date.now(),
      status: MessageStatus.SENT,
    };

    addMessage(chatId, message);
    setNewMessage("");

    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to send message");
        return res.json();
      })
      .then((savedMessage) => {
        setMessages(chatId, messages.filter((m) => m.id !== message.id));
        addMessage(chatId, {
          id: savedMessage.id,
          chatId: savedMessage.chatId,
          senderId: savedMessage.senderId,
          content: savedMessage.content,
          timestamp: savedMessage.timestamp,
          status: savedMessage.status,
        });

        updateChat(chatId, {
          ...chat,
          lastMessage: savedMessage.content,
          timestamp: savedMessage.timestamp,
          unreadCount: 0,
        });
      })
      .catch((err) => {
        setError("Error sending message. Please try again.");
        console.error("Error sending message:", err);
      })
      .finally(() => {
        setSending(false);
      });
  };

  // ===== Render UI =====
  let lastRenderedDate = "";

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* ===== Top Bar: Back Button and Chat Title ===== */}
      <div className="px-4 py-3 border-b bg-white shadow-sm">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/chats")}
        >
          ← Volver a la lista de chats
        </button>
        <h1 className="text-lg font-semibold mt-2">{chat.name}</h1>
      </div>

      {/* ===== Message List ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {(messages || []).map((msg) => {
          const dateChip = formatDateChip(msg.timestamp);
          const showDateChip = dateChip !== lastRenderedDate;
          lastRenderedDate = dateChip;

          return (
            <MessageBubble
              key={msg.id}
              msg={msg}
              showDateChip={showDateChip}
              dateChipLabel={dateChip}
            />
          );
        })}
      </div>

      {/* ===== Error Message ===== */}
      {error && (
        <div className="text-red-600 px-4 mb-2 text-sm">{error}</div>
      )}

      {/* ===== Message Input Field ===== */}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        disabled={sending}
        error={error}
      />
    </div>
  );
}
