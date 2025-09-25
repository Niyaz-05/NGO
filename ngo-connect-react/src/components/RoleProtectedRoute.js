import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleProtectedRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // If user is authenticated, redirect to user-choice
    if (token) {
      navigate('/auth/user-choice');
    } else {
      navigate('/auth/select-login');
    }
  }, [token, navigate]);

  // While redirecting, don't render anything
  return null;
};

export default RoleProtectedRoute;
