// src/pages/ChatPage.tsx
import { useParams } from 'react-router-dom';
import { useChatStore } from '.././stores/chatStore';
import { useMessageStore } from '.././stores/messageStore';
import { useState } from 'react';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const chat = useChatStore((s) => s.chats[chatId!]);
  const messages = useMessageStore((s) => s.messages[chatId!] || []);
  const addMessage = useMessageStore((s) => s.addMessage);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    addMessage(chatId!, {
      id: Date.now().toString(),
      chatId: chatId!,
      senderId: 'me',
      content: text,
      timestamp: Date.now(),
      status: 'sent',
    });
    setText('');
  };

  if (!chat) return <div className="p-4">Chat not found</div>;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b font-bold">{chat.name}</header>
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`text-sm ${msg.senderId === 'me' ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-gray-200 p-2 rounded">{msg.content}</span>
          </div>
        ))}
      </div>
      <footer className="p-4 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </footer>
    </div>
  );
}
