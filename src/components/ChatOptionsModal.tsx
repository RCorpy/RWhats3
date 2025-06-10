import React, { useRef, useEffect, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import { useUserStore } from "../stores/userStore";
import ManageParticipantsModal from "./ManageParticipantsModal";

interface ChatOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  waId: string;
}

export default function ChatOptionsModal({ isOpen, onClose, waId }: ChatOptionsModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { user } = useUserStore();
  const chat = useChatStore((state) => state.chats[waId]);
  const [modalType, setModalType] = useState<"add" | "remove" | null>(null);

  const isAdmin = chat?.participants?.some(
    (p) => p.waId === user?.waId && p.isAdmin
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
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


  const handleAction = async (action: "pin" | "mute" | "block") => {
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
    <div ref={wrapperRef}>
      <div
        ref={modalRef}
        className="absolute top-16 right-4 z-40 bg-white border shadow-lg rounded-xl p-4 w-64"
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
          onClick={() => handleAction("block")}
          className="w-full text-left mb-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          🚫 Block / Unblock
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setModalType("add")}
              className="w-full text-left mb-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded"
            >
              ➕ Agregar participante
            </button>

            <button
              onClick={() => setModalType("remove")}
              className="w-full text-left mb-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
            >
              ➖ Quitar participante
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-black mt-4"
        >
          Cerrar
        </button>
      </div>

      {modalType && (
        <ManageParticipantsModal
          type={modalType}
          groupWaId={waId}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
