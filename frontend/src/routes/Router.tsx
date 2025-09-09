import { Login } from "@/pages/auth/Login";
import { Registration } from "@/pages/auth/Registration";
import LandingPage from "@/pages/Landing/LandingPage";
import { createBrowserRouter } from "react-router-dom";

import AgentDashboard from "@/pages/dashboard/agent/AgentDashboard";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import CustomerDashboard from "@/pages/dashboard/customer/CustomerDashboard";

import ErrorPage from "@/pages/shared/errors/ErrorPage";
import Protected from "./Protected";

//* Admin components
import AllUsers from "@/components/dashboard/admin/AllUsers";
import AdminHome from "@/components/dashboard/admin/AdminHome";
import AllParcels from "@/components/dashboard/admin/AllParcels";
import Analytics from "@/components/dashboard/admin/Analytics";

//* Customer components
import CustomerHome from "@/components/dashboard/customer/CustomerHome";
import BookParcel from "@/components/dashboard/customer/BookParcel";
import MyBookings from "@/components/dashboard/customer/MyBookings";

//* Agent components
import AgentHome from "@/components/dashboard/agent/AgentHome";
import AssignedParcels from "@/components/dashboard/agent/AssignedParcels";
import ExportData from "@/components/dashboard/agent/ExportData";

//* Shared components
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

  //* ================================
  //* Admin Dashboard Routes
  //* ================================
  {
    path: "/dashboard/admin",
    element: (
      <Protected>
        <AdminDashboard />
      </Protected>
    ),
    children: [
      { 
        index: true, 
        element: <AdminHome /> 
      },
      { 
        path: "users", 
        element: <AllUsers /> 
      },
      { 
        path: "user", 
        element: <UserProfile /> 
      },
      { 
        path: "parcels", 
        element: <AllParcels /> 
      },
      { 
        path: "metrics", 
        element: <Analytics /> 
      },
      {
        path: "tracking/:id",
        element: <ParcelTracking />,
      },
    ],
  },

  //* ================================
  //* Customer Dashboard Routes
  //* ================================
  {
    path: "/dashboard/customer",
    element: (
      <Protected>
        <CustomerDashboard />
      </Protected>
    ),
    children: [
      { 
        index: true, 
        element: <CustomerHome /> 
      },
      { 
        path: "user", 
        element: <UserProfile /> 
      },
      { 
        path: "book", 
        element: <BookParcel /> 
      },
      { 
        path: "history", 
        element: <MyBookings /> 
      },
      {
        path: "tracking/:id",
        element: <ParcelTracking />,
      },
    ],
  },

  //* ================================
  //* Agent Dashboard Routes
  //* ================================
  {
    path: "/dashboard/agent",
    element: (
      <Protected>
        <AgentDashboard />
      </Protected>
    ),
    children: [
      { 
        index: true, 
        element: <AgentHome /> 
      },
      { 
        path: "user", 
        element: <UserProfile /> 
      },
      { 
        path: "assigned", 
        element: <AssignedParcels /> 
      },
      { 
        path: "export", 
        element: <ExportData /> 
      },
      {
        path: "tracking/:id",
        element: <ParcelTracking />,
      },
    ],
  },

  //* ================================
  //* Fallback Route
  //* ================================
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default Router;
