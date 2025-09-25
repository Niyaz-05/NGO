import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth/select-login");
    }
  }, [token, navigate]);

  // If no token, don't render anything (will redirect)
  if (!token) {
    return null;
  }

  // If token exists, render the children
  return children;
};

export default ProtectedRoute;
