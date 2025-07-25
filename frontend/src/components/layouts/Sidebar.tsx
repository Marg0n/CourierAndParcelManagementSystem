import { Link } from "react-router-dom"

interface SidebarProps {
  role: "Admin" | "Customer" | "Delivery Agent"
}

export const Sidebar = ({ role }: SidebarProps) => {
  const commonLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
  ]

  const roleLinks = {
    Admin: [
      { to: "/dashboard/admin/users", label: "Users" },
      { to: "/dashboard/admin/parcels", label: "Parcels" },
      { to: "/dashboard/admin/metrics", label: "Analytics" },
    ],
    Customer: [
      { to: "/dashboard/customer/book", label: "Book Parcel" },
      { to: "/dashboard/customer/history", label: "My Bookings" },
    ],
    "Delivery Agent": [
      { to: "/dashboard/agent/assigned", label: "Assigned Parcels" },
      { to: "/dashboard/agent/export", label: "Export Data" },
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
    </aside>
  )
}
