import { useRef, useEffect, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: (message: string, file?: File, referenceContent?: string) => void; // Changed
  disabled?: boolean;
  error?: string;
  referencedMessageContent?: string;
  onCancelReference: () => void;
};

const MAX_SIZE_BY_TYPE: { [key: string]: number } = {
  "image": 5,
  "video": 16,
  "audio": 16,
  "application": 100, // pdf, doc, xls fall under "application/*"
};

export default function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
  error,
  referencedMessageContent,
  onCancelReference
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileTypeCategory = file.type.split("/")[0]; // "image", "video", "audio", etc.
      if (fileTypeCategory === "application"){
        const file_extension = file.type.split("/")[1]
        if (file_extension !== "pdf" && file_extension !== "doc" && file_extension !== "xls" && file_extension !=="docx" && file_extension !=="xlsx" && file_extension !=="txt"){
          alert(`El archivo no tiene un formato permitido.`);
          e.target.value = ""; // Reset file input
          return;
        }
        
      }
      const maxSizeMB = MAX_SIZE_BY_TYPE[fileTypeCategory] || 100;

      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > maxSizeMB) {
        alert(`El archivo es demasiado grande. Máximo permitido para ${fileTypeCategory}: ${maxSizeMB} MB.`);
        e.target.value = ""; // Reset file input
        return;
      }


      setSelectedFile(file);
      e.target.value = ""; // Reset file input
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

    recorder.onstop = () => {
      // Combine all recorded chunks directly at stop time
      const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });

      if (blob.size > 0) {
        const file = new File([blob], `grabacion-${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        setSelectedFile(file);
      } else {
        alert("La grabación falló o está vacía.");
      }

      recordedChunksRef.current = [];
    };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert("No se pudo acceder al micrófono.");
      console.error(err);
    }
  };

  const handleStopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    mediaRecorder?.stream.getTracks().forEach(track => track.stop()); // Stop mic access
  };

  const handleSend = () => {
    if (!value.trim() && !selectedFile) return;

    onSend(value.trim(), selectedFile || undefined, referencedMessageContent || undefined);
    onCancelReference();
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
      {referencedMessageContent && (
        <div className="reference-preview">
          <p className="text-sm text-gray-500">
            Respondiendo a: {referencedMessageContent}
          </p>
          <button onClick={onCancelReference}>Cancelar</button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* File input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
            accept="
              .pdf,
              image/*,
              video/*,
              audio/*,
              .doc,.docx,
              .xls,.xlsx
            "
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

        {/* Audio Record button */}
        <button
          type="button"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`text-${isRecording ? "red" : "gray"}-600 hover:text-${isRecording ? "red" : "gray"}-800`}
          disabled={disabled}
        >
          {isRecording ? (
            <span className="text-xs">⏺️ Grabando...</span>
          ) : (
            <span className="text-lg">🎤</span>
          )}
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
