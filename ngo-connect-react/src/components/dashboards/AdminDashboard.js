import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavigation from "../admin/AdminNavigation";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching admin dashboard:", error);
      setError(
        "Failed to load admin dashboard. Please check your permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVerification = async (verificationId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      const reviewerNotes = prompt("Enter reviewer notes (optional):") || "";

      await axios.post(
        `http://localhost:8080/api/admin/ngo-verification/${verificationId}/approve`,
        {
          adminId: user.id,
          reviewerNotes: reviewerNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh dashboard data
      fetchDashboardData();
      alert("NGO verification approved successfully!");
    } catch (error) {
      console.error("Error approving verification:", error);
      alert("Failed to approve verification. Please try again.");
    }
  };

  const handleRejectVerification = async (verificationId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      const reviewerNotes = prompt("Enter rejection reason:");

      if (!reviewerNotes) {
        alert("Rejection reason is required.");
        return;
      }

      await axios.post(
        `http://localhost:8080/api/admin/ngo-verification/${verificationId}/reject`,
        {
          adminId: user.id,
          reviewerNotes: reviewerNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh dashboard data
      fetchDashboardData();
      alert("NGO verification rejected successfully!");
    } catch (error) {
      console.error("Error rejecting verification:", error);
      alert("Failed to reject verification. Please try again.");
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8080/api/admin/alerts/${alertId}/resolve`,
        {
          adminId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh dashboard data
      fetchDashboardData();
      alert("Alert resolved successfully!");
    } catch (error) {
      console.error("Error resolving alert:", error);
      alert("Failed to resolve alert. Please try again.");
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger text-center">
          <i className="bi bi-exclamation-triangle"></i>
          <h4 className="mt-2">Access Denied</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={fetchDashboardData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning text-center">
          <i className="bi bi-info-circle"></i>
          <p>No dashboard data available.</p>
        </div>
      </div>
    );
  }

  const { overview, alerts, pendingVerifications } = dashboardData;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Admin Dashboard</h1>
          <p className="text-muted">Platform overview and management</p>
        </div>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <AdminNavigation />

      {/* Overview Statistics */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total NGOs Registered
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {overview.totalNgosRegistered || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-building-fill-check text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    NGOs Verified
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {overview.totalNgosVerified || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-patch-check-fill text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Verifications
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {overview.totalNgosPending || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-clock-fill text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Total Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {overview.totalUsersRegistered || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-people-fill text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Statistics */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Donations
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {formatCurrency(overview.totalDonationsAmount)}
                  </div>
                  <div className="text-xs text-muted">
                    {overview.totalDonationsCount || 0} donations
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-currency-dollar text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Active Opportunities
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {overview.activeVolunteerOpportunities || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-person-workspace text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Suspicious Activities
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {overview.suspiciousActivities || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-shield-exclamation text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Missing Fund Reports
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {overview.missingFundReports || 0}
                  </div>
                </div>
                <div className="col-auto">
                  <i
                    className="bi bi-file-earmark-text text-gray-300"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Quick Actions
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <Link
                    to="/admin/ngo-management"
                    className="btn btn-primary w-100"
                  >
                    <i className="bi bi-building-gear me-2"></i>
                    NGO Management
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/admin/donations" className="btn btn-success w-100">
                    <i className="bi bi-cash-stack me-2"></i>
                    Donation Oversight
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link
                    to="/admin/user-management"
                    className="btn btn-info w-100"
                  >
                    <i className="bi bi-people-gear me-2"></i>
                    User Management
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link
                    to="/directory/ngo-directory"
                    className="btn btn-secondary w-100"
                  >
                    <i className="bi bi-building me-2"></i>
                    NGO Directory
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link
                    to="/transparency/ledger"
                    className="btn btn-success w-100"
                  >
                    <i className="bi bi-journal-text me-2"></i>
                    View Ledger
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link
                    to="/events/volunteer-events"
                    className="btn btn-warning w-100"
                  >
                    <i className="bi bi-calendar-event me-2"></i>
                    Manage Events
                  </Link>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-3 mb-2">
                  <Link
                    to="/campaigns/campaign-detail"
                    className="btn btn-info w-100"
                  >
                    <i className="bi bi-megaphone me-2"></i>
                    Campaigns
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link
                    to="/admin/user-management"
                    className="btn btn-dark w-100"
                  >
                    <i className="bi bi-people me-2"></i>
                    User Management
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link
                    to="/admin/reports"
                    className="btn btn-outline-primary w-100"
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    Reports
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link
                    to="/admin/settings"
                    className="btn btn-outline-secondary w-100"
                  >
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Verifications */}
      <div className="row">
        {/* System Alerts */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-exclamation-triangle me-2"></i>
                System Alerts
              </h6>
            </div>
            <div className="card-body">
              {alerts && alerts.length > 0 ? (
                <div className="list-group list-group-flush">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="list-group-item border-0 px-0"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <span
                              className={`badge bg-${getPriorityBadgeClass(
                                alert.priority
                              )} me-2`}
                            >
                              {alert.priority}
                            </span>
                            <h6 className="mb-0">{alert.title}</h6>
                          </div>
                          <p className="text-muted mb-1">{alert.message}</p>
                          <small className="text-muted">
                            {formatDateTime(alert.createdAt)}
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleResolveAlert(alert.id)}
                          title="Resolve Alert"
                        >
                          <i className="bi bi-check"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-check-circle text-success display-4"></i>
                  <p className="text-muted mt-2">No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending NGO Verifications */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-clock me-2"></i>
                Pending NGO Verifications
              </h6>
            </div>
            <div className="card-body">
              {pendingVerifications && pendingVerifications.length > 0 ? (
                <div className="list-group list-group-flush">
                  {pendingVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="list-group-item border-0 px-0"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{verification.ngoName}</h6>
                          <p className="text-muted mb-1">
                            <i className="bi bi-geo-alt me-1"></i>
                            {verification.location} • {verification.cause}
                          </p>
                          <small className="text-muted">
                            Submitted: {formatDate(verification.submittedDate)}
                          </small>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-success"
                            onClick={() =>
                              handleApproveVerification(verification.id)
                            }
                            title="Approve"
                          >
                            <i className="bi bi-check"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleRejectVerification(verification.id)
                            }
                            title="Reject"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-check-circle text-success display-4"></i>
                  <p className="text-muted mt-2">No pending verifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
