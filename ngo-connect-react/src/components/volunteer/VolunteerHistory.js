import React, { useState, useEffect } from 'react';

const VolunteerHistory = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with API call
    const mockApplications = [
      {
        id: 1,
        opportunityTitle: "Environmental Cleanup Drive",
        ngo: "Green Earth Foundation",
        cause: "Environment",
        appliedDate: "2024-01-15",
        status: "approved",
        startDate: "2024-02-15",
        endDate: "2024-02-15",
        hoursCompleted: 4,
        totalHours: 4,
        feedback: "Great experience! The team was very organized.",
        rating: 5
      },
      {
        id: 2,
        opportunityTitle: "Teaching Assistant",
        ngo: "Education for All",
        cause: "Education",
        appliedDate: "2024-01-10",
        status: "pending",
        startDate: "2024-02-01",
        endDate: "2024-06-30",
        hoursCompleted: 0,
        totalHours: 40,
        feedback: "",
        rating: 0
      },
      {
        id: 3,
        opportunityTitle: "Medical Camp Support",
        ngo: "Health First",
        cause: "Healthcare",
        appliedDate: "2024-01-05",
        status: "completed",
        startDate: "2024-01-20",
        endDate: "2024-01-20",
        hoursCompleted: 8,
        totalHours: 8,
        feedback: "Very rewarding experience helping the community.",
        rating: 5
      },
      {
        id: 4,
        opportunityTitle: "Women's Workshop Facilitator",
        ngo: "Women Empowerment Hub",
        cause: "Women Empowerment",
        appliedDate: "2024-01-01",
        status: "rejected",
        startDate: "2024-02-10",
        endDate: "2024-05-10",
        hoursCompleted: 0,
        totalHours: 36,
        feedback: "Unfortunately, we had many qualified applicants.",
        rating: 0
      }
    ];
    setApplications(mockApplications);
  }, []);

  const filteredApplications = applications.filter(application => {
    if (filter === 'all') return true;
    return application.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      'approved': 'success',
      'pending': 'warning',
      'completed': 'info',
      'rejected': 'danger'
    };
    return `badge bg-${badges[status] || 'secondary'}`;
  };

  const getTotalHours = () => {
    return applications
      .filter(app => app.status === 'completed')
      .reduce((sum, app) => sum + app.hoursCompleted, 0);
  };

  const getTotalApplications = () => {
    return applications.length;
  };

  const getApprovedApplications = () => {
    return applications.filter(app => app.status === 'approved' || app.status === 'completed').length;
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-8">
          <h4>Your Volunteer History</h4>
          <p className="text-muted">Track all your volunteer applications and activities</p>
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
          {filteredApplications.length > 0 ? (
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
                  {filteredApplications.map(application => (
                    <tr key={application.id}>
                      <td>
                        <div>
                          <h6 className="mb-0">{application.opportunityTitle}</h6>
                          <small className="text-muted">{application.cause}</small>
                        </div>
                      </td>
                      <td>{application.ngo}</td>
                      <td>{new Date(application.appliedDate).toLocaleDateString()}</td>
                      <td>
                        <span className={getStatusBadge(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <small>
                          {new Date(application.startDate).toLocaleDateString()} - {new Date(application.endDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        {application.status === 'completed' ? (
                          <span className="text-success fw-bold">
                            {application.hoursCompleted}/{application.totalHours}h
                          </span>
                        ) : application.status === 'approved' ? (
                          <span className="text-info">
                            0/{application.totalHours}h
                          </span>
                        ) : (
                          <span className="text-muted">
                            -/{application.totalHours}h
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
                                  className={`bi bi-star-fill ${i < application.rating ? 'text-warning' : 'text-muted'}`}
                                  style={{ fontSize: '0.8rem' }}
                                ></i>
                              ))}
                            </div>
                            <small className="text-muted">{application.feedback}</small>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" title="View Details">
                            <i className="bi bi-eye"></i>
                          </button>
                          {application.status === 'completed' && (
                            <button className="btn btn-outline-success" title="Download Certificate">
                              <i className="bi bi-download"></i>
                            </button>
                          )}
                          {application.status === 'pending' && (
                            <button className="btn btn-outline-warning" title="Withdraw Application">
                              <i className="bi bi-x-circle"></i>
                            </button>
                          )}
                          {application.status === 'approved' && (
                            <button className="btn btn-outline-info" title="Start Volunteering">
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
                {filter === 'all' 
                  ? "You haven't applied for any volunteer opportunities yet. Start making a difference today!"
                  : `No ${filter} applications found.`
                }
              </p>
              {filter === 'all' && (
                <button className="btn btn-success">
                  <i className="bi bi-person-plus me-2"></i>Find Volunteer Opportunities
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
