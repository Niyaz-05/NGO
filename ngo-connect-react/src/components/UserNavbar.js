import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top py-3" style={{ fontSize: '1.1rem' }}>
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <span className="navbar-brand me-0 fw-bold" style={{ fontSize: '1.5rem' }}>
            USER DASHBOARD
          </span>
        </div>

        <div className="d-flex align-items-center">
          {user ? (
            <div className="d-flex gap-3">
              <Link to="/donate" className="btn btn-outline-light px-4 py-2" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-heart-fill me-2"></i>Donate
              </Link>
              <Link to="/volunteer" className="btn btn-outline-light px-4 py-2" style={{ fontSize: '1.1rem' }}>
                <i className="bi bi-people-fill me-2"></i>Volunteer
              </Link>
              <button
                className="btn btn-light text-success px-4 py-2"
                style={{ fontSize: '1.1rem' }}
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshToken');
                  localStorage.removeItem('user');
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth/select-login" className="btn btn-outline-light px-4 py-2">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;

