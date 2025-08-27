import { logout } from "@/utils/logout";
import { Link, useNavigate } from "react-router-dom"

interface SidebarProps {
  role: "Admin" | "Customer" | "Delivery Agent"
}

export const Sidebar = ({ role }: SidebarProps) => {

  //* Navigation
  const navigate = useNavigate();

  //* Map role to lowercase string for URL
  const roleToPath = {
    Admin: "admin",
    Customer: "customer",
    "Delivery Agent": "agent",
  } as const;

  const rolePath = roleToPath[role];

  const commonLinks = [
    { to: "/", label: "Home" },
    { to: `/dashboard/${rolePath}`, label: "Dashboard" },
    // { to: "/login", label: "Logout" },
  ]

  const roleLinks = {
    Admin: [
      { to: `/dashboard/${rolePath}/users`, label: "Users" },
      { to: `/dashboard/${rolePath}/parcels`, label: "Parcels" },
      { to: `/dashboard/${rolePath}/metrics`, label: "Analytics" },
    ],
    Customer: [
      { to: `/dashboard/${rolePath}/book`, label: "Book Parcel" },
      { to: `/dashboard/${rolePath}/history`, label: "My Bookings" },
    ],
    "Delivery Agent": [
      { to: `/dashboard/${rolePath}/assigned`, label: "Assigned Parcels" },
      { to: `/dashboard/${rolePath}/export`, label: "Export Data" },
    ],
  }

  return (
    <aside className="w-64 bg-white shadow-md h-screen p-6">
      <nav className="flex flex-col gap-4">
        {[...commonLinks, ...roleLinks[role]].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-gray-700 hover:text-sky-600 font-medium"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => logout(navigate)}
        className="mt-8 text-red-600 hover:text-red-800 font-medium text-left"
      >
        Logout
      </button>
    </aside>
  )
}
