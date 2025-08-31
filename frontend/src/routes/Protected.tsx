/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { logout } from "@/utils/logout";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//* Define the props (children) for Protected component
interface ProtectedProps {
  children: ReactNode;
}

//* Define shape of JWT payload
interface JwtPayload {
  exp: number; //? expiration in seconds
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {

  //* Navigation
  const navigate = useNavigate();

  //* States
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  //* Refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {

    //* Fetch access token
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return false;

    try {
      const response = await fetch(`http://localhost:5000/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      if (response.ok) localStorage.setItem("accessToken", data.accessToken);

      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  };

  //* Token validation
  useEffect(() => {
    //* Check token func
    const checkToken = async () => {

      //* Fetch token
      let accessToken = localStorage.getItem("accessToken");

      //* check if token is present
      if (!accessToken) {
        const refreshed = await refreshAccessToken();

        if (!refreshed) {
          toast.error("Session expired. Please log in again.");
          logout(navigate);
          return;
        }

        //* Retry getting the access token after refresh
        accessToken = localStorage.getItem("accessToken");
      }

      // TODO: Optionally validate token expiration here or to refresh token with refreshToken if expired
      
      //* decode the new access token and check expiration
      try {
        const { exp } = jwtDecode<JwtPayload>(accessToken as string);
        //* expiration in second
        const isExpired = exp * 1000 < Date.now();

        if (isExpired) {
          const refreshed = await refreshAccessToken();

          if (!refreshed) {
            toast.error("Session expired. Please log in again.");
            logout(navigate);
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (err: any) {
        console.error(err);
        toast.error("Invalid session. Please login again.", {
          description: err?.message || err,
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null; //! If Redirect happened, Won't render children if not authenticated
  }

  return <>{children}</>;
};

export default Protected;
