import CustomerHome from "@/components/dashboard/customer/CustomerHome";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const CustomerDashboard = () => {
  return (
    <DashboardLayout role="Customer">
      <CustomerHome/>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
