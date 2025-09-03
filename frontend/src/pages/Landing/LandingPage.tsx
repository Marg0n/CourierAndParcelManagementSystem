import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "../shared/errors/ErrorBoundary";
import { useAuthStore } from "@/store/useAuthStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

const LandingPage = () => {

  //* Navigation
  const navigate = useNavigate();
  const location = useLocation();
  const whereTo = location?.state || "/";

  //* Zustand
  const { user, accessToken, logout } = useAuthStore(); 

  //* Map role to lowercase string for URL
  const roleToPath = {
    Admin: "admin",
    Customer: "customer",
    "Delivery Agent": "agent",
  } as const;

  const rolePath = user?.role && roleToPath[user.role as keyof typeof roleToPath]; //? It tells TypeScript:  “Hey, trust me, user.role will be one of the keys in roleToPath.”

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-white via-sky-100 to-sky-200 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-800">CourierTrack</h1>
          {accessToken ? (
            //* Dropdown if logged in
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {user?.name ? `Hello, ${user?.name}` : "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="">
                  {/* Logged as {" "} */}
                  <Badge
                    variant="secondary"
                    className="bg-blue-600 text-white"
                  >
                    <BadgeCheckIcon />
                    {user?.role}
                  </Badge> 
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => navigate(`/dashboard/${rolePath}`)}
                  className="cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout(); //? clear auth store + localStorage
                    navigate(whereTo);
                  }}
                  className="text-red-500 hover:text-red-500! cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            //* Show login button if not logged in
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Reliable Courier Tracking & Parcel Management
          </h2>
          <p className="text-gray-600 max-w-xl mb-6">
            Book pickups, assign delivery agents, track in real-time, and manage
            your logistics from one powerful dashboard.
          </p>
          <Button size="lg" onClick={() => navigate(accessToken ? `/dashboard/${rolePath}` : "/login")}>
            Get Started → {accessToken ? `${user?.role} Dashboard` : "Login"}
          </Button>
        </main>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} CourierTrack. All rights reserved.
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default LandingPage;
