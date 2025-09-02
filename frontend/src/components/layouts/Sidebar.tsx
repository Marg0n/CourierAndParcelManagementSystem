
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  PackageSearch,
  BarChart,
  LogOut,
  Home,
  PlusCircle,
  History,
  Truck,
  Download,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
  role: "Admin" | "Customer" | "Delivery Agent"
}

export const Sidebar = ({ role }: SidebarProps) => {

  //* Navigation
  // const navigate = useNavigate();

  //* Zustand
  const logout = useAuthStore((store) => store.logout);

  //* Map role to lowercase string for URL
  const roleToPath = {
    Admin: "admin",
    Customer: "customer",
    "Delivery Agent": "agent",
  } as const;

  //* Link types
  interface LinkItem {
    to: string;
    label: string;
    icon: React.ReactNode;
    exact?: boolean;
  }
  

  const rolePath = roleToPath[role];

  const commonLinks: LinkItem[] = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { 
      to: `/dashboard/${rolePath}`, 
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      exact: true, //? we'll use this for 'end' 
    },
    // { to: "/login", label: "Logout" },
  ]

  const roleLinks: Record<typeof role, LinkItem[]> = {
    Admin: [
      { to: `/dashboard/${rolePath}/users`, label: "Users", icon: <Users size={18} /> },
      { to: `/dashboard/${rolePath}/parcels`, label: "Parcels", icon: <PackageSearch size={18}/> },
      { to: `/dashboard/${rolePath}/metrics`, label: "Analytics", icon: <BarChart size={18} /> },
    ],
    Customer: [
      { to: `/dashboard/${rolePath}/book`, label: "Book Parcel", icon: <PlusCircle size={18} /> },
      { to: `/dashboard/${rolePath}/history`, label: "My Bookings", icon: <History size={18} /> },
    ],
    "Delivery Agent": [
      { to: `/dashboard/${rolePath}/assigned`, label: "Assigned Parcels", icon: <Truck size={18} />  },
      { to: `/dashboard/${rolePath}/export`, label: "Export Data", icon: <Download size={18} /> },
    ],
  }

  return (
    <aside className="w-64 bg-white shadow-md h-screen p-6 flex flex-col justify-between">
      <nav className="flex flex-col gap-2">
        {[...commonLinks, ...roleLinks[role]].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact || false} // only for Dashboard link
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sky-100 text-sky-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-sky-600"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => logout()}
        className="flex items-center gap-2 mt-8 text-red-600 hover:text-red-800 font-medium"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}
