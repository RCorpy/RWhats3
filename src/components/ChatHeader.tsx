import { Search, MoreVertical, ChevronUp, ChevronDown } from "lucide-react";
import ProfilePicture from "./ProfilePicture";

type Props = {
  chatName: string;
  profilePic?: string;
  onBack: () => void;
  onSearchClick?: () => void;
  onMoreClick?: () => void;
  onPrevMatch?: () => void;
  onNextMatch?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  isSearchOpen?: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
};

export default function ChatHeader({
  chatName,
  profilePic,
  onBack,
  onSearchClick,
  onMoreClick,
  onPrevMatch,
  onNextMatch,
  disablePrev = false,
  disableNext = false,
  isSearchOpen = false,
  isMuted = false,
  isPinned = false
}: Props) {
  return (
    <div className="px-4 py-3 flex justify-between items-start">
      <div className="flex flex-col">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={onBack}
        >
          ← Volver a la lista de chats
        </button>
        <div className="flex items-center mt-2 gap-2">
          <ProfilePicture name={chatName} profilePic={profilePic} />
          <h1 className="text-lg font-semibold">
            {isPinned && <span title="Pinned">📌</span>}
            {isMuted && <span title="Muted" className="text-gray-400">🔇</span>}
            {chatName}
          </h1>
        </div>
      </div>
      <div className="flex gap-2 pt-2 items-center">


      {isSearchOpen && (
        <>
          <button
            onClick={onPrevMatch}
            disabled={disablePrev}
            className={`p-2 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed`}
            title="Mensaje anterior"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={onNextMatch}
            disabled={disableNext}
            className={`p-2 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed`}
            title="Siguiente mensaje"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </>
      )}
        <button
          onClick={onSearchClick}
          className="p-2 text-gray-600 hover:text-gray-800"
          title="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={onMoreClick}
          className="p-2 text-gray-600 hover:text-gray-800"
          title="Más opciones"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
