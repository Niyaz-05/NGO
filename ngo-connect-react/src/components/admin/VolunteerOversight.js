import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const VolunteerOversight = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchPendingOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/admin/volunteer-opportunities/pending",
        authHeaders
      );
      setOpportunities(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch pending opportunities.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOpportunities();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/api/admin/volunteer-opportunities/${id}/approve`,
        {},
        authHeaders
      );
      toast.success("Opportunity approved!");
      fetchPendingOpportunities(); // Refresh the list
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
        fetchPendingOpportunities(); // Refresh the list
      } catch (error) {
        toast.error("Failed to reject opportunity.");
      }
    }
  };

  if (loading) {
    return <p className="text-center">Loading pending opportunities...</p>;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">
          <i className="bi bi-patch-check-fill me-2"></i>Volunteer Opportunity
          Approvals
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
                    <td className="text-center">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted">
            No opportunities are currently pending approval.
          </p>
        )}
      </div>
    </div>
  );
};

export default VolunteerOversight;
