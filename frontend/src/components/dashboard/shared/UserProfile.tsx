import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import type { TUser } from "@/utils/types";
import { server } from "@/utils/envUtility";
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { Loader2, User, Mail, Phone, MapPin, Globe, CalendarIcon, Shield, BadgeCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const UserProfile = () => {

  //* State data from store
  const { user, accessToken } = useAuthStore();

  //* States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  //* Get user data from server
  useEffect(()=>{
    const fetchProfile = async () => {
      try{
        setLoading(true);

        const res = await fetch(
          `${server}/get-user`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        const data = await res.json();
        console.log("Fetch response:", data);

        //? Normalize result
        setProfile(data || user);
      }
      catch(err){
        console.error("Error fetching user: ", err);
      }
      finally{
        setLoading(false);
      }
    }

    if (user?.email) fetchProfile();
  }, [user, accessToken])

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
    image: profile?.image || "",
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

  //* Save changes
  const handleSave = async () => {
    try{
      setSaving(false);

      const res = await fetch(
        `${server}/update-user/${user?.email}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log("Update response:", data);

      //? Update user data
      setProfile(
        (prev => (
          prev ? { ...prev, ...(formData as Partial<TUser>) } : null
        ))
      );
    }
    catch(err){
      console.error("Error saving profile:", err);
    }
    finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  //* Loading state
  if (loading) {
    return (
      <LoadingPage/>
    );
  }

  return (
    <>
      <Card className="max-w-3xl mx-auto mt-8 shadow-xl rounded-2xl border border-sky-100">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-8 h-8 text-sky-600" />
            <h2 className="text-3xl font-bold text-sky-800">My Profile</h2>
          </div>

          {!isEditing ? (
            <div className="space-y-4 text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-500" />
                <span className="font-semibold">Email:</span> {profile?.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">Phone:</span> {profile?.phone || "Not provided"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span className="font-semibold">Address:</span>{" "}
                {profile?.address || "Not provided"}
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" />
                <span className="font-semibold">Country:</span>{" "}
                {profile?.country || "Not provided"}
              </p>
              <p className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">Role:</span>
                <Badge variant="outline" className="ml-2">
                  {profile?.role}
                </Badge>
              </p>
              <p className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Status:</span>
                <Badge className={profile?.status === "active" ? "bg-green-500" : "bg-red-500"}>
                  {profile?.status || "inactive"}
                </Badge>
              </p>

              <Button onClick={() => setIsEditing(true)} className="mt-4">
                Edit Profile
              </Button>
            </div>
          ) : (
            <form className="space-y-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={formData.email || ""} disabled />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, role: val as TUser["role"] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Delivery Agent">Delivery Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val as "active" | "inactive" }))}
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

              <div>
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, gender: val as "male" | "female" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date of Birth</Label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-sky-600" />
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Address fields */}
              <div>
                <Label>Address</Label>
                <Input name="address" value={formData.address || ""} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input name="city" value={formData.city || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>State</Label>
                  <Input name="state" value={formData.state || ""} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country</Label>
                  <Input name="country" value={formData.country || ""} onChange={handleChange} />
                </div>
                <div>
                  <Label>Zip Code</Label>
                  <Input name="zipCode" value={formData.zipCode || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                  {saving && <Loader2 className="animate-spin w-4 h-4" />}
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
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
    </>
  );
};

export default UserProfile;
