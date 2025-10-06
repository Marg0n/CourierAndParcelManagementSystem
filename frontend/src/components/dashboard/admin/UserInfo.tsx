import { InfoRow } from "@/components/ui/InfoRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatDateOnly } from "@/utils/formatDate";
import type { TUser } from "@/utils/types";
import {
  BadgeCheck,
  CalendarIcon,
  Database,
  DatabaseBackup,
  Droplets,
  Globe,
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

const UserInfo = ({ profile }: { profile: TUser }) => {
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
              icon={profile?.gender === undefined ? VenusAndMars : (profile?.gender === "female" ? Venus : Mars )}
              user={profile!}
              label="Gender"
              value={profile?.gender || "Not provided"}
            />
            <InfoRow
              icon={MapPin}
              user={profile!}
              label="Address"
              value={`${profile?.address || ""}, ${profile?.city || ""}, ${
                profile?.country || ""
              }`}
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
          {profile?.role === "Admin" ? (
            <>
              {/* Admin can edit */}

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
