import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleProtectedRoute = ({ roles, children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      // If no token, redirect to login
      if (!token) {
        navigate("/auth/select-login");
        return;
      }

      // If no user data, redirect to login
      if (!userData) {
        navigate("/auth/select-login");
        return;
      }

      try {
        const user = JSON.parse(userData);
        const userRole = user.role?.toUpperCase();

        // Check if user has required role
        if (roles && roles.length > 0) {
          const hasRequiredRole = roles.some(
            (role) => role.toUpperCase() === userRole
          );

          if (!hasRequiredRole) {
            // Redirect to appropriate dashboard based on user's actual role
            switch (userRole) {
              case "ADMIN":
                navigate("/dashboards/admin-dashboard");
                break;
              case "NGO":
                navigate("/ngo-dashboard");
                break;
              case "DONOR":
                navigate("/donor-dashboard");
                break;
              case "VOLUNTEER":
                navigate("/volunteer-dashboard");
                break;
              case "USER":
                navigate("/auth/user-choice");
                break;
              default:
                navigate("/auth/select-login");
                break;
            }
            return;
          }
        }

        // User is authorized
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/auth/select-login");
      }
    };

    checkAuth();
  }, [roles, navigate]);

  // Show loading while checking authorization
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render children if authorized
  if (isAuthorized) {
    return children;
  }

  // This shouldn't render if redirecting
  return null;
};

export default RoleProtectedRoute;
