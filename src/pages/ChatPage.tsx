import { useParams, useNavigate } from "react-router-dom";
import { MessageStatus, useMessageStore } from "../stores/messageStore";
import { useChatStore } from "../stores/chatStore";
import { useState, useEffect, useRef } from "react";

import { useLoadMessages } from "../hooks/useLoadMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { useSendFile } from "../hooks/useSendFile";

import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";
import { formatDateChip } from "../utils/formatDateChip";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const messages = useMessageStore((s) =>
    chatId ? s.messages[chatId] : []
  );

  const [newMessage, setNewMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { send, sending, error } = useSendMessage(chatId);
  const { sendFile } = useSendFile(chatId);
  useLoadMessages(chatId);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  let lastRenderedDate = "";

  const filteredMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Top Bar with Back, Profile, Buttons */}
      <div className="border-b bg-white shadow-sm">
        <ChatHeader
          onSearchClick={() => setSearchOpen((prev) => !prev)}
          onMoreClick={() => console.log("Show more menu")}
          chatName={chat.name}
          profilePic={chat.picture}
          onBack={() => navigate("/chats")}
        />
        {searchOpen && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <input
              type="text"
              placeholder="Buscar mensajes..."
              className="w-full border rounded px-3 py-1 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filteredMessages.map((msg) => {
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
        <div ref={bottomRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 px-4 mb-2 text-sm">{error}</div>
      )}

      {/* Message Input Field */}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={() => {
          send(newMessage);
          setNewMessage("");
        }}
        onAttachFile={sendFile}
        disabled={sending}
        error={error ?? undefined}
      />

      {/* Scroll to bottom button */}
      <button
        onClick={() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
        title="Scroll to bottom"
      >
        ↓
      </button>
    </div>
  );
}
