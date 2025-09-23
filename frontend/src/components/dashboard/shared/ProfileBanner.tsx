/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import standInBg from "@/assets/images/road.jpg";
import { server } from "@/utils/envUtility";

function ProfileBanner({ profile, onBannerChange, onAvatarChange }: any) {
  const apiUrl = server;

  return (
    <div className="relative w-full">
      {/* Banner Background */}
      <div className="w-full h-48 bg-sky-100 rounded-t-2xl overflow-hidden relative">
        <img
          src={
            profile?.avatarBg
              ? `${apiUrl}/users/${profile?._id}/banner?ts=${Date.now()}`
              : standInBg
          }
          alt="Banner"
          className="w-full h-full object-cover"
        />
        {/* <img src={new URL(standInBg, import.meta.url).href} /> */}

        {/* Banner Upload Button */}
        <label className="absolute top-3 right-3 cursor-pointer bg-white/70 hover:bg-white rounded-full p-2 shadow">
          <Camera className="w-5 h-5 text-sky-700" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onBannerChange}
          />
        </label>
      </div>

      {/* Avatar */}
      <div className="absolute -bottom-16 md:left-25 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage
              src={
                profile?.avatarUrl
                  ? `${apiUrl}/users/${profile?._id}/avatar?ts=${Date.now()}`
                  : undefined
              }
              alt={profile?.name}
            />
            <AvatarFallback className="text-2xl font-bold bg-sky-200 text-sky-800">
              {profile?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Avatar Upload Button */}
          <label className="absolute bottom-2 right-2 cursor-pointer bg-white rounded-full p-2 shadow">
            <Camera className="w-4 h-4 text-sky-600" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ProfileBanner;