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
    <div className="p-4 space-y-2 flex flex-col h-full">
      <button
        className="mb-2 text-blue-600 underline self-start"
        onClick={() => navigate("/chats")}
      >
        ← Volver a la lista de chats
      </button>

      <h1 className="text-xl font-bold mb-4">{chat.name}</h1>

      <div className="flex-1 overflow-auto space-y-2 mb-4">
        {(messages || []).map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-[75%] ${
              msg.senderId === "me"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-600 mb-2">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
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
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
          onClick={handleSendMessage}
          disabled={sending}
        >
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
