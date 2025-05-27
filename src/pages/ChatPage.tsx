import { useParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../stores/chatStore";
import { useMessageStore, MessageStatus } from "../stores/messageStore";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const updateChat = useChatStore((s) => s.updateChat);

  const messages = useMessageStore((s) => (chatId ? s.messages[chatId] : []));
  const setMessages = useMessageStore((s) => s.setMessages);
  const addMessage = useMessageStore((s) => s.addMessage);

  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatId || sending) return;

    setSending(true);
    setError(null);

    const message = {
      // id puede ser generado por backend, aquí usamos temporal solo para UI
      id: `${Date.now()}`, 
      chatId,
      senderId: "me",
      content: newMessage.trim(),
      timestamp: Date.now(),
      status: MessageStatus.SENT,
    };

    // Optimistamente añadimos el mensaje en UI para feedback inmediato
    addMessage(chatId, message);
    setNewMessage("");

    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to send message");
        return res.json();
      })
      .then((savedMessage) => {
        // Actualizar mensaje optimista con id real y status backend
        // Primero elimina el mensaje temporal
        setMessages(chatId, messages.filter(m => m.id !== message.id)); 

        // Luego añade el mensaje guardado con id real y timestamp backend
        addMessage(chatId, {
          id: savedMessage.id,
          chatId: savedMessage.chatId,
          senderId: savedMessage.senderId,
          content: savedMessage.content,
          timestamp: savedMessage.timestamp,
          status: savedMessage.status,
        });

        // Actualizar lastMessage y timestamp en chatStore
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
        // Opcional: remover el mensaje optimista o marcarlo como fallo en store
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Back Button */}
      <div className="px-4 py-3 border-b bg-white shadow-sm">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/chats")}
        >
          ← Volver a la lista de chats
        </button>
        <h1 className="text-lg font-semibold mt-2">{chat.name}</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {(messages || []).map((msg) => (
          <div
            key={msg.id}
            className={`p-2 px-3 py-2 rounded-lg text-sm max-w-[80%] break-words ${
              msg.senderId === "me"
                ? "bg-lime-300 text-black self-end ml-auto"
                : "bg-white text-gray-800 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-600 px-4 mb-2 text-sm">{error}</div>
      )}

      {/* Message input */}
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={sending}
        />
        <button
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
          onClick={handleSendMessage}
          disabled={sending}
        >
          {/* Paper plane icon (Heroicon style, inline SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 14L21 3m0 0l-6.5 18a.5.5 0 01-.9.1L10 14z"
            />
          </svg>
        </button>
      </div>
    </div>
  );

}
