import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AdminNavigation from "./AdminNavigation";

const VolunteerOversight = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAllOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/admin/volunteer-opportunities",
        authHeaders
      );
  // Ensure opportunities is always an array
  const data = response.data;
  setOpportunities(Array.isArray(data) ? data : (data ? [data] : []));
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch volunteer opportunities.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOpportunities();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/admin/volunteer-opportunities/${id}/approve`,
        {},
        authHeaders
      );
      toast.success("Opportunity approved!");
      fetchAllOpportunities(); // Refresh the list
    } catch (error) {
      toast.error("Failed to approve opportunity.");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this opportunity?")) {
      try {
        await axios.post(
          `http://localhost:8080/api/admin/volunteer-opportunities/${id}/reject`,
          {},
          authHeaders
        );
        toast.warn("Opportunity rejected.");
        fetchAllOpportunities(); // Refresh the list
      } catch (error) {
        toast.error("Failed to reject opportunity.");
      }
    }
  };

  if (loading) {
    return <p className="text-center">Loading volunteer opportunities...</p>;
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Volunteer Opportunities</h1>
          <p className="text-muted">
            Monitor and manage volunteer opportunities
          </p>
        </div>
      </div>

      {/* Navigation */}
      <AdminNavigation />

      {/* Volunteer Opportunities Table */}
      <div className="card shadow-sm">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            <i className="bi bi-patch-check-fill me-2"></i>All Volunteer
            Opportunities
          </h6>
        </div>
        <div className="card-body">
          {opportunities.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>NGO</th>
                    <th>Cause</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Volunteers</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((op) => (
                    <tr key={op.id}>
                      <td>{op.title}</td>
                      <td>{op.ngo?.organizationName || "N/A"}</td>
                      <td>{op.cause}</td>
                      <td>{op.location}</td>
                      <td>
                        <span
                          className={`badge ${
                            op.status === "ACTIVE"
                              ? "bg-success"
                              : op.status === "PENDING_APPROVAL"
                              ? "bg-warning"
                              : op.status === "REJECTED"
                              ? "bg-danger"
                              : op.status === "COMPLETED"
                              ? "bg-info"
                              : op.status === "FULL"
                              ? "bg-secondary"
                              : "bg-light"
                          }`}
                        >
                          {op.status || (op.isActive ? "ACTIVE" : "INACTIVE")}
                        </span>
                      </td>
                      <td>
                        {op.volunteersApplied || 0}/{op.volunteersNeeded || 0}
                      </td>
                      <td className="text-center">
                        {op.status === "PENDING_APPROVAL" ||
                        (!op.status && !op.isActive) ? (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleApprove(op.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleReject(op.id)}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">
                            No actions available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">
              No volunteer opportunities found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerOversight;
