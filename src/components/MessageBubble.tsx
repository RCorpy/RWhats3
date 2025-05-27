import { MessageStatus } from "../stores/messageStore";
import { ReactNode } from "react";

interface MessageBubbleProps {
  msg: {
    id: string;
    senderId: string;
    content: string;
    timestamp: number;
    status: MessageStatus;
    file?: File | string;
  };
  showDateChip: boolean;
  dateChipLabel: string;
}

export default function MessageBubble({
  msg,
  showDateChip,
  dateChipLabel,
}: MessageBubbleProps) {
  const fromMe = msg.senderId === "me";

  let isFile = false;
  let content: ReactNode;

  if (msg.file) {
    isFile = true;

    // Handle file display depending on type
    if (typeof msg.file === "string") {
      // If it's a URL or string placeholder
      content = (
        <div className="p-3 rounded-md bg-lime-300 text-black">
          <div className="font-bold text-sm flex items-center gap-2">
            📄 <a href={msg.file} target="_blank" rel="noopener noreferrer" className="underline">{msg.content}</a>
          </div>
        </div>
      );
    } else {
      // It's a File object
      content = (
        <div className="p-3 rounded-md bg-lime-300 text-black">
          <div className="font-bold text-sm flex items-center gap-2">
            📄 {msg.file.name}
          </div>
          <div className="text-xs text-black mt-1">{msg.file.type}</div>
        </div>
      );
    }
  } else {
    content = <div>{msg.content}</div>;
  }

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
          fromMe
            ? isFile
              ? "bg-lime-600 text-white ml-auto"
              : "bg-lime-300 text-black ml-auto"
            : isFile
            ? "bg-stone-500 text-white"
            : "bg-stone-50 text-black"
        }`}
      >
        {content}

        <div
          className={`text-xs mt-1 flex justify-end items-center gap-1 ${
            isFile ? "text-gray-200" : "text-gray-600"
          }`}
        >
          <span>
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {fromMe && (
            <>
              {msg.status === MessageStatus.DELIVERED && (
                <DoubleCheckIcon
                  className={isFile ? "text-gray-300" : "text-gray-500"}
                />
              )}
              {msg.status === MessageStatus.SENT && (
                <SingleCheckIcon
                  className={isFile ? "text-gray-300" : "text-gray-500"}
                />
              )}
              {msg.status === MessageStatus.READ && (
                <DoubleCheckIcon className="text-blue-200" />
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
    <svg
      className={`w-4 h-4 ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M5 12l4 4L18 7" />
    </svg>
  );
}

function DoubleCheckIcon({ className = "" }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M1 12l4 4L10 9" />
      <path d="M5 12l4 4L18 7" />
    </svg>
  );
}
