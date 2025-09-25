import React from 'react';
import { Link } from 'react-router-dom';

const SelectLogin = () => {
  return (
    <div 
      style={{ 
        background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
        minHeight: "100vh"
      }}
    >
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="bg-white bg-opacity-75 p-5 rounded shadow text-center" style={{minWidth: "300px", maxWidth: "400px"}}>
          <h2 className="mb-4">Select Your Login</h2>
          <div className="d-grid gap-3">
            <Link to="/auth/ngo-login" className="btn btn-outline-success">NGO Login</Link>
            <Link to="/auth/user-login" className="btn btn-outline-success">User Login</Link>
            <Link to="/auth/admin-login" className="btn btn-outline-dark">Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectLogin;
