import { useParams, useNavigate } from "react-router-dom";
import { MessageStatus, useMessageStore } from "../stores/messageStore";
import { useChatStore } from "../stores/chatStore";
import { useState, useEffect, useRef } from "react";

import { useLoadMessages } from "../hooks/useLoadMessages";
import { useSendMessage } from "../hooks/useSendMessage";

import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import ChatHeader from "../components/ChatHeader";
import { formatDateChip } from "../utils/formatDateChip";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const messages = useMessageStore((s) => (chatId ? s.messages[chatId] : undefined));

  const [newMessage, setNewMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const { sendMessage } = useSendMessage(chatId);

  useLoadMessages(chatId);

  const filteredMessages = searchQuery
    ? (messages ?? []).filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

useEffect(() => {
  if (filteredMessages.length > 0) {
    const currentMessageId = filteredMessages[currentMatchIndex]?.id;

    // Remove highlight from all messages
    Object.keys(messageRefs.current).forEach((id) => {
      messageRefs.current[id]?.classList.remove("bg-green-200", "border-l-4", "border-green-200");
    });

    // Add passive highlight to all matched messages
    filteredMessages.forEach(({ id }) => {
      messageRefs.current[id]?.classList.add("bg-green-200");
    });

    // Add active highlight to current match
    if (currentMessageId && messageRefs.current[currentMessageId]) {
      const node = messageRefs.current[currentMessageId];
      node?.classList.add("bg-green-200", "border-l-4", "border-green-400");
      node?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}, [currentMatchIndex, filteredMessages]);


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (searchQuery && filteredMessages.length > 0) {
      const firstMatchId = filteredMessages[0].id;
      if (messageRefs.current[firstMatchId]) {
        messageRefs.current[firstMatchId].scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchQuery]);

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
        onPrevMatch={() =>
          setCurrentMatchIndex((i) => Math.max(0, i - 1))
        }
        onNextMatch={() =>
          setCurrentMatchIndex((i) =>
            Math.min(filteredMessages.length - 1, i + 1)
          )
        }
        disablePrev={currentMatchIndex === 0 || filteredMessages.length === 0}
        disableNext={
          currentMatchIndex === filteredMessages.length - 1 ||
          filteredMessages.length === 0
        }
        isSearchOpen={searchOpen}
      />
        {searchOpen && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <input
              type="text"
              placeholder="Buscar mensajes..."
              className="w-full border rounded px-3 py-1 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
          </div>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {(messages || []).map((msg) => {
          const dateChip = formatDateChip(msg.timestamp);
          const showDateChip = dateChip !== lastRenderedDate;
          lastRenderedDate = dateChip;
          if (!messageRefs.current[msg.id]) {
            messageRefs.current[msg.id] = null;
          }

          return (
            <MessageBubble
              key={msg.id}
              msg={msg}
              showDateChip={showDateChip}
              dateChipLabel={dateChip}
              ref={(el) => {
                messageRefs.current[msg.id] = el;
              }}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error Message */}
      {false && ( //{error &&}
        <div className="text-red-600 px-4 mb-2 text-sm">{"error"}</div>
      )}

      {/* Message Input Field */}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={(msg, file) => {
          sendMessage(msg, file, null);
        }}
        //disabled={sending}
        //error={error ?? undefined}
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
