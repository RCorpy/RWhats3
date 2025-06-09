import React from "react";
import { useChatStore } from "../stores/chatStore";
import { useContactStore } from "../stores/contactStore";

interface ManageParticipantsModalProps {
  type: "add" | "remove";
  groupWaId: string;
  onClose: () => void;
}

export default function ManageParticipantsModal({
  type,
  groupWaId,
  onClose,
}: ManageParticipantsModalProps) {
  const chat = useChatStore((state) => state.chats[groupWaId]);
  const contacts = useContactStore((state) => state.contacts);

  const groupParticipants = chat?.participants?.map((p) => p.waId) || [];
  const contactList = Object.values(contacts);

  const candidates =
    type === "add"
      ? contactList.filter((c) => !groupParticipants.includes(c.id))
      : contactList.filter((c) => groupParticipants.includes(c.id));

  const handleAction = async (participantWaId: string) => {
    
    try {
      await fetch(
        `/api/chat/${type === "add" ? "add-participant" : "remove-participant"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupWaId, participantWaId }),
        }
      );
      onClose();
    } catch (error) {
      console.error(`Error al ${type === "add" ? "agregar" : "quitar"}:`, error);
    }
  };
  console.log("contacts: ", contactList);
  return (
    <div className="fixed top-20 right-4 z-50 bg-white border shadow-xl rounded-lg p-4 w-80 max-h-[80vh] overflow-auto">
      <h3 className="text-lg font-semibold mb-3">
        {type === "add" ? "Agregar participante" : "Quitar participante"}
      </h3>

      {candidates.length ? (
        candidates.map((contact) => (
          <button
            key={contact.id}
            onClick={() => handleAction(contact.id)}
            className="w-full text-left mb-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            {contact.name} ({contact.id})
          </button>
        ))
      ) : (
        <p className="text-sm text-gray-500">No hay contactos disponibles</p>
      )}

      <button
        onClick={onClose}
        className="mt-4 text-sm text-gray-600 hover:text-black"
      >
        Cerrar
      </button>
    </div>
  );
}
