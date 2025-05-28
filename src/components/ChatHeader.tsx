import { Search, MoreVertical } from "lucide-react";
import ProfilePicture from "./ProfilePicture";

type Props = {
  chatName: string;
  profilePic?: string;
  onBack: () => void;
  onSearchClick?: () => void;
  onMoreClick?: () => void;
};

export default function ChatHeader({
  chatName,
  profilePic,
  onBack,
  onSearchClick,
  onMoreClick,
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
          <h1 className="text-lg font-semibold">{chatName}</h1>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={onSearchClick}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={onMoreClick}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
