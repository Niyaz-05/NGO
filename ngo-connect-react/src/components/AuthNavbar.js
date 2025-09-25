import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/icons/Logo.png';

const AuthNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand me-auto" to="/">
          <img src={logo} alt="NGO Connect Logo" height="50" />
        </Link>
        <div className="d-flex">
          <Link to="/" className="btn btn-outline-light">Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;

