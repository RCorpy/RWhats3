import { useRef, useEffect, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: (message: string, file?: File) => void; // Changed
  disabled?: boolean;
  error?: string;
};

export default function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  error,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      e.target.value = ""; // reset input
    }
  };

  const handleSend = () => {
    if (!value.trim() && !selectedFile) return;

    onSend(value.trim(), selectedFile || undefined);
    onChange(""); // Clear the text input
    setSelectedFile(null); // Clear the file
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1 px-4 py-2 bg-white border-t">
      {selectedFile && (
        <div className="flex items-center justify-between bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-lg">
          <span className="truncate max-w-[80%]">{selectedFile.name}</span>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
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
              handleSend();
            }
          }}
          rows={1}
          placeholder="Escribe un mensaje..."
          disabled={disabled}
          className="flex-1 resize-none overflow-hidden border rounded-xl px-4 py-2 text-sm focus:outline-none max-h-32"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          className="text-blue-600 hover:text-blue-800"
          disabled={disabled || (!value.trim() && !selectedFile)}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
