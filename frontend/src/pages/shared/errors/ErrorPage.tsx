import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  
  //* Navigation
  const navigate = useNavigate();

  //* Get the current location/pathname
  const location = useLocation();

  //* Determine if we are on a dashboard route (admin, agent, customer)
  const isDashboardRoute = location.pathname.startsWith("/dashboard/");

  return (
    <div 
      className={clsx(
        isDashboardRoute ? "h-full" : "min-h-screen",
        "bg-gradient-to-b from-gray-100 to-sky-200 flex flex-col justify-center items-center text-center px-4"
      )}
    >
      <h1 className="text-5xl font-bold text-sky-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div 
        className={clsx(
          isDashboardRoute ? "hidden" : "flex gap-4"
        )}
      >
        <Button size="lg" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button size="lg" onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
