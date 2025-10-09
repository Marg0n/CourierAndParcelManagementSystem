/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InfoRow } from "@/components/ui/InfoRow";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { server } from "@/utils/envUtility";
import { formatDate, formatDateOnly } from "@/utils/formatDate";
import type { TUser } from "@/utils/types";
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
  Mars,
  Phone,
  PhoneCall,
  Rss,
  Shield,
  User,
  Venus,
  VenusAndMars,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const UserInfo = ({ profile }: { profile: TUser }) => {
  //* States & data from store
  const { user, accessToken } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [formData, setFormData] = useState({
    role: profile?.role || "Customer",
    status: profile?.status || "inactive",
    statusChangeReason: "",
  });

  //* Handle the changes
  const handleSelectChange = (val: string, field: "role" | "status") => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  //* Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        role: formData.role,
        status: formData.status,
        statusChangeReason:
          formData.statusChangeReason.trim() ||
          "Admin changed role/status manually",
        statusChangedBy: user?.email,
      };

      const res = await fetch(`${server}/admin/users/${profile._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("User updated successfully!");
        setIsEditing(false);
        setOpenConfirm(false);

        //? Optimistically update local profile
        profile.role = formData.role;
        profile.status = formData.status;
      } else {
        toast.error(data.message || "Failed to update user ❌");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error updating user!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="personal" className="w-full">
        {/* Tab Lists */}
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="system">Security & System</TabsTrigger>
        </TabsList>

        {/* PERSONAL INFO */}
        <TabsContent value="personal" className="space-y-5">
          <div className="space-y-4">
            <InfoRow
              user={profile!}
              icon={User}
              label="Name"
              value={profile?.name}
            />
            <InfoRow
              user={profile!}
              icon={Mail}
              label="Email"
              value={profile?.email}
            />
            <InfoRow
              user={profile!}
              icon={Phone}
              label="Phone"
              value={profile?.phone}
            />
            <InfoRow
              user={profile!}
              icon={CalendarIcon}
              label="Date of Birth"
              value={
                profile?.dateOfBirth ? formatDateOnly(profile.dateOfBirth) : ""
              }
            />
            <InfoRow
              icon={
                profile?.gender === undefined
                  ? VenusAndMars
                  : profile?.gender === "female"
                  ? Venus
                  : Mars
              }
              user={profile!}
              label="Gender"
              value={profile?.gender || "Not provided"}
            />
            <InfoRow
              icon={MapPin}
              user={profile!}
              label="Address"
              value={`
                ${profile?.address || ""}, 
                ${profile?.city || ""} -  
                ${profile?.zipCode || ""},
                ${profile?.country || ""}
              `}
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
                    onValueChange={(val) => handleSelectChange(val, "status")}
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

                  <Label>Reason for Change (optional)</Label>
                  <Textarea
                    placeholder="e.g., Promoted to Admin, user reactivated, etc."
                    value={formData.statusChangeReason}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        statusChangeReason: e.target.value,
                      }))
                    }
                    className="resize-none"
                  />
                </div>
              )}

              {/* Actions only for Admin */}
              <div className="flex gap-2 mt-6 flex-wrap">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => setOpenConfirm(true)}
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
                    Edit Account
                  </Button>
                )}
              </div>

              {/* Confirmation Modal */}
              <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Update</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mb-4">
                      Are you sure you want to update <b>{profile?.name}</b>’s
                      role and/or status?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpenConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving && (
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      )}
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            //* Non-admins just view
            <div className="space-y-4">
              <InfoRow
                user={profile!}
                icon={Shield}
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
    </>
  );
};

export default UserInfo;
