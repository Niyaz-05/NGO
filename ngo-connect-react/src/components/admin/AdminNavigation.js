import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavigation = () => {
  const location = useLocation();

  return (
    <div className="card mb-4">
      <div className="card-body p-0">
        <nav className="nav nav-pills nav-fill">
          <Link
            to="/admin-dashboard"
            className={`nav-link ${
              location.pathname === "/admin-dashboard" ||
              location.pathname === "/dashboards/admin-dashboard"
                ? "active"
                : ""
            }`}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
          <Link
            to="/admin/ngo-management"
            className={`nav-link ${
              location.pathname === "/admin/ngo-management" ? "active" : ""
            }`}
          >
            <i className="bi bi-building me-2"></i>
            NGO Management
          </Link>
          <Link
            to="/admin/donations"
            className={`nav-link ${
              location.pathname === "/admin/donations" ? "active" : ""
            }`}
          >
            <i className="bi bi-currency-rupee me-2"></i>
            Donations
          </Link>
          <Link
            to="/admin/volunteer-opportunities"
            className={`nav-link ${
              location.pathname === "/admin/volunteer-opportunities"
                ? "active"
                : ""
            }`}
          >
            <i className="bi bi-people me-2"></i>
            Volunteer Opportunities
          </Link>
          <Link
            to="/admin/user-management"
            className={`nav-link ${
              location.pathname === "/admin/user-management" ? "active" : ""
            }`}
          >
            <i className="bi bi-person-gear me-2"></i>
            User Management
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminNavigation;
