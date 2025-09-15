import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import type { TUser } from "@/utils/types";
import { server } from "@/utils/envUtility";
import LoadingPage from "@/pages/shared/loading/LoadingPage";

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
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
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
          prev ? { ...prev, ...formData } : null
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
      <Card className="max-w-2xl mx-auto mt-8 shadow-lg rounded-2xl border border-sky-100">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-sky-800 mb-2">My Profile</h2>

          {!isEditing ? (
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {profile?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {profile?.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {profile?.phone || "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {profile?.role}
              </p>

              <Button onClick={() => setIsEditing(true)} className="mt-3">
                Edit Profile
              </Button>
            </div>
          ) : (
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled // ✅ usually not editable
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2">
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
