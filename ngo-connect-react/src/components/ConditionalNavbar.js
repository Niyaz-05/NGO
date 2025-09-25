import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import AuthNavbar from './AuthNavbar';

const ConditionalNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!(token && user));
  }, []);

  // Listen for storage changes to update login status
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!(token && user));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Always show public navbar on home page
  if (location.pathname === '/') {
    return <Navbar />;
  }

  // Hide navbar entirely for NGO users across the app
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    const role = u?.role || u?.userType;
    if (role === 'NGO') {
      return null;
    }
  } catch {}

  // Hide navbar entirely on login selection and all login pages
  const isLoginSelection = location.pathname === '/auth/select-login';
  const isAnyLoginPage = /^\/auth\/(ngo|user|donor|volunteer|admin)-login$/.test(location.pathname);
  if (isLoginSelection || isAnyLoginPage) {
    return null;
  }

  // Hide navbar on all registration pages
  const isAnyRegisterPage = /^\/auth\/(user|ngo|donor|volunteer|admin)-register$/.test(location.pathname);
  if (isAnyRegisterPage) {
    return null;
  }
  return isLoggedIn ? <UserNavbar /> : <Navbar />;
};

export default ConditionalNavbar;

