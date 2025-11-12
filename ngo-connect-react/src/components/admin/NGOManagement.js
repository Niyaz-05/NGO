import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavigation from "./AdminNavigation";

const NGOManagement = () => {
  const [ngos, setNgos] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [actionNotes, setActionNotes] = useState("");

  const statusOptions = [
    { value: "ALL", label: "All NGOs", color: "secondary" },
    { value: "PENDING", label: "Pending Review", color: "warning" },
    { value: "ACTIVE", label: "Active", color: "success" },
    { value: "SUSPENDED", label: "Suspended", color: "danger" },
    { value: "DEACTIVATED", label: "Deactivated", color: "dark" },
    { value: "REJECTED", label: "Rejected", color: "danger" },
  ];

  useEffect(() => {
    fetchNGOs();
  }, [statusFilter]);

  const fetchNGOs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const params = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";

      const response = await axios.get(
        `http://localhost:8080/api/admin/ngos${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNgos(response.data);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
      setError("Failed to load NGO data. Please check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNGODetails = async (ngoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/admin/ngos/${ngoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedNGO(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching NGO details:", error);
      alert("Failed to load NGO details.");
    }
  };

  const handleNGOAction = async () => {
    try {
      if (!selectedNGO || !actionType) return;

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      let endpoint = "";
      let payload = {
        adminId: user.id,
      };

      switch (actionType) {
        case "APPROVE":
          endpoint = `http://localhost:8080/api/admin/ngos/${selectedNGO.id}/approve`;
          payload.notes = actionNotes;
          break;
        case "REJECT":
          endpoint = `http://localhost:8080/api/admin/ngos/${selectedNGO.id}/reject`;
          payload.reason = actionReason;
          break;
        case "SUSPEND":
          endpoint = `http://localhost:8080/api/admin/ngos/${selectedNGO.id}/suspend`;
          payload.reason = actionReason;
          break;
        case "DEACTIVATE":
          endpoint = `http://localhost:8080/api/admin/ngos/${selectedNGO.id}/deactivate`;
          payload.reason = actionReason;
          break;
        case "REACTIVATE":
          endpoint = `http://localhost:8080/api/admin/ngos/${selectedNGO.id}/reactivate`;
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
      await fetchNGOs();

      // Close modals and reset form
      setShowActionModal(false);
      setShowDetailsModal(false);
      setActionType("");
      setActionReason("");
      setActionNotes("");
      setSelectedNGO(null);

      alert(`NGO ${actionType.toLowerCase()}ed successfully!`);
    } catch (error) {
      console.error(`Error ${actionType.toLowerCase()}ing NGO:`, error);
      alert(`Failed to ${actionType.toLowerCase()} NGO. Please try again.`);
    }
  };

  const openActionModal = (ngo, action) => {
    setSelectedNGO(ngo);
    setActionType(action);
    setActionReason("");
    setActionNotes("");
    setShowDetailsModal(false);
    setShowActionModal(true);
  };

  const getStatusBadgeClass = (status) => {
    const statusConfig = statusOptions.find((opt) => opt.value === status);
    return statusConfig ? statusConfig.color : "secondary";
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
          <p className="mt-3">Loading NGO data...</p>
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
          <button className="btn btn-outline-danger" onClick={fetchNGOs}>
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
          <h1 className="h3 mb-0 text-gray-800">NGO Management</h1>
          <p className="text-muted">
            Review, verify, and manage NGO applications and profiles
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={fetchNGOs}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Navigation */}
      <AdminNavigation />

      {/* Status Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">
                Filter by Status
              </h6>
            </div>
            <div className="card-body">
              <div className="btn-group" role="group">
                {statusOptions.map((option) => (
                  <input
                    key={option.value}
                    type="radio"
                    className="btn-check"
                    name="statusFilter"
                    id={`status-${option.value}`}
                    checked={statusFilter === option.value}
                    onChange={() => setStatusFilter(option.value)}
                  />
                ))}
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`btn btn-outline-${option.color}`}
                    htmlFor={`status-${option.value}`}
                  >
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NGO List */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-building me-2"></i>
                NGO Applications & Profiles ({ngos.length})
              </h6>
            </div>
            <div className="card-body">
              {ngos.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox display-4 text-muted"></i>
                  <p className="text-muted mt-2">
                    No NGOs found for the selected status
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Organization</th>
                        <th>Cause</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Registration</th>
                        <th>Donations</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ngos.map((ngo) => (
                        <tr key={ngo.id}>
                          <td>
                            <div>
                              <strong>{ngo.organizationName}</strong>
                              <br />
                              <small className="text-muted">{ngo.email}</small>
                              {ngo.registrationNumber && (
                                <>
                                  <br />
                                  <small className="text-info">
                                    Reg: {ngo.registrationNumber}
                                  </small>
                                </>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{ngo.cause}</span>
                          </td>
                          <td>{ngo.location}</td>
                          <td>
                            <span
                              className={`badge bg-${getStatusBadgeClass(
                                ngo.status
                              )}`}
                            >
                              {ngo.status}
                            </span>
                            {ngo.isVerified && (
                              <>
                                <br />
                                <small className="text-success">
                                  ✓ Verified
                                </small>
                              </>
                            )}
                          </td>
                          <td>
                            <small>{formatDate(ngo.createdAt)}</small>
                          </td>
                          <td>{formatCurrency(ngo.totalDonations)}</td>
                          <td>
                            {ngo.rating > 0 ? (
                              <span>
                                <i className="bi bi-star-fill text-warning"></i>{" "}
                                {ngo.rating}
                              </span>
                            ) : (
                              <span className="text-muted">No rating</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-info"
                                onClick={() => fetchNGODetails(ngo.id)}
                                title="View Details"
                              >
                                <i className="bi bi-eye"></i>
                              </button>

                              {ngo.status === "PENDING" && (
                                <>
                                  <button
                                    className="btn btn-success"
                                    onClick={() =>
                                      openActionModal(ngo, "APPROVE")
                                    }
                                    title="Approve"
                                  >
                                    <i className="bi bi-check-circle"></i>
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      openActionModal(ngo, "REJECT")
                                    }
                                    title="Reject"
                                  >
                                    <i className="bi bi-x-circle"></i>
                                  </button>
                                </>
                              )}

                              {ngo.status === "ACTIVE" && (
                                <button
                                  className="btn btn-warning"
                                  onClick={() =>
                                    openActionModal(ngo, "SUSPEND")
                                  }
                                  title="Suspend"
                                >
                                  <i className="bi bi-pause-circle"></i>
                                </button>
                              )}

                              {(ngo.status === "SUSPENDED" ||
                                ngo.status === "DEACTIVATED") && (
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    openActionModal(ngo, "REACTIVATE")
                                  }
                                  title="Reactivate"
                                >
                                  <i className="bi bi-play-circle"></i>
                                </button>
                              )}

                              {ngo.status !== "DEACTIVATED" &&
                                ngo.status !== "REJECTED" && (
                                  <button
                                    className="btn btn-dark"
                                    onClick={() =>
                                      openActionModal(ngo, "DEACTIVATE")
                                    }
                                    title="Deactivate"
                                  >
                                    <i className="bi bi-stop-circle"></i>
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

      {/* NGO Details Modal */}
      {showDetailsModal && selectedNGO && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-building me-2"></i>
                  {selectedNGO.organizationName}
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
                            <strong>Organization:</strong>
                          </td>
                          <td>{selectedNGO.organizationName}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email:</strong>
                          </td>
                          <td>{selectedNGO.email}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phone:</strong>
                          </td>
                          <td>{selectedNGO.phone}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Website:</strong>
                          </td>
                          <td>
                            {selectedNGO.website ? (
                              <a
                                href={selectedNGO.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedNGO.website}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Cause:</strong>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {selectedNGO.cause}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Location:</strong>
                          </td>
                          <td>{selectedNGO.location}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Status & Verification</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Status:</strong>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getStatusBadgeClass(
                                selectedNGO.status
                              )}`}
                            >
                              {selectedNGO.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Verified:</strong>
                          </td>
                          <td>
                            {selectedNGO.isVerified ? (
                              <span className="text-success">✓ Yes</span>
                            ) : (
                              <span className="text-danger">✗ No</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Registration #:</strong>
                          </td>
                          <td>{selectedNGO.registrationNumber || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Founded:</strong>
                          </td>
                          <td>{selectedNGO.foundedYear || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Total Donations:</strong>
                          </td>
                          <td>{formatCurrency(selectedNGO.totalDonations)}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Rating:</strong>
                          </td>
                          <td>
                            {selectedNGO.rating > 0 ? (
                              <>
                                <i className="bi bi-star-fill text-warning"></i>{" "}
                                {selectedNGO.rating}
                              </>
                            ) : (
                              "No rating"
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedNGO.description && (
                  <div className="mt-3">
                    <h6>Description</h6>
                    <p>{selectedNGO.description}</p>
                  </div>
                )}

                <div className="mt-3">
                  <h6>Registration Documents</h6>
                  {selectedNGO.registrationDocuments &&
                  selectedNGO.registrationDocuments.length > 0 ? (
                    <div className="list-group">
                      {selectedNGO.registrationDocuments.map((doc, index) => (
                        <div key={index} className="list-group-item">
                          <i className="bi bi-file-earmark-text me-2"></i>
                          {doc}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No documents available</p>
                  )}
                </div>
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
      {showActionModal && selectedNGO && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {actionType} NGO: {selectedNGO.organizationName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowActionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {(actionType === "REJECT" ||
                  actionType === "SUSPEND" ||
                  actionType === "DEACTIVATE") && (
                  <div className="mb-3">
                    <label htmlFor="actionReason" className="form-label">
                      Reason <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="actionReason"
                      rows="3"
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder={`Please provide the reason for ${actionType.toLowerCase()}ing this NGO`}
                      required
                    ></textarea>
                  </div>
                )}

                {(actionType === "APPROVE" || actionType === "REACTIVATE") && (
                  <div className="mb-3">
                    <label htmlFor="actionNotes" className="form-label">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="form-control"
                      id="actionNotes"
                      rows="3"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add any additional notes about this action"
                    ></textarea>
                  </div>
                )}

                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Warning:</strong> This action will{" "}
                  {actionType.toLowerCase()} the NGO and may affect their
                  ability to receive donations or manage volunteer
                  opportunities.
                </div>
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
                  className={`btn btn-${
                    actionType === "APPROVE" || actionType === "REACTIVATE"
                      ? "success"
                      : "danger"
                  }`}
                  onClick={handleNGOAction}
                  disabled={
                    (actionType === "REJECT" ||
                      actionType === "SUSPEND" ||
                      actionType === "DEACTIVATE") &&
                    !actionReason.trim()
                  }
                >
                  <i className="bi bi-check me-2"></i>
                  Confirm {actionType}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGOManagement;
