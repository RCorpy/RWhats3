// components/MessageInput.tsx
interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  error?: string | null;
}

export default function MessageInput({ value, onChange, onSend, disabled, error }: MessageInputProps) {
  return (
    <div>
      {error && (
        <div className="text-red-600 px-4 mb-2 text-sm">{error}</div>
      )}
      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Escribe un mensaje..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={disabled}
        />
        <button
          className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
          onClick={onSend}
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14L21 3m0 0l-6.5 18a.5.5 0 01-.9.1L10 14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
