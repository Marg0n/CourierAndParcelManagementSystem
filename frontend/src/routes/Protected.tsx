/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingPage from "@/pages/shared/loading/LoadingPage";
import { useAuthStore } from "@/store/useAuthStore";
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

  //* Zustand state + actions from Zustand instead of localStorage
  const { accessToken, refreshToken, login, logout } = useAuthStore();

  //* Refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {

    //* Fetch access token
    // const refreshToken = localStorage.getItem("refreshToken");

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

      // Save new token in Zustand
      if (response.ok) {
        login({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
        return true;
      };

      return false;
    } catch (err: any) {
      console.error("Refresh error:",err);
      return false;
    }
  };

  //* Token validation
  useEffect(() => {
    //* Check token func
    const checkToken = async () => {

      //* Fetch token
      // let accessToken = localStorage.getItem("accessToken");

      //* check if token is present
      if (!accessToken) {
        const refreshed = await refreshAccessToken();

        if (!refreshed) {
          toast.error("Logged out!");
          logout();
          navigate("/login");
          return;
        }

        //* Retry getting the access token after refresh
        // accessToken = localStorage.getItem("accessToken");
      }

      // TODO: Optionally validate token expiration here or to refresh token with refreshToken if expired
      
      //* decode the new access token and check expiration
      try {

        //* Check token
        const tokenToCheck = accessToken;
        if (!tokenToCheck) throw new Error("Missing token");

        const { exp } = jwtDecode<JwtPayload>(accessToken as string);
        //* expiration in second
        const isExpired = exp * 1000 < Date.now();

        if (isExpired) {
          const refreshed = await refreshAccessToken();

          if (!refreshed) {
            toast.error("Session expired. Please log in again.");
            logout();
            navigate("/login");
            return;
          }
        }

        setIsAuthenticated(true);
      } 
      catch (err: any) {
        console.error("Token check error:", err);
        toast.error("Invalid session. Please login again.", {
          description: err?.message || String(err),
        });
        logout();
        navigate("/login");
      } 
      finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [accessToken, refreshToken]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return null; //! If Redirect happened, Won't render children if not authenticated
  }

  return <>{children}</>;
};

export default Protected;
