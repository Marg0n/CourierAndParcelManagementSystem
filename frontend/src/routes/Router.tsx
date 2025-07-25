import { Login } from "@/pages/auth/Login";
import { Registration } from "@/pages/auth/Registration";
import LandingPage from "@/pages/Landing/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AgentDashboard from "@/pages/dashboard/agent/AgentDashboard";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import CustomerDashboard from "@/pages/dashboard/customer/CustomerDashboard";


const Router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "registration",
    element: <Registration />,
  },

  //* Dashboard routes
  {
    path: "/dashboard/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard/customer",
    element: <CustomerDashboard />,
  },
  {
    path: "/dashboard/agent",
    element: <AgentDashboard />,
  },
]);

export default Router;
