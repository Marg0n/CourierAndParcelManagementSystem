import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  role: "Admin" | "Customer" | "Delivery Agent";
  children: ReactNode;  
}

export const DashboardLayout = ({ role, children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <main className="flex-1 p-8 max-h-screen">{children}</main>
    </div>
  );
};
