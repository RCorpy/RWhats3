import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import { useUserStore } from './stores/userStore';
import { useMessageStore, MessageStatus } from "./stores/messageStore";

export default function AppRouter() {
  const { user } = useUserStore();
  const isLoggedIn = user?.isLoggedIn;

  useEffect(() => {
    const eventSource = new EventSource("https://bricopoxi.com/sse");
    //console.log("useEffect called")
    eventSource.onopen = () => {
      console.log("✅ SSE connection opened");
    };

    eventSource.onmessage = (event) => {
      console.log("📨 New WhatsApp message:", event.data);
      // You can dispatch this to Zustand store or other handlers, example

      //📨 New WhatsApp message: {"_id": "a60f560f-f061-4e02-923b-67a80b7125af", "chatWaId": "34628042210", "sender": "them", "content": "New?", 
      // "timestamp": {"$date": "2025-08-03 20:49:18.168270"}, "status": "sent", "file": null, "fileName": null, "referenceContent": null, 
      // "wabaMessageId": "wamid.HBgLMzQ2MjgwNDIyMTAVAgASGCBCQjE1Mjc5OEU1QTkwOUNDNkYyMUJCMjc5RUUzMTUyMwA="}
        const raw = JSON.parse(event.data);

      // Convert ISO date string to timestamp in milliseconds
      let timestamp = Date.now();
      if (raw.timestamp?.$date) {
        timestamp = new Date(raw.timestamp.$date).getTime();
      }

      // Build the message object as expected by Zustand store
      const message = {
        id: raw._id,
        chatId: raw.chatWaId,
        senderId: raw.sender,
        content: raw.content,
        timestamp,
        status: raw.status as MessageStatus,
        file: raw.file || undefined,
        referenceContent: raw.referenceContent || undefined,
        reactions: raw.reactions || [],
      };

      // Push to store
      useMessageStore.getState().addMessage(message.chatId, message);

    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE Error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Cleanup when component unmounts
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/chats" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chats" element={isLoggedIn ? <ChatListPage /> : <Navigate to="/login" />} />
        <Route path="/chats/:chatId" element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
