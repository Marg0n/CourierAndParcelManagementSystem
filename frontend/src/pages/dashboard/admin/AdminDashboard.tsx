import AdminHome from "@/components/dashboard/admin/AdminHome";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const AdminDashboard = () => {
  return (
    <DashboardLayout role="Admin">
      <AdminHome/>
    </DashboardLayout>
  );
};

export default AdminDashboard;
