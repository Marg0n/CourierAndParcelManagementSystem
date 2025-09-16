/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import type { TUser } from "@/utils/types";
import { server } from "@/utils/envUtility";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  CalendarIcon,
  Shield,
  BadgeCheck,
  Lock,
  Database,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserProfile = () => {
  //* State data from store
  const { user, accessToken } = useAuthStore();

  //* States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  //* Get user data from server
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await fetch(
            `${server}/get-user`, 
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

        const data = await res.json();
        console.log("Fetch response:", data);

        //? Normalize result
        setProfile(data || user);
      } 
      catch (err) {
        console.error("Error fetching user: ", err);
      } 
      finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchProfile();
  }, [user, accessToken]);

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
    avatarUrl: profile?.avatarUrl || "",
    avatarBg: profile?.avatarBg || "",
    bloodGroup: profile?.bloodGroup || "",
    emergencyContact: profile?.emergencyContact || "",
    gender: profile?.gender || undefined,
    dateOfBirth: profile?.dateOfBirth || undefined,
    lastLogin: user?.lastLogin || undefined,
    lastLoginIP: user?.lastLoginIP || "",
  });

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

      const res = await fetch(
        `${server}/update-user/${user?.email}`, 
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log("Update response:", data);

      //? Update user data
      setProfile((prev) =>
        prev ? { ...prev, ...(formData as Partial<TUser>) } : null
      );
    } 
    catch (err) {
      console.error("Error saving profile:", err);
    } 
    finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  //* Loading state
  if (loading) {
    return <LoadingPage />;
  }

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    badge,
  }: {
    icon: any;
    label: string;
    value?: string;
    badge?: boolean;
  }) => (
    <div className="flex items-center gap-3 text-gray-700">
      <Icon className="w-5 h-5 text-sky-600" />
      <span className="font-semibold">{label}:</span>
      {badge ? (
        <Badge
          // variant={value === "active" ? "default" : "secondary"}
          className={`ml-2 ${
            profile?.status === "active" ? "bg-green-700" : "bg-red-700"
          }`}
        >
          {value || "Not provided"}
        </Badge>
      ) : (
        <span>{value || "Not provided"}</span>
      )}
    </div>
  );

  return (
    <div className="max-h-full overflow-y-auto">
      <Card className="max-w-4xl mx-auto mt-8 shadow-xl rounded-2xl border border-sky-100">
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-sky-600" />
            <CardTitle className="text-3xl font-bold text-sky-800">
              My Profile
            </CardTitle>
          </div>
        </CardHeader>
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
                  <InfoRow icon={User} label="Name" value={profile?.name} />
                  <InfoRow icon={Mail} label="Email" value={profile?.email} />
                  <InfoRow icon={Phone} label="Phone" value={profile?.phone} />
                  <InfoRow
                    icon={CalendarIcon}
                    label="Date of Birth"
                    value={
                      profile?.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString()
                        : ""
                    }
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Address"
                    value={`${profile?.address || ""}, ${
                      profile?.city || ""
                    }, ${profile?.country || ""}`}
                  />
                  <InfoRow
                    icon={Shield}
                    label="Blood Group"
                    value={profile?.bloodGroup}
                  />
                  <InfoRow
                    icon={BadgeCheck}
                    label="Emergency Contact"
                    value={profile?.emergencyContact}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                  <Label>Date of Birth</Label>
                  <Input
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
                  />
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="city"
                      placeholder="City"
                      value={formData.city || ""}
                      onChange={handleChange}
                    />
                    <Input
                      name="country"
                      placeholder="Country"
                      value={formData.country || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <Label>Blood Group</Label>
                  <Select
                    onValueChange={(val) =>
                      handleSelectChange(val, "bloodGroup")
                    }
                    value={formData.bloodGroup || ""}
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
                    value={formData.emergencyContact || ""}
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
                        label="Role"
                        value={profile?.role}
                      />
                      <InfoRow
                        icon={BadgeCheck}
                        label="Status"
                        value={profile?.status || "inactive"}
                        badge
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
                        value={formData.status || ""}
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
                  <InfoRow icon={Shield} label="Role" value={profile?.role} />
                  <InfoRow
                    icon={BadgeCheck}
                    label="Status"
                    value={profile?.status || "inactive"}
                    badge
                  />
                </div>
              )}
            </TabsContent>

            {/* SECURITY & SYSTEM - always view only */}
            <TabsContent value="system" className="space-y-5">
              <InfoRow
                icon={Lock}
                label="Password Last Changed"
                value={
                  profile?.passwordChangedAt
                    ? new Date(profile.passwordChangedAt).toLocaleDateString()
                    : "Not set"
                }
              />
              <InfoRow
                icon={Database}
                label="Created At"
                value={
                  profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"
                }
              />
              <InfoRow
                icon={BadgeCheck}
                label="Last Login"
                value={
                  profile?.lastLogin
                    ? new Date(profile.lastLogin).toLocaleString()
                    : "Never"
                }
              />
              <InfoRow
                icon={Globe}
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
