import React, { useState, useEffect } from "react";
import { volunteerAPI } from "../../services/api";
import { toast } from "react-toastify";

const VolunteerHistory = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplicationHistory();
  }, []);

  const fetchApplicationHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!currentUser.id) {
        setError("User not found. Please log in again.");
        return;
      }

      const response = await volunteerAPI.getUserApplications(currentUser.id);
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching application history:", error);
      setError(
        "Failed to load application history. Please check if the backend server is running."
      );
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    if (filter === "all") return true;
    return application.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      approved: "success",
      pending: "warning",
      completed: "info",
      rejected: "danger",
    };
    return `badge bg-${badges[status] || "secondary"}`;
  };

  const getTotalHours = () => {
    return applications
      .filter((app) => app.status === "completed")
      .reduce((sum, app) => sum + app.hoursCompleted, 0);
  };

  const getTotalApplications = () => {
    return applications.length;
  };

  const getApprovedApplications = () => {
    return applications.filter(
      (app) => app.status === "approved" || app.status === "completed"
    ).length;
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-8">
          <h4>Your Volunteer History</h4>
          <p className="text-muted">
            Track all your volunteer applications and activities
          </p>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3 className="card-title">{getTotalHours()}</h3>
              <p className="card-text">Hours Volunteered</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3 className="card-title">{getTotalApplications()}</h3>
              <p className="card-text">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3 className="card-title">{getApprovedApplications()}</h3>
              <p className="card-text">Approved/Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading your application history...</p>
            </div>
          ) : error ? (
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle"></i>
              <p className="mb-2">{error}</p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={fetchApplicationHistory}
              >
                Try Again
              </button>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>NGO</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Hours</th>
                    <th>Feedback</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id}>
                      <td>
                        <div>
                          <h6 className="mb-0">
                            {application.opportunityTitle}
                          </h6>
                          <small className="text-muted">
                            {application.cause}
                          </small>
                        </div>
                      </td>
                      <td>{application.ngo}</td>
                      <td>
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={getStatusBadge(application.status)}>
                          {application.status
                            ? application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td>
                        <small>
                          {application.startDate
                            ? new Date(
                                application.startDate
                              ).toLocaleDateString()
                            : "-"}{" "}
                          -{" "}
                          {application.endDate
                            ? new Date(application.endDate).toLocaleDateString()
                            : "-"}
                        </small>
                      </td>
                      <td>
                        {application.status === "completed" ? (
                          <span className="text-success fw-bold">
                            {application.hoursCompleted || 0}/
                            {application.totalHours || 0}h
                          </span>
                        ) : application.status === "approved" ? (
                          <span className="text-info">
                            0/{application.totalHours || 0}h
                          </span>
                        ) : (
                          <span className="text-muted">
                            -/{application.totalHours || 0}h
                          </span>
                        )}
                      </td>
                      <td>
                        {application.feedback ? (
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`bi bi-star-fill ${
                                    i < (application.rating || 0)
                                      ? "text-warning"
                                      : "text-muted"
                                  }`}
                                  style={{ fontSize: "0.8rem" }}
                                ></i>
                              ))}
                            </div>
                            <small className="text-muted">
                              {application.feedback}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {application.status === "completed" && (
                            <button
                              className="btn btn-outline-success"
                              title="Download Certificate"
                            >
                              <i className="bi bi-download"></i>
                            </button>
                          )}
                          {application.status === "pending" && (
                            <button
                              className="btn btn-outline-warning"
                              title="Withdraw Application"
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          )}
                          {application.status === "approved" && (
                            <button
                              className="btn btn-outline-info"
                              title="Start Volunteering"
                            >
                              <i className="bi bi-play-circle"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-person-check display-1 text-muted"></i>
              <h4 className="text-muted mt-3">No applications found</h4>
              <p className="text-muted">
                {filter === "all"
                  ? "You haven't applied for any volunteer opportunities yet. Start making a difference today!"
                  : `No ${filter} applications found.`}
              </p>
              {filter === "all" && (
                <button className="btn btn-success">
                  <i className="bi bi-person-plus me-2"></i>Find Volunteer
                  Opportunities
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerHistory;
