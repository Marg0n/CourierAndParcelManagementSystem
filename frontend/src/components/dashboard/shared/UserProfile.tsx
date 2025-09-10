import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

const UserProfile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  //* Local state for editable fields
  //TODO: need to do further improvements
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: call API to update profile in backend
    console.log("Updated profile:", formData);
    setIsEditing(false);
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto mt-8 shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-sky-800 mb-4">My Profile</h2>

          {!isEditing ? (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {user?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {user?.phone || "Not provided"}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {user?.role}
              </p>

              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
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
                  onChange={handleChange}
                  disabled // usually email isn’t editable
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
                <Button type="button" onClick={handleSave}>
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
      <div>
          {/* tool tip */}
        {user?.role === "Admin" && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold">Admin Settings</h2>
            <p>
              Admins can edit extra fields (e.g. user roles, system settings).
            </p>
          </div>
        )}

        {user?.role === "Customer" && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold">Customer Info</h2>
            <p>Customers can manage delivery addresses, phone numbers, etc.</p>
          </div>
        )}

        {user?.role === "Delivery Agent" && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold">Agent Info</h2>
            <p>Agents can manage assigned parcels, status updates, etc.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
