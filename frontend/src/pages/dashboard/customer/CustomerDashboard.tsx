import Customerlayout from "@/components/dashboard/customer/Customerlayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const CustomerDashboard = () => {
  return (
    <DashboardLayout role="Customer">
      <Customerlayout/>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
