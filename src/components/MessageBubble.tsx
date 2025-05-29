import React, { forwardRef, ReactNode } from "react";
import { MessageStatus } from "../stores/messageStore";

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

const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ msg, showDateChip, dateChipLabel }, ref) => {
    const fromMe = msg.senderId === "me";
    const isFile = !!msg.file;

    let fileElement: ReactNode = null;

    if (msg.file) {
      if (typeof msg.file === "string") {
        // Show only the filename or a generic label
        const fileName = msg.file.split("/").pop();
        fileElement = (
          <div className="p-2 rounded bg-lime-200 text-black">
            <div className="font-bold text-sm flex items-center gap-2">
              📄{" "}
              <a
                href={msg.file}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {fileName || "Ver archivo"}
              </a>
            </div>
          </div>
        );
      } else {
        fileElement = (
          <div className="p-2 rounded bg-lime-200 text-black">
            <div className="font-bold text-sm flex items-center gap-2">
              📄 {msg.file.name}
            </div>
            <div className="text-xs text-black mt-1">{msg.file.type}</div>
          </div>
        );
      }
    }

    return (
      <div ref={ref} key={msg.id}>
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
              ? "ml-auto " +
                (isFile ? "bg-lime-600 text-white" : "bg-lime-300 text-black")
              : isFile
              ? "bg-stone-500 text-white"
              : "bg-stone-50 text-black"
          }`}
        >
          <div className="flex flex-col gap-2">
            {fileElement}
            {msg.content.trim() !== "" && (
              <div className="whitespace-pre-line">{msg.content}</div>
            )}
          </div>

          <div
            className={`text-xs flex justify-end gap-1 mt-1 ${
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
);

export default MessageBubble;

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
