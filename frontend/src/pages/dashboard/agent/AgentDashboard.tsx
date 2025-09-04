import AgentLayout from "@/components/dashboard/agent/AgentLayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const AgentDashboard = () => {
  return (
    <DashboardLayout role="Delivery Agent">
      <AgentLayout/>
    </DashboardLayout>
  );
};

export default AgentDashboard;
