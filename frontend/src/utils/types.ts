//* User type definition
export interface TUser {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Customer" | "Delivery Agent";
  status: "active" | "inactive";
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  avatarUrl?: Buffer | string;
  avatarBg?: Buffer | string;
  address?: string;
  phone?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  gender?: "male" | "female";
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isDeleted?: boolean;
  lastLogin?: Date;
  lastUpdated?: Date;
  lastLoginIP?: string;
  statusChangeReason?: string;
  statusUpdatedByAdmin?: Date,
  statusChangedBy?: string;
}

//* Interface for booking/parcel
export interface Parcel {
  _id: string;
  customerEmail: string;
  agentEmail?: string;
  status: string;
  createdAt: string;
}

//* Props for Table component
export interface TableProps {
  data: TUser[];
  onView?: (view: TUser) => void;
  onEdit?: (user: TUser) => void;
  onDelete?: () => void;
}

//* Define a proper interface for the profile prop for better type safety
export interface ProfileBannerProps {
  profile: TUser;
  onBannerChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}