// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '.././stores/userStore';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const login = useUserStore((s) => s.login);
  const setLoading = useUserStore((s) => s.setLoading);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Simulate auth (replace with real API call later)
      const fakeUser = {
        id: phoneNumber,
        name: 'Business User',
        phoneNumber,
        accessToken,
        waId: phoneNumber,
        businessName: 'Demo Co.',
        isLoggedIn: true,
        isLoading: false,
        userType: 'admin' as const,
      };
      login(fakeUser);
      navigate('/chats');
    } catch (e) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Login</h1>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Access Token"
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Log In
      </button>
    </div>
  );
}
