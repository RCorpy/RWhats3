// components/ProfilePicture.tsx
import { useState } from "react";

type Props = {
  name: string;
  profilePic?: string;
  size?: number; // optional size prop
};

export default function ProfilePicture({ name, profilePic, size = 40 }: Props) {
  const [imgError, setImgError] = useState(false);
  const initials = name[0]?.toUpperCase() || "?";

  const style = {
    width: size,
    height: size,
    fontSize: size * 0.4,
  };

  if (profilePic && !imgError) {
    return (
      <img
        src={profilePic}
        onError={() => setImgError(true)}
        alt="Profile"
        className="rounded-full object-cover mr-4"
        style={style}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-green-500 text-white flex items-center justify-center font-bold mr-4"
      style={style}
    >
      {initials}
    </div>
  );
}
