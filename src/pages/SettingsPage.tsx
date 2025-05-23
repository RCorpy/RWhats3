// src/pages/SettingsPage.tsx
import { useUserStore } from '.././stores/userStore';

export default function SettingsPage() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>
      {user ? (
        <div className="space-y-2">
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Phone:</strong> {user.phoneNumber}</div>
          <div><strong>Role:</strong> {user.userType}</div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div>Not logged in</div>
      )}
    </div>
  );
}
