import { useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
  error?: string;
  onAttachFile?: (file: File) => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachFile?.(file);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="flex items-center px-4 py-2 bg-white border-t gap-2">
      {/* File input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Attach button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-600 hover:text-gray-800"
        disabled={disabled}
      >
        <Paperclip className="w-5 h-5" />
      </button>

      {/* Message input */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) onSend();
          }
        }}
        rows={1}
        placeholder="Escribe un mensaje..."
        disabled={disabled}
        className="flex-1 resize-none overflow-hidden border rounded-xl px-4 py-2 text-sm focus:outline-none max-h-32"
      />

      {/* Send button */}
      <button
        onClick={onSend}
        className="text-blue-600 hover:text-blue-800"
        disabled={disabled || !value.trim()}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
