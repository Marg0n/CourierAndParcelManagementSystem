import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const CustomerDashboard = () => {
  return (
    <DashboardLayout role="Customer">
      <h1 className="text-2xl font-bold text-gray-800">Customer Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Book parcels and track delivery status.
      </p>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
