import { Login } from "@/pages/auth/Login";
import { Registration } from "@/pages/auth/Registration";
import LandingPage from "@/pages/Landing/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import AgentDashboard from "@/pages/dashboard/agent/AgentDashboard";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import CustomerDashboard from "@/pages/dashboard/customer/CustomerDashboard";
import ErrorPage from "@/pages/shared/errors/ErrorPage";
import Protected from "./Protected";
import AllUsers from "@/components/dashboard/admin/AllUsers";
import AdminHome from "@/components/dashboard/admin/AdminHome";
import AllParcels from "@/components/dashboard/admin/AllParcels";
import Analytics from "@/components/dashboard/admin/Analytics";
import CustomerHome from "@/components/dashboard/customer/CustomerHome";
import BookParcel from "@/components/dashboard/customer/BookParcel";
import MyBookings from "@/components/dashboard/customer/MyBookings";
import AgentHome from "@/components/dashboard/agent/AgentHome";
import AssignedParcels from "@/components/dashboard/agent/AssignedParcels";
import ExportData from "@/components/dashboard/agent/ExportData";
import UserProfile from "@/components/dashboard/shared/UserProfile";
import { ParcelTracking } from "@/components/dashboard/shared/ParcelTracking";


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
    element: <Protected><AdminDashboard /></Protected>,
    children:[
      {
        index: true,
        element:<AdminHome/>,
      },
      {
        path: "users",
        element:<AllUsers />,
      },
      {
        path: "user",
        element:<UserProfile />,
      },
      {
        path: "parcels",
        element:<AllParcels />,
      },
      {
        path: "metrics",
        element:<Analytics />,
      },
      {
        path: "tracking",
        element:<ParcelTracking />,
      },
    ]
  },
  {
    path: "/dashboard/customer",
    element: <Protected><CustomerDashboard /></Protected>,
    children:[
      {
        index: true,
        element:<CustomerHome/>,
      },
      {
        path: "user",
        element:<UserProfile />,
      },
      {
        path: "book",
        element:<BookParcel/>,
      },
      {
        path: "history",
        element:<MyBookings/>,
      },
      {
        path: "tracking",
        element:<ParcelTracking />,
      },
    ]
  },
  {
    path: "/dashboard/agent",
    element: <Protected><AgentDashboard /></Protected>,
    children: [
      {
        index: true,
        element:<AgentHome/>,
      },
      {
        path: "user",
        element:<UserProfile />,
      },
      {
        path: "assigned",
        element:<AssignedParcels/>,
      },
      {
        path: "export",
        element:<ExportData/>,
      },
      {
        path: "tracking",
        element:<ParcelTracking />,
      },
    ]
  },

  //* Fallback route for undefined paths
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default Router;
