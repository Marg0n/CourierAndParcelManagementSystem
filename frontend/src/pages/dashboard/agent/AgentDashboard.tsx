import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const AgentDashboard = () => {
  return (
    <DashboardLayout role="Delivery Agent">
      <h1 className="text-2xl font-bold text-gray-800">Agent Dashboard</h1>
      <p className="text-gray-600 mt-2">
        View your assigned deliveries and export data.
      </p>
    </DashboardLayout>
  );
};

export default AgentDashboard;
