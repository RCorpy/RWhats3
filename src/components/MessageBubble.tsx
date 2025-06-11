import React, { forwardRef, ReactNode, useState, useEffect, useRef  } from "react";
import { MessageStatus, Reaction } from "../stores/messageStore";

interface MessageBubbleProps {
  msg: {
    id: string;
    senderId: string;
    content: string;
    timestamp: number;
    status: MessageStatus;
    file?: File | string;
    fileName?: string;
    referencedContent?: string;
    reactions?: Reaction[];
  };
  showDateChip: boolean;
  dateChipLabel: string;
  isGroup?: boolean;   
  senderName?: string; 
  senderNameColor?: string;
  onDeleteMessage?: (messageId: string, requesterId: string) => void;
  onReference?: (content: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ msg, showDateChip, dateChipLabel, isGroup, senderName, senderNameColor, onDeleteMessage, onReference, onReact}, ref) => {
    const fromMe = msg.senderId === "me";
    const isFile = !!msg.file;
    const [showOptions, setShowOptions] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const toggleOptions = () => setShowOptions(!showOptions);
    let fileElement: ReactNode = null;
    let referencedElement: ReactNode = null;
    const reactions = ["👍", "😊", "😂", "🎉", "😮", "❤️"];
  
    const reactionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          reactionRef.current &&
          !reactionRef.current.contains(event.target as Node)
        ) {
          setShowReactions(false);
          setShowOptions(false);
        }
      }

      if (showOptions || showReactions) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showReactions, showOptions]);



    if (msg.file) {
      if (typeof msg.file === "string") {
        // Show only the filename or a generic label
        const displayFileName = msg.fileName|| msg.file.split("/").pop();
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
                {displayFileName || "Ver archivo"}
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
    if (msg.referencedContent){
        referencedElement = (
          <div className="p-2 rounded bg-lime-200 text-black">
            <div className="font-bold text-sm flex items-center gap-2">
              {msg.referencedContent}
            </div>
          </div>
        );
    }

    const bubbleAlignmentClass = fromMe ? "ml-auto" : "mr-auto";
    // Conditional background based on sender and file presence
    let bubbleBgColor = "";
    if (fromMe) {
        bubbleBgColor = isFile ? "bg-lime-600 text-white" : "bg-lime-300 text-black";
    } else {
        bubbleBgColor = isFile ? "bg-stone-500 text-white" : "bg-stone-50 text-black";
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

        <div className={`max-w-[75%] px-3 py-2 rounded-lg relative ${bubbleAlignmentClass} ${bubbleBgColor} mt-1`}>
          {!fromMe && isGroup && senderName && (
            <div className={`text-xs font-semibold mb-1 ${senderNameColor || 'text-gray-700'}`}>
              {senderName}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {fileElement}
            {referencedElement}
            {msg.content && msg.content.trim() !== "" && ( // Ensure content is checked for null/undefined too
              <div className="whitespace-pre-line">{msg.content}</div>
            )}
          </div>

  <div
    className={`text-xs flex justify-between items-end mt-1 ${
      isFile ? "text-gray-200" : "text-gray-600"
    }`}
  >
    {/* LEFT: Emoji Reactions */}
    {msg.reactions && msg.reactions.length > 0 ? (
      <div className="flex gap-1 px-2 py-1 rounded-full bg-gray-100 w-fit text-sm translate-y-[2em]">
        {Object.entries(
          msg.reactions.reduce((acc, r) => {
            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([emoji, count]) => (
          <span key={emoji}>
            {emoji} {count > 1 ? count : null}
          </span>
        ))}
      </div>
    ) : (
      <div />
    )}

  {/* RIGHT: Time + Status */}
  <div className="flex items-center gap-1">
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

          {/* Botón de opciones */}
          <div className="absolute top-1 right-1">
            <button
              onClick={toggleOptions}
              className="text-gray-500 hover:text-gray-700"
            >⋮</button>
            <div ref={reactionRef}>

            {showReactions && (
                <div className="absolute bottom-full mb-1 left-0 bg-white border shadow-lg rounded-xl p-1 flex gap-1 z-20">
                  {reactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReact(msg.id, emoji);
                        setShowReactions(false);
                      }}
                      className="text-xl hover:scale-110 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            {showOptions && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setShowOptions(false);
                    setShowReactions(true)
                    console.log("❤️ Reaccionar a mensaje", msg.id);
                    // Aquí podrías abrir una mini UI de reacciones o algo simple por ahora
                  }}
                >
                  Reaccionar
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setShowOptions(false);
                    onReference(msg.content.trim())
                    console.log("📌 Referenciar mensaje", msg.id);
                    // Aquí llamas a una función global/store para referenciar
                  }}
                >
                  Referenciar
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
                  onClick={() => {
                    setShowOptions(false);
                    onDeleteMessage?.(msg.id, msg.senderId);
                    console.log("🗑️ Borrar mensaje", msg.id);
                    // Aquí llamas al store para borrarlo
                  }}
                >
                  Borrar
                </button>
              </div>
            )}
            </div>
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
