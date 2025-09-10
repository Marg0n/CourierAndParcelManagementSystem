import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const LoadingPage = () => {

  //* Get the current location/pathname
  const location = useLocation();

  //* Determine if we are on a dashboard route (admin, agent, customer)
  const isDashboardRoute = location.pathname.startsWith("/dashboard/");

  return (
    <div
      className={clsx(
        isDashboardRoute ? "h-full" : "min-h-screen",
        "bg-gradient-to-br from-sky-100 to-sky-300 flex flex-col items-center justify-center text-center px-4 animate-fadeIn",
      )}
    >
      <div className="flex items-center justify-center mb-6">
        <Loader2 className="animate-spin text-sky-700" size={48} />
      </div>
      <h2 className="text-3xl font-semibold text-sky-800 mb-2">
        Just a moment...
      </h2>
      <p className="text-gray-600 max-w-md">
        We're preparing your experience. Hang tight while we load everything for
        you!
      </p>
    </div>
  );
};

export default LoadingPage;
