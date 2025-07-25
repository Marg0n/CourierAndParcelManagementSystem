import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const AdminDashboard = () => {
  return (
    <DashboardLayout role="Admin">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Manage users, parcels, and system analytics.
      </p>
    </DashboardLayout>
  );
};

export default AdminDashboard;
