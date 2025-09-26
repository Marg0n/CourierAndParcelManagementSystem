/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import standInBg from "@/assets/images/road.jpg";
import { server } from "@/utils/envUtility";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import type { TUser } from "@/utils/types";

//* Define a proper interface for the profile prop for better type safety
interface ProfileBannerProps {
  profile: TUser;
  onBannerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

//! HELPER FUNCTION: To convert Blob to Base64 Data URL (eliminates URL.revokeObjectURL cleanup)
const blobToBase64 = (blob: Blob, mimeType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      //? Split the result to get just the base64 part and prefix it correctly
      resolve(
        `data:${mimeType};base64,${reader.result?.toString().split(",")[1]}`,
      );
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function ProfileBanner({
  profile,
  onBannerChange,
  onAvatarChange,
}: ProfileBannerProps) {
  //* Server URL
  const apiUrl = server;

  //* State data from store
  const { accessToken } = useAuthStore();
  const [avatarDataUrl, setAvatarDataUrl] = useState(""); //* Avatar state to better reflect Base64 data
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true); //* Explicit loading state for the avatar
  const [isLoadingBanner, setIsLoadingBanner] = useState(true); //* Explicit loading state for the avatar
  const [bannerDataUrl, setBannerDataUrl] = useState(""); //* Banner state to better reflect Base64 data

  //* Wrap Avatar fetch logic in useCallback for stability
  const fetchAvatar = useCallback(async () => {
    //? Added check for required data before fetching
    if (!profile?._id) {
      setIsLoadingAvatar(false);
      return;
    }

    setIsLoadingAvatar(true);

    //? Use a unique ID for the toast specific to this fetch, if needed, but often not necessary for simple fetching success
    const fetchToastId = "avatar-fetch-" + profile?._id;

    try {
      //? Fetch the data from server endpoint
      const res = await fetch(
        `${apiUrl}/users/${profile?._id}/avatar?ts=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      //? Handle 404/No-Content gracefully (e.g., if the user hasn't set an avatar)
      if (res.status === 404 || res.status === 204) {
        setAvatarDataUrl(""); //? Ensure the URL is cleared to show fallback
        setIsLoadingAvatar(false);
        return;
      }

      if (!res.ok) {
        toast.error("Failed to fetch avatar", {
          id: fetchToastId, //? Use specific ID
          description: "Failed to fetch avatar",
          duration: 1000,
        });
        throw new Error("Failed to fetch avatar");
      }

      //* Explicitly get the Content-Type
      const mimeType = res.headers.get("Content-Type") || "image/png";

      //* Get the response body as a Blob (binary data)
      const imageBlob = await res.blob();

      //* Convert Blob to Base64 Data URL
      const base64Url = await blobToBase64(imageBlob, mimeType);

      setAvatarDataUrl(base64Url);

      //* Create a Data URL from the Blob
      //? This is a browser-side URL representing the binary data (e.g., blob:http://...)
      // const objectUrl = URL.createObjectURL(imageBlob);
      // setAvatarUrl(objectUrl);

      toast.success("Avatar Loaded successful", {
        description: "Avatar Loading successful",
        duration: 1000,
      });

      // console.log(res);
    } catch (err) {
      toast.error("Connection failed.", {
        id: fetchToastId,
        description: "Could not connect to the avatar server.",
      });
      setAvatarDataUrl("");
      console.error("Error fetching: ", err);
    } finally {
      setIsLoadingAvatar(false);
    }
  }, [apiUrl, accessToken, profile?._id]); //? Dependencies for useCallback

  //* Wrap Banner fetch logic in useCallback for stability
  const fetchBanner = useCallback(async () => {
    //? Added check for required data before fetching
    if (!profile?._id) {
      setIsLoadingBanner(false);
      return;
    }

    setIsLoadingBanner(true);

    //? Use a unique ID for the toast specific to this fetch, if needed, but often not necessary for simple fetching success
    const fetchToastId = "banner-fetch-" + profile?._id;

    try {
      //? Fetch the data from server endpoint
      const res = await fetch(
        `${apiUrl}/users/${profile?._id}/banner?ts=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      //? Handle 404/No-Content gracefully (e.g., if the user hasn't set an avatar)
      if (res.status === 404 || res.status === 204) {
        setBannerDataUrl(""); //? Ensure the URL is cleared to show fallback
        setIsLoadingBanner(false);
        return;
      }

      if (!res.ok) {
        toast.error("Failed to load banner", {
          id: fetchToastId, //? Use specific ID
          description: `Error ${res.status}: Could not retrieve image data.`,
          duration: 3000,
        });
        throw new Error("Failed to fetch banner");
      }

      //? Explicitly get the Content-Type
      const mimeType = res.headers.get("Content-Type") || "image/png";

      //? Get the response body as a Blob (binary data)
      const imageBlob = await res.blob();

      //? Convert Blob to Base64 Data URL
      const base64Url = await blobToBase64(imageBlob, mimeType);

      setBannerDataUrl(base64Url);
    } catch (err) {
      toast.error("Network Error.", {
        id: fetchToastId,
        description: "Could not connect to the server to load the banner.",
      });
      setBannerDataUrl("");
      console.error("Error fetching: ", err);
    } finally {
      setIsLoadingBanner(false);
    }
  }, [apiUrl, accessToken, profile?._id]);

  //* Calling Avatar and Banner
  useEffect(() => {
    fetchAvatar();
    fetchBanner();

    //! Cleanup: Revoke the object URL when the component unmounts
    // return () => {
    //   if (avatarUrl) {
    //     URL.revokeObjectURL(avatarUrl);
    //   }
    // };

    //? No cleanup needed for Base64 Data URL, simplifying the cleanup function
    //? The previous URL.revokeObjectURL logic is removed because it's only needed for Object URLs.
    return () => {};
  }, [fetchAvatar, fetchBanner]);

  //* Compute initials once
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="relative w-full">
      {/* Banner Background */}
      <div className="w-full h-48 bg-sky-100 rounded-t-2xl overflow-hidden relative">
        {
          //? Use the loading state to show a skeleton/placeholder
          isLoadingBanner ? (
            //? Using a simple div with a pulse animation as a Skeleton for the large banner area
            <div className="w-full h-full bg-gray-200 animate-pulse" >
              <img
                src={standInBg}
                alt={profile?.name ? `${profile.name}'s banner` : "User banner"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <img
              src={bannerDataUrl || standInBg
                //? FIX/CLARIFICATION: Check if a custom banner exists AND if we successfully fetched its data
                // profile?.avatarBg && bannerDataUrl
                //   ? bannerDataUrl
                //   : standInBg
              }
              alt={profile?.name ? `${profile.name}'s banner` : "User banner"}
              className="w-full h-full object-fill"
            />
          )
        }
        {/* <img
          src={
            profile?.avatarBg
              ? `${bannerDataUrl}`
              : standInBg
          }
          alt={profile?.name ? `${profile.name}'s banner` : "User banner"}
          className="w-full h-full object-cover"
        /> */}
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
            {/* <AvatarImage
              src={
                profile?.avatarUrl
                  ? // ? `${apiUrl}/users/${profile?._id}/avatar?ts=${Date.now()}`
                    `${avatarUrl}`
                  : undefined
              }
              alt={profile?.name}
            /> */}

            {/* 🔥 Conditional rendering for loading state */}
            {isLoadingAvatar ? (
              <AvatarFallback className="w-full h-full bg-gray-200 animate-pulse rounded-full">
                {initials}
              </AvatarFallback>
            ) : (
              <AvatarImage
                //? Use avatarDataUrl (Base64) state instead of the old objectUrl state
                src={avatarDataUrl}
                alt={`${profile?.name}'s avatar`}
              />
            )}
            {!isLoadingAvatar && (
              <AvatarFallback className="text-2xl font-bold bg-sky-200 text-sky-800">
                {/* {profile?.name?.charAt(0) || "U"} */}
                {initials}
              </AvatarFallback>
            )}
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
