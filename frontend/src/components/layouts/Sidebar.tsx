
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  User,
  Users,
  PackageSearch,
  BarChart,
  LogOut,
  Home,
  PlusCircle,
  History,
  Truck,
  Download,
  // Map,
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
    { to: "/", label: "Home", icon: <Home size={20} /> },
    { 
      to: `/dashboard/${rolePath}`, 
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      exact: true, //? we'll use this for 'end' 
    },
    { 
      to: `/dashboard/${rolePath}/user`, 
      label: "User Profile", 
      icon: <User size={20} />, 
    },
    // { 
    //   to: `/dashboard/${rolePath}/tracking`, 
    //   label: "Parcel Tracking", 
    //   icon: <Map size={20} />, 
    // },
    // { to: "/login", label: "Logout" },
  ]

  const roleLinks: Record<typeof role, LinkItem[]> = {
    Admin: [
      { to: `/dashboard/${rolePath}/users`, label: "All Users", icon: <Users size={20} /> },
      { to: `/dashboard/${rolePath}/parcels`, label: "All Parcels", icon: <PackageSearch size={20}/> },
      { to: `/dashboard/${rolePath}/metrics`, label: "Analytics", icon: <BarChart size={20} /> },
    ],
    Customer: [
      { to: `/dashboard/${rolePath}/book`, label: "Book Parcel", icon: <PlusCircle size={20} /> },
      { to: `/dashboard/${rolePath}/history`, label: "My Bookings", icon: <History size={20} /> },
    ],
    "Delivery Agent": [
      { to: `/dashboard/${rolePath}/assigned`, label: "Assigned Parcels", icon: <Truck size={20} />  },
      { to: `/dashboard/${rolePath}/export`, label: "Export Data", icon: <Download size={20} /> },
    ],
  }

  return (
    <aside className="
        w-16 lg:w-64 
        bg-white shadow-md min-h-screen 
        p-4 lg:p-6 flex flex-col justify-between
        transition-all duration-300
    ">
      <nav className="flex flex-col gap-2">
        {[...commonLinks, ...roleLinks[role]].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact || false} //? only for Dashboard link
            className={({ isActive }) =>
              `flex items-center px-1 lg:px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-sky-100 text-sky-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-sky-600"
              }`
            }
          >
            {/* Icon always visible */}
            {link.icon}
            {/* Label only on lg+ screens */}
            <span className="hidden lg:inline ml-2">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => logout()}
        className="flex items-center gap-2 mt-8 text-red-600 hover:text-red-800 font-medium cursor-pointer"
      >
        <LogOut size={20} />        
        <span className="hidden lg:inline ml-2">Logout</span>
      </button>
    </aside>
  )
}
