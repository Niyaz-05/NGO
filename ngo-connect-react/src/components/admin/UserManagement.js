import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTypeFilter, setUserTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionNotes, setActionNotes] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userActivity, setUserActivity] = useState(null);

  const userTypeOptions = [
    { value: "ALL", label: "All Types", color: "secondary" },
    { value: "DONOR", label: "Donors", color: "success" },
    { value: "VOLUNTEER", label: "Volunteers", color: "info" },
    { value: "NGO", label: "NGO Admins", color: "primary" },
  ];

  const statusOptions = [
    { value: "ALL", label: "All Status", color: "secondary" },
    { value: "ACTIVE", label: "Active", color: "success" },
    { value: "BLOCKED", label: "Blocked", color: "danger" },
    { value: "UNVERIFIED", label: "Unverified", color: "warning" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [userTypeFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (userTypeFilter !== "ALL") params.append("userType", userTypeFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const paramString = params.toString();

      const response = await axios.get(
        `http://localhost:8080/api/admin/users${
          paramString ? `?${paramString}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load user data. Please check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedUser(response.data);

      // Fetch user activity
      const activityResponse = await axios.get(
        `http://localhost:8080/api/admin/users/${userId}/activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserActivity(activityResponse.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Failed to load user details.");
    }
  };

  const handleUserAction = async () => {
    try {
      if (!selectedUser || !actionType) return;

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      let endpoint = "";
      let payload = {
        adminId: user.id,
      };

      switch (actionType) {
        case "RESET_PASSWORD":
          endpoint = `http://localhost:8080/api/admin/users/${selectedUser.id}/reset-password`;
          payload.newPassword = newPassword;
          break;
        case "BLOCK":
          endpoint = `http://localhost:8080/api/admin/users/${selectedUser.id}/block`;
          payload.reason = actionReason;
          break;
        case "UNBLOCK":
          endpoint = `http://localhost:8080/api/admin/users/${selectedUser.id}/unblock`;
          payload.notes = actionNotes;
          break;
        default:
          throw new Error("Invalid action type");
      }

      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Refresh data
      await fetchUsers();

      // Close modals and reset form
      setShowActionModal(false);
      setShowDetailsModal(false);
      setActionType("");
      setActionReason("");
      setActionNotes("");
      setNewPassword("");
      setSelectedUser(null);

      alert(
        `User ${actionType
          .toLowerCase()
          .replace("_", " ")} completed successfully!`
      );
    } catch (error) {
      console.error(
        `Error ${actionType.toLowerCase().replace("_", " ")}ing user:`,
        error
      );
      alert(
        `Failed to ${actionType
          .toLowerCase()
          .replace("_", " ")} user. Please try again.`
      );
    }
  };

  const openActionModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setActionReason("");
    setActionNotes("");
    setNewPassword("");
    setShowDetailsModal(false);
    setShowActionModal(true);
  };

  const getStatusBadgeClass = (status) => {
    const statusConfig = statusOptions.find((opt) => opt.value === status);
    return statusConfig ? statusConfig.color : "secondary";
  };

  const getUserTypeBadgeClass = (userType) => {
    const typeConfig = userTypeOptions.find((opt) => opt.value === userType);
    return typeConfig ? typeConfig.color : "secondary";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading user data...</p>
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
          <button className="btn btn-outline-danger" onClick={fetchUsers}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">User Management</h1>
          <p className="text-muted">
            Manage registered users, reset credentials, and track activities
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={fetchUsers}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">
                Filter Users
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">User Type</label>
                  <div className="btn-group d-flex" role="group">
                    {userTypeOptions.map((option) => (
                      <React.Fragment key={option.value}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="userTypeFilter"
                          id={`userType-${option.value}`}
                          checked={userTypeFilter === option.value}
                          onChange={() => setUserTypeFilter(option.value)}
                        />
                        <label
                          className={`btn btn-outline-${option.color}`}
                          htmlFor={`userType-${option.value}`}
                        >
                          {option.label}
                        </label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <div className="btn-group d-flex" role="group">
                    {statusOptions.map((option) => (
                      <React.Fragment key={option.value}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="statusFilter"
                          id={`status-${option.value}`}
                          checked={statusFilter === option.value}
                          onChange={() => setStatusFilter(option.value)}
                        />
                        <label
                          className={`btn btn-outline-${option.color}`}
                          htmlFor={`status-${option.value}`}
                        >
                          {option.label}
                        </label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-people me-2"></i>
                Registered Users ({users.length})
              </h6>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox display-4 text-muted"></i>
                  <p className="text-muted mt-2">
                    No users found for the selected filters
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Email Verified</th>
                        <th>Total Donations</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div>
                              <strong>{user.fullName}</strong>
                              <br />
                              <small className="text-muted">{user.email}</small>
                              {user.phone && (
                                <>
                                  <br />
                                  <small className="text-info">
                                    {user.phone}
                                  </small>
                                </>
                              )}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getUserTypeBadgeClass(
                                user.userType
                              )}`}
                            >
                              {user.userType}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getStatusBadgeClass(
                                user.status
                              )}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td>
                            {user.emailVerified ? (
                              <span className="text-success">✓ Verified</span>
                            ) : (
                              <span className="text-warning">✗ Unverified</span>
                            )}
                          </td>
                          <td>{formatCurrency(user.totalDonations)}</td>
                          <td>
                            <small>{formatDate(user.createdAt)}</small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-info"
                                onClick={() => fetchUserDetails(user.id)}
                                title="View Details"
                              >
                                <i className="bi bi-eye"></i>
                              </button>

                              <button
                                className="btn btn-warning"
                                onClick={() =>
                                  openActionModal(user, "RESET_PASSWORD")
                                }
                                title="Reset Password"
                              >
                                <i className="bi bi-key"></i>
                              </button>

                              {user.status === "BLOCKED" ? (
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    openActionModal(user, "UNBLOCK")
                                  }
                                  title="Unblock User"
                                >
                                  <i className="bi bi-unlock"></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-danger"
                                  onClick={() => openActionModal(user, "BLOCK")}
                                  title="Block User"
                                >
                                  <i className="bi bi-lock"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person me-2"></i>
                  {selectedUser.fullName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Basic Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Full Name:</strong>
                          </td>
                          <td>{selectedUser.fullName}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email:</strong>
                          </td>
                          <td>{selectedUser.email}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phone:</strong>
                          </td>
                          <td>{selectedUser.phone || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Address:</strong>
                          </td>
                          <td>{selectedUser.address || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>User Type:</strong>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getUserTypeBadgeClass(
                                selectedUser.userType
                              )}`}
                            >
                              {selectedUser.userType}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Status:</strong>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getStatusBadgeClass(
                                selectedUser.status
                              )}`}
                            >
                              {selectedUser.status}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Account Details</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Email Verified:</strong>
                          </td>
                          <td>
                            {selectedUser.emailVerified ? (
                              <span className="text-success">✓ Yes</span>
                            ) : (
                              <span className="text-danger">✗ No</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Is Blocked:</strong>
                          </td>
                          <td>
                            {selectedUser.isBlocked ? (
                              <span className="text-danger">✓ Blocked</span>
                            ) : (
                              <span className="text-success">
                                ✗ Not Blocked
                              </span>
                            )}
                          </td>
                        </tr>
                        {selectedUser.isBlocked && (
                          <>
                            <tr>
                              <td>
                                <strong>Block Reason:</strong>
                              </td>
                              <td>{selectedUser.blockReason || "N/A"}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Blocked At:</strong>
                              </td>
                              <td>{formatDate(selectedUser.blockedAt)}</td>
                            </tr>
                          </>
                        )}
                        <tr>
                          <td>
                            <strong>Total Donations:</strong>
                          </td>
                          <td>{formatCurrency(selectedUser.totalDonations)}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Joined:</strong>
                          </td>
                          <td>{formatDate(selectedUser.createdAt)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activity Statistics */}
                {userActivity && (
                  <div className="row mt-4">
                    <div className="col-12">
                      <h6>Activity Statistics</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="card bg-light">
                            <div className="card-body">
                              <h6 className="card-title">Donation Activity</h6>
                              <p className="card-text">
                                <strong>Total Donations:</strong>{" "}
                                {userActivity.totalDonations}
                                <br />
                                <strong>Total Amount:</strong>{" "}
                                {formatCurrency(
                                  userActivity.totalDonationAmount
                                )}
                              </p>
                              {userActivity.recentDonations.length > 0 && (
                                <div>
                                  <small className="text-muted">
                                    Recent Donations:
                                  </small>
                                  <ul className="list-unstyled mt-2">
                                    {userActivity.recentDonations
                                      .slice(0, 3)
                                      .map((donation) => (
                                        <li key={donation.id} className="small">
                                          {formatCurrency(donation.amount)} to{" "}
                                          {donation.ngoName}
                                          <small className="text-muted">
                                            {" "}
                                            ({formatDate(donation.donatedAt)})
                                          </small>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card bg-light">
                            <div className="card-body">
                              <h6 className="card-title">Volunteer Activity</h6>
                              <p className="card-text">
                                <strong>Applications:</strong>{" "}
                                {userActivity.totalVolunteerApplications}
                              </p>
                              {userActivity.recentVolunteerApplications.length >
                                0 && (
                                <div>
                                  <small className="text-muted">
                                    Recent Applications:
                                  </small>
                                  <ul className="list-unstyled mt-2">
                                    {userActivity.recentVolunteerApplications
                                      .slice(0, 3)
                                      .map((app) => (
                                        <li key={app.id} className="small">
                                          {app.title} at {app.ngoName}
                                          <small className="text-muted">
                                            {" "}
                                            ({formatDate(app.createdAt)})
                                          </small>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {actionType === "RESET_PASSWORD" && "Reset User Password"}
                  {actionType === "BLOCK" && "Block User Account"}
                  {actionType === "UNBLOCK" && "Unblock User Account"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowActionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>User:</strong> {selectedUser.fullName} (
                  {selectedUser.email})
                </p>

                {actionType === "RESET_PASSWORD" && (
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                )}

                {actionType === "BLOCK" && (
                  <div className="mb-3">
                    <label htmlFor="actionReason" className="form-label">
                      Block Reason <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="actionReason"
                      rows="3"
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Reason for blocking this user"
                    ></textarea>
                  </div>
                )}

                {actionType === "UNBLOCK" && (
                  <div className="mb-3">
                    <label htmlFor="actionNotes" className="form-label">
                      Unblock Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="actionNotes"
                      rows="3"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Optional notes about unblocking"
                    ></textarea>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowActionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${
                    actionType === "BLOCK"
                      ? "btn-danger"
                      : actionType === "UNBLOCK"
                      ? "btn-success"
                      : "btn-warning"
                  }`}
                  onClick={handleUserAction}
                  disabled={
                    (actionType === "RESET_PASSWORD" && !newPassword) ||
                    (actionType === "BLOCK" && !actionReason)
                  }
                >
                  {actionType === "RESET_PASSWORD" && "Reset Password"}
                  {actionType === "BLOCK" && "Block User"}
                  {actionType === "UNBLOCK" && "Unblock User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
