/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { useAuthStore } from "@/store/useAuthStore";
import { server } from "@/utils/envUtility";
import type { TUser } from "@/utils/types";
import { useEffect, useState } from "react";
import UserInfo from "../admin/UserInfo";
import ProfileBanner from "./ProfileBanner";

const UserProfile = () => {
  //* State data from store
  const { user, accessToken } = useAuthStore();

  //* States
  const [profile, setProfile] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  //* Get user data from server
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${server}/get-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      // console.log("Fetch response:", data);

      //? Normalize result
      setProfile(data || user);
    } catch (err) {
      console.error("Error fetching user: ", err);
    } finally {
      setLoading(false);
    }
  };

  //* Load profile once when component mounts
  useEffect(() => {
    if (user?.email) fetchProfile();
  }, [user]);

  //* Local state for editable fields
  // const [formData, setFormData] = useState<Partial<TUser>>({
  //   name: user?.name || "",
  //   email: user?.email || "",
  //   role: user?.role || "Customer", // fallback
  //   phone: profile?.phone || "",
  //   address: profile?.address || "",
  //   city: profile?.city || "",
  //   state: profile?.state || "",
  //   country: profile?.country || "",
  //   zipCode: profile?.zipCode || "",
  //   status: profile?.status || "active",
  //   needsPasswordChange: profile?.needsPasswordChange ?? false,
  //   passwordChangedAt: profile?.passwordChangedAt || undefined,
  //   createdAt: profile?.createdAt || undefined,
  //   updatedAt: profile?.updatedAt || undefined,
  //   avatarUrl: profile?.avatarUrl || undefined,
  //   avatarBg: profile?.avatarBg || undefined,
  //   bloodGroup: profile?.bloodGroup || "",
  //   emergencyContact: profile?.emergencyContact || "",
  //   gender: profile?.gender || undefined,
  //   dateOfBirth: profile?.dateOfBirth
  //     ? new Date(profile.dateOfBirth)
  //     : undefined,
  //   lastLogin: user?.lastLogin || undefined,
  //   lastUpdated: user?.lastUpdated || undefined,
  //   lastLoginIP: user?.lastLoginIP || "",
  // });

  //* Sync formData with updated profile
  // useEffect(() => {
  //   if (profile) {
  //     setFormData({
  //       name: profile.name || "",
  //       email: profile.email || "",
  //       role: profile.role || "Customer",
  //       phone: profile.phone || "",
  //       address: profile.address || "",
  //       city: profile.city || "",
  //       state: profile.state || "",
  //       country: profile.country || "",
  //       zipCode: profile.zipCode || "",
  //       status: profile.status || "active",
  //       needsPasswordChange: profile.needsPasswordChange ?? false,
  //       passwordChangedAt: profile.passwordChangedAt || undefined,
  //       createdAt: profile.createdAt || undefined,
  //       updatedAt: profile.updatedAt || undefined,
  //       avatarUrl: profile.avatarUrl || undefined,
  //       avatarBg: profile.avatarBg || undefined,
  //       bloodGroup: profile.bloodGroup || "",
  //       emergencyContact: profile.emergencyContact || "",
  //       gender: profile.gender || undefined,
  //       dateOfBirth: profile.dateOfBirth || undefined,
  //       lastLogin: profile.lastLogin || undefined,
  //       lastLoginIP: profile.lastLoginIP || "",
  //     });
  //   }
  // }, [profile]);

  //* Avatar change
  const handleAvatar = async (e: any) => {
    if (e.target.files?.[0]) {
      // setLoading(true);

      const formData = new FormData();
      formData.append("avatar", e.target.files[0]);
      await fetch(`${server}/users/${profile?._id}/avatar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }).then(() => {
        // setLoading(false);
        fetchProfile();
      });
    }
  };

  //* Banner change
  const handleBanner = async (e: any) => {
    if (e.target.files?.[0]) {
      // setLoading(true);

      const formData = new FormData();
      formData.append("banner", e.target.files[0]);
      await fetch(`${server}/users/${profile?._id}/banner`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }).then(() => {
        // setLoading(false);
        fetchProfile();
      });
    }
  };

  //* Loading state
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-h-full overflow-y-auto">
      <Card className="max-w-4xl mx-auto mt-8 shadow-xl rounded-2xl border border-sky-100">
        {/* Avatar + Banner */}
        <CardHeader>
          <ProfileBanner
            profile={profile!}
            onBannerChange={handleBanner}
            onAvatarChange={handleAvatar}
          />
        </CardHeader>

        {/* User Name */}
        <CardHeader className="md:mt-0 mt-12 text-center">
          <CardTitle className="text-3xl font-bold text-sky-800">
            {profile?.name || "John Smith"}
          </CardTitle>
          <p className="text-gray-500">
            {profile?.email || "john.smith@mail.com"}
          </p>
        </CardHeader>

        {/* Card Content */}
        <CardContent>
          <UserInfo profile={profile!} setProfile={setProfile!} />

          {/* ACTIONS */}
        </CardContent>
      </Card>

      {/* Role-specific info */}
      <div className="max-w-2xl mx-auto mt-6">
        {profile?.role === "Admin" && (
          <div className="mt-4 p-4 border rounded bg-sky-50">
            <h2 className="font-semibold text-sky-700">Admin Settings</h2>
            <p>Admins can edit roles, manage users, and system settings.</p>
          </div>
        )}

        {profile?.role === "Customer" && (
          <div className="mt-4 p-4 border rounded bg-emerald-50">
            <h2 className="font-semibold text-emerald-700">Customer Info</h2>
            <p>Manage delivery addresses, phone numbers, etc.</p>
          </div>
        )}

        {profile?.role === "Delivery Agent" && (
          <div className="mt-4 p-4 border rounded bg-amber-50">
            <h2 className="font-semibold text-amber-700">Agent Info</h2>
            <p>Track assigned parcels, update delivery statuses, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
