// components/MessageBubble.tsx
import { MessageStatus } from "../stores/messageStore";

interface MessageBubbleProps {
  msg: {
    id: string;
    senderId: string;
    content: string;
    timestamp: number;
    status: MessageStatus;
  };
  showDateChip: boolean;
  dateChipLabel: string;
}

export default function MessageBubble({ msg, showDateChip, dateChipLabel }: MessageBubbleProps) {
  return (
    <div key={msg.id}>
      {showDateChip && (
        <div className="text-xs text-gray-500 text-center my-4">
          <span className="inline-block bg-stone-50 rounded-full px-3 py-1">
            {dateChipLabel}
          </span>
        </div>
      )}

      <div
        className={`max-w-[75%] px-3 py-2 rounded relative ${
          msg.senderId === "me"
            ? "bg-lime-300 text-black ml-auto"
            : "bg-stone-50 text-black"
        }`}
      >
        <div>{msg.content}</div>

        <div className="text-xs text-gray-600 mt-1 flex justify-end items-center gap-1">
          <span>
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {msg.senderId === "me" && (
            <>
              {msg.status === MessageStatus.DELIVERED && (
                <DoubleCheckIcon className="text-gray-500" />
              )}
              {msg.status === MessageStatus.SENT && (
                <SingleCheckIcon className="text-gray-500" />
              )}
              {msg.status === MessageStatus.READ && (
                <DoubleCheckIcon className="text-blue-500" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SingleCheckIcon({ className = "" }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 12l4 4L18 7" />
    </svg>
  );
}

function DoubleCheckIcon({ className = "" }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 12l4 4L10 9" />
      <path d="M5 12l4 4L18 7" />
    </svg>
  );
}
