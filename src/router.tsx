import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import { useUserStore } from './stores/userStore';

export default function AppRouter() {
  const { user } = useUserStore();
  const isLoggedIn = user?.isLoggedIn;

  useEffect(() => {
    const eventSource = new EventSource("https://bricopoxi.com/sse");

    eventSource.onmessage = (event) => {
      console.log("📨 New WhatsApp message:", event.data);
      // You can dispatch this to Zustand store or other handlers
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
