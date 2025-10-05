/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "@/components/ui/InfoRow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { useAuthStore } from "@/store/useAuthStore";
import { server } from "@/utils/envUtility";
import { formatDate, formatDateOnly } from "@/utils/formatDate";
import type { TUser } from "@/utils/types";
import { format } from "date-fns";
import {
  BadgeCheck,
  CalendarIcon,
  Database,
  DatabaseBackup,
  Droplets,
  Globe,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Rss,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileBanner from "./ProfileBanner";

const UserProfile = () => {
  //* State data from store
  const { user, accessToken } = useAuthStore();

  //* States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

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
  const [formData, setFormData] = useState<Partial<TUser>>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Customer", // fallback
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    country: profile?.country || "",
    zipCode: profile?.zipCode || "",
    status: profile?.status || "active",
    needsPasswordChange: profile?.needsPasswordChange ?? false,
    passwordChangedAt: profile?.passwordChangedAt || undefined,
    createdAt: profile?.createdAt || undefined,
    updatedAt: profile?.updatedAt || undefined,
    avatarUrl: profile?.avatarUrl || undefined,
    avatarBg: profile?.avatarBg || undefined,
    bloodGroup: profile?.bloodGroup || "",
    emergencyContact: profile?.emergencyContact || "",
    gender: profile?.gender || undefined,
    dateOfBirth: profile?.dateOfBirth
      ? new Date(profile.dateOfBirth)
      : undefined,
    lastLogin: user?.lastLogin || undefined,
    lastUpdated: user?.lastUpdated || undefined,
    lastLoginIP: user?.lastLoginIP || "",
  });

  //* Sync formData with updated profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "Customer",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        zipCode: profile.zipCode || "",
        status: profile.status || "active",
        needsPasswordChange: profile.needsPasswordChange ?? false,
        passwordChangedAt: profile.passwordChangedAt || undefined,
        createdAt: profile.createdAt || undefined,
        updatedAt: profile.updatedAt || undefined,
        avatarUrl: profile.avatarUrl || undefined,
        avatarBg: profile.avatarBg || undefined,
        bloodGroup: profile.bloodGroup || "",
        emergencyContact: profile.emergencyContact || "",
        gender: profile.gender || undefined,
        dateOfBirth: profile.dateOfBirth || undefined,
        lastLogin: profile.lastLogin || undefined,
        lastLoginIP: profile.lastLoginIP || "",
      });
    }
  }, [profile]);

  //* Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: keyof TUser) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //* Save changes
  const handleSave = async () => {
    try {
      setSaving(false);

      //? formate data
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth //? in Date formate
          : undefined,
      };

      //? Update value
      const res = await fetch(`${server}/update-user/${user?.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      // console.log(data)

      if (res.ok) {
        //? success toast
        toast.success("Profile Updated 🎉", {
          description: "Your changes were saved successfully.",
        });

        //? Re-fetch profile to get updated data
        const updatedRes = await fetch(`${server}/get-user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const updatedProfile = await updatedRes.json();

        //? Update local state of user data
        setProfile(updatedProfile);
      } else {
        toast.error("Update Failed", {
          description:
            data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      toast("Network Error", {
        description: "Could not connect to the server. Try again later.",
      });
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

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
          <Tabs defaultValue="personal" className="w-full">
            {/* Tab Lists */}
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
              <TabsTrigger value="system">Security & System</TabsTrigger>
            </TabsList>

            {/* PERSONAL INFO */}
            <TabsContent value="personal" className="space-y-5">
              {!isEditing ? (
                <div className="space-y-4">
                  <InfoRow user={profile!} icon={User} label="Name" value={profile?.name} />
                  <InfoRow user={profile!} icon={Mail} label="Email" value={profile?.email} />
                  <InfoRow user={profile!} icon={Phone} label="Phone" value={profile?.phone} />
                  <InfoRow
                    user={profile!}
                    icon={CalendarIcon}
                    label="Date of Birth"
                    value={
                      profile?.dateOfBirth
                        ? formatDateOnly(profile.dateOfBirth)
                        : ""
                    }
                  />
                  <InfoRow
                    icon={MapPin}
                    user={profile!}
                    label="Address"
                    value={`${profile?.address || ""}, ${
                      profile?.city || ""
                    }, ${profile?.country || ""}`}
                  />
                  <InfoRow
                    icon={Droplets}
                    user={profile!}
                    label="Blood Group"
                    value={profile?.bloodGroup}
                  />
                  <InfoRow
                    icon={PhoneCall}
                    user={profile!}
                    label="Emergency Contact"
                    value={profile?.emergencyContact}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={formData.name || profile?.name}
                    onChange={handleChange}
                  />
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    value={formData.phone || profile?.phone}
                    onChange={handleChange}
                  />
                  <Label>Date of Birth</Label>
                  {/* <Input
                    type="date"
                    name="dateOfBirth"
                    value={
                      formData.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  /> */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.dateOfBirth
                          ? format(
                              new Date(formData.dateOfBirth),
                              "dd MMM yyyy"
                            ) //? format Date directly
                          : profile?.dateOfBirth
                          ? format(
                              new Date(profile?.dateOfBirth),
                              "dd MMM yyyy"
                            )
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={
                          formData.dateOfBirth
                            ? new Date(formData.dateOfBirth)
                            : undefined
                        }
                        onSelect={(date) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: date ?? undefined, //? keep Date in state
                          })
                        }
                        disabled={(date) => date > new Date()} //? disables future dates
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={formData.address || profile?.address}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="city"
                      placeholder="City"
                      value={formData.city || profile?.city}
                      onChange={handleChange}
                    />
                    <Input
                      name="country"
                      placeholder="Country"
                      value={formData.country || profile?.country}
                      onChange={handleChange}
                    />
                  </div>
                  <Label>Blood Group</Label>
                  <Select
                    onValueChange={(val) =>
                      handleSelectChange(val, "bloodGroup")
                    }
                    value={formData.bloodGroup || profile?.bloodGroup}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                        (bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <Label>Emergency Contact</Label>
                  <Input
                    name="emergencyContact"
                    value={
                      formData.emergencyContact || profile?.emergencyContact
                    }
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Actions only for personal info */}
              <div className="flex gap-2 mt-6">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      {saving && <Loader2 className="animate-spin w-4 h-4" />}
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* ACCOUNT SETTINGS */}
            <TabsContent value="account" className="space-y-5">
              {user?.role === "Admin" ? (
                <>
                  {/* Admin can edit */}
                  {!isEditing ? (
                    <div className="space-y-4">
                      <InfoRow
                        icon={Shield}
                        user={profile!}
                        label="Role"
                        value={profile?.role}
                      />
                      <InfoRow
                        icon={BadgeCheck}
                        user={profile!}
                        label="Status"
                        value={profile?.status || "inactive"}
                        badge={true}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Label>Role</Label>
                      <Select
                        onValueChange={(val) => handleSelectChange(val, "role")}
                        value={formData.role || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Delivery Agent">
                            Delivery Agent
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Label>Status</Label>
                      <Select
                        onValueChange={(val) =>
                          handleSelectChange(val, "status")
                        }
                        value={formData?.status || "Inactive"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Actions only for Admin */}
                  <div className="flex gap-2 mt-6">
                    {isEditing ? (
                      <>
                        <Button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          {saving && (
                            <Loader2 className="animate-spin w-4 h-4" />
                          )}
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Account
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                //* Non-admins just view
                <div className="space-y-4">
                  <InfoRow user={profile!} icon={Shield} label="Role" value={profile?.role} />
                  <InfoRow
                    icon={BadgeCheck}
                    user={profile!}
                    label="Status"
                    value={profile?.status || "inactive"}
                    badge={true}
                  />
                </div>
              )}
            </TabsContent>

            {/* SECURITY & SYSTEM - always view only */}
            <TabsContent value="system" className="space-y-5">
              <InfoRow
                icon={Lock}
                user={profile!}
                label="Password Last Changed"
                value={
                  profile?.passwordChangedAt
                    ? formatDate(profile?.passwordChangedAt)
                    : "Not set"
                }
              />
              <InfoRow
                icon={Database}
                user={profile!}
                label="Created At"
                value={
                  profile?.createdAt
                    ? // ? new Date(profile.createdAt).toLocaleDateString()
                      formatDate(profile?.createdAt)
                    : "N/A"
                }
              />
              <InfoRow
                icon={DatabaseBackup}
                user={profile!}
                label="Last Updated At"
                value={
                  profile?.lastUpdated
                    ? // ? new Date(profile.createdAt).toLocaleDateString()
                      formatDate(profile?.lastUpdated)
                    : "N/A"
                }
              />
              <InfoRow
                icon={Rss}
                user={profile!}
                label="Last Login"
                value={
                  profile?.lastLogin ? formatDate(profile?.lastLogin) : "Never"
                }
              />
              <InfoRow
                icon={Globe}
                user={profile!}
                label="Last Login IP"
                value={profile?.lastLoginIP}
              />
            </TabsContent>
          </Tabs>

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
