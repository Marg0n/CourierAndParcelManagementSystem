/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

function ProfileAvatar({ profile, onAvatarChange, onBgChange }: any) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar with changeable background */}
      <div
        className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-lg`}
        style={{ backgroundColor: profile?.avatarBg || "#e0f2fe" }} // default sky-100
      >
        <Avatar className="w-28 h-28">
          <AvatarImage src={profile?.avatarUrl} alt={profile?.name} />
          <AvatarFallback className="text-xl font-bold">
            {profile?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Change Avatar */}
      <label className="absolute bottom-2 right-6 cursor-pointer bg-white rounded-full p-2 shadow">
        <Camera className="w-4 h-4 text-sky-600" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
        />
      </label>

      {/* Change Background Color */}
      <div className="mt-3 flex gap-2">
        {["#e0f2fe", "#fce7f3", "#fef3c7", "#dcfce7", "#f3e8ff"].map(
          (color) => (
            <button
              key={color}
              onClick={() => onBgChange(color)}
              className="w-6 h-6 rounded-full border shadow"
              style={{ backgroundColor: color }}
            />
          )
        )}
      </div>
    </div>
  );
}

export default ProfileAvatar;