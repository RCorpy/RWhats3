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
          {/* Placeholder circle avatar */}
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm mr-4">
            {chat.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
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
