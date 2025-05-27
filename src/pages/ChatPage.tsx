import { useParams, useNavigate } from "react-router-dom";
import { MessageStatus, useMessageStore } from "../stores/messageStore";
import { useChatStore } from "../stores/chatStore";
import { useState } from "react";

import { useLoadMessages } from "../hooks/useLoadMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { useSendFile } from "../hooks/useSendFile";

import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import ProfilePicture from "../components/ProfilePicture";
import { formatDateChip } from "../utils/formatDateChip";



export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const chat = useChatStore((s) => (chatId ? s.chats[chatId] : undefined));
  const messages = useMessageStore((s) =>
    chatId ? s.messages[chatId] : []
  );

  const [newMessage, setNewMessage] = useState("");

  useLoadMessages(chatId);
  const { send, sending, error } = useSendMessage(chatId);
  const { sendFile } = useSendFile(chatId);

  const handleFileAttachment = (file: File) => {
    const fileMsg: any = {
      id: `file-${Date.now()}`,
      senderId: "me",
      content: `[FILE:${file.name}]`,
      timestamp: Date.now(),
      status: MessageStatus.SENDING,
      file, // store the actual file
    };
    useMessageStore.getState().addMessage(chatId!, fileMsg);
  };

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
      
      {/* ===== Top Bar: Back Button and Chat Title ===== */}
      <div className="px-4 py-3 border-b bg-white shadow-sm">
        
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/chats")}
        >
          ← Volver a la lista de chats
        </button>
        <div className="flex items-center mt-2">
          <ProfilePicture name={chat.name} profilePic={chat.picture} />
          <h1 className="text-lg font-semibold mt-2">{chat.name}</h1>
        </div>
        
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
        onSend={() => {
          send(newMessage);
          setNewMessage("");
        }}
        onAttachFile={sendFile}
        disabled={sending}
        error={error ?? undefined}
      />
    </div>
  );
}
