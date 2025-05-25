import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useNavigate } from 'react-router-dom';

export default function ChatListPage() {
  const chats = useChatStore((s) => s.chats);
  const setChats = useChatStore((s) => s.setChats);
  const navigate = useNavigate();

  // Fetch chats when component mounts
  useEffect(() => {
    fetch("/api/chats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chats");
        return res.json();
      })
      .then((data) => {
        setChats(data); // Populate Zustand store
      })
      .catch((err) => {
        console.error("Error loading chats:", err);
      });
  }, [setChats]);

  const sortedChats = Object.values(chats).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold mb-2">Chats</h1>
      {sortedChats.map((chat) => (
        <div
          key={chat.id}
          className="border p-3 rounded cursor-pointer hover:bg-gray-100"
          onClick={() => navigate(`/chats/${chat.id}`)}
        >
          <div className="font-semibold">{chat.name}</div>
          <div className="text-sm text-gray-600">{chat.lastMessage}</div>
        </div>
      ))}
    </div>
  );
}
