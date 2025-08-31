
import AdminLayout from "@/components/dashboard/admin/AdminLayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const AdminDashboard = () => {
  return (
    <DashboardLayout role="Admin">
      <AdminLayout/>
    </DashboardLayout>
  );
};

export default AdminDashboard;
