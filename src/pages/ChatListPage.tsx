import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useContactStore } from '../stores/contactStore';
import { useNavigate } from 'react-router-dom';

import ProfilePicture from "../components/ProfilePicture";

export default function ChatListPage() {
  const chats = useChatStore((s) => s.chats);
  const setChats = useChatStore((s) => s.setChats);
  const setContacts = useContactStore((s) => s.setContacts);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("/api/chats"),
      fetch("/api/contacts")
    ])
      .then(async ([chatsRes, contactsRes]) => {
        if (!chatsRes.ok) throw new Error("Failed to fetch chats");
        if (!contactsRes.ok) throw new Error("Failed to fetch contacts");

        const chatsData = await chatsRes.json();
        const contactsData = await contactsRes.json();
        console.log("contactsData", contactsData)
        setChats(chatsData);
        setContacts(contactsData);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
      });
  }, [setChats, setContacts]);

  const sortedChats = Object.values(chats).sort((a, b) => {
    // Primero pinneados arriba
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Si ambos igual en pin, ordenar por timestamp descendente
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <h1 className="text-lg font-bold px-4 py-3 border-b border-gray-200 bg-gray-50">
        Chats
      </h1>
      {sortedChats.map((chat) => (
        <div
          key={chat.id}
          className="px-4 py-3 flex items-center border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
          onClick={() => navigate(`/chats/${chat.id}`)}
        >
          <ProfilePicture name={chat.name} profilePic={chat.picture} />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {chat.isBlocked && (<span title="This chat is blocked" className="text-red-500 ml-2">🚫</span>)}
              {chat.isPinned && <span title="Pinned">📌</span>}
              {chat.isMuted && <span title="Muted" className="mr-1">🔇</span>}
              {chat.name}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {chat.lastMessage}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
