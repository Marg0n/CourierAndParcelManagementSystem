

//* User type definition
export interface TUser {
    data: {
      _id: string;
      name: string;
      email: string;
      role: "Admin" | "Customer" | "Delivery Agent";
      status?: "active" | "inactive";
      needsPasswordChange?: boolean;
      passwordChangedAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
      image?: string;
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
      lastLoginIP?: string;
    };
  }