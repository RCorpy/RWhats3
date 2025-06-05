import React, { useRef, useEffect } from "react";

interface ChatOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  waId: string;
}

export default function ChatOptionsModal({ isOpen, onClose, waId }: ChatOptionsModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAction = async (action: "pin" | "mute") => {
    try {
      await fetch(`/api/chat/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waId }),
      });
      onClose();
    } catch (error) {
      console.error(`Error al hacer ${action}:`, error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 z-40">
      <div
        ref={modalRef}
        className="bg-white border shadow-lg rounded-xl p-4 w-64"
      >
        <h2 className="text-base font-semibold mb-4">Opciones del chat</h2>

        <button
          onClick={() => handleAction("pin")}
          className="w-full text-left mb-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          📌 Pin / Unpin
        </button>

        <button
          onClick={() => handleAction("mute")}
          className="w-full text-left mb-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          🔇 Mute / Unmute
        </button>

        <button
          disabled
          className="w-full text-left mb-2 px-4 py-2 bg-gray-100 text-gray-400 cursor-not-allowed rounded"
        >
          🚫 Block / Unblock (próximamente)
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-black mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
