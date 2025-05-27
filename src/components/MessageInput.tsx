import { useRef } from "react";
import { Paperclip, Send } from "lucide-react"; // Or any icon you prefer

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  error?: string;
  onAttachFile?: (file: File) => void; // 👈 New prop
};

export default function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  error,
  onAttachFile,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAttachFile?.(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center px-4 py-2 bg-white border-t">
      {/* ===== Attach File Button ===== */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-600 hover:text-gray-800 mr-2"
        disabled={disabled}
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ===== Input Field ===== */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border rounded-full px-4 py-2 text-sm"
        placeholder="Escribe un mensaje..."
        disabled={disabled}
      />

      {/* ===== Send Button ===== */}
      <button
        onClick={onSend}
        className="ml-2 text-blue-600 hover:text-blue-800"
        disabled={disabled || !value.trim()}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
