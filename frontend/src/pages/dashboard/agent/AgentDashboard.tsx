import AgentHome from "@/components/dashboard/agent/AgentHome";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";


const AgentDashboard = () => {
  return (
    <DashboardLayout role="Delivery Agent">
      <AgentHome/>
    </DashboardLayout>
  );
};

export default AgentDashboard;
