import React, { useState, useEffect } from "react";
import { volunteerAPI } from "../../services/api";

const VolunteerOpportunitiesNew = ({ onOpportunitySelect }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [filters, setFilters] = useState({
    cause: "",
    location: "",
    timeCommitment: "",
    workType: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching volunteer opportunities from API...");
      const response = await volunteerAPI.getOpportunities();
      console.log("API Response:", response);
      console.log("API Response Data:", response.data);

      if (response.data && response.data.length > 0) {
        setOpportunities(response.data);
        setFilteredOpportunities(response.data);
        console.log(
          "Successfully loaded",
          response.data.length,
          "opportunities from API"
        );
      } else {
        console.log("No opportunities returned from API");
        setOpportunities([]);
        setFilteredOpportunities([]);
      }
    } catch (error) {
      console.error("Error fetching volunteer opportunities:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError(
        `Failed to load volunteer opportunities: ${
          error.response?.data?.message || error.message
        }. Please check if the backend server is running.`
      );
      setOpportunities([]);
      setFilteredOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = opportunities;

    if (filters.cause) {
      filtered = filtered.filter((opp) => opp.cause === filters.cause);
    }
    if (filters.location) {
      filtered = filtered.filter((opp) =>
        opp.location.includes(filters.location)
      );
    }
    if (filters.timeCommitment) {
      filtered = filtered.filter(
        (opp) => opp.timeCommitment === filters.timeCommitment
      );
    }
    if (filters.workType) {
      filtered = filtered.filter((opp) => opp.workType === filters.workType);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof opp.ngo === "string"
            ? opp.ngo
            : opp.ngo?.organizationName || ""
          )
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, filters, searchTerm]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      High: "danger",
      Medium: "warning",
      Low: "success",
    };
    return `badge bg-${badges[urgency] || "secondary"}`;
  };

  const getProgressPercentage = (applied, needed) => {
    return Math.round((applied / needed) * 100);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search volunteer opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="cause"
            value={filters.cause}
            onChange={handleFilterChange}
          >
            <option value="">All Causes</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Women Empowerment">Women Empowerment</option>
            <option value="Disaster Relief">Disaster Relief</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="timeCommitment"
            value={filters.timeCommitment}
            onChange={handleFilterChange}
          >
            <option value="">All Time</option>
            <option value="2 hours/week">2 hours/week</option>
            <option value="3 hours/week">3 hours/week</option>
            <option value="4 hours">4 hours</option>
            <option value="8 hours">8 hours</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="workType"
            value={filters.workType}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="Physical Work">Physical Work</option>
            <option value="Teaching">Teaching</option>
            <option value="Support Work">Support Work</option>
            <option value="Facilitation">Facilitation</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading volunteer opportunities...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-warning text-center" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Opportunities List */}
      {!loading && !error && (
        <div className="row">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                  <img
                    src={opportunity.image}
                    className="card-img-top"
                    alt={opportunity.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className={getUrgencyBadge(opportunity.urgency)}>
                      {opportunity.urgency}
                    </span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column p-4">
                  <div className="mb-3">
                    <h5 className="card-title text-dark fw-bold mb-2">
                      {opportunity.title}
                    </h5>
                    <p className="card-text text-muted small mb-3">
                      {opportunity.description}
                    </p>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={opportunity.ngoImage || opportunity.ngo?.imageUrl}
                        alt={
                          typeof opportunity.ngo === "string"
                            ? opportunity.ngo
                            : opportunity.ngo?.organizationName || "NGO"
                        }
                        className="rounded-circle me-2"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="mb-0 text-primary">
                          {typeof opportunity.ngo === "string"
                            ? opportunity.ngo
                            : opportunity.ngo?.organizationName ||
                              "Unknown NGO"}
                        </h6>
                        <small className="text-muted">
                          {opportunity.cause}
                        </small>
                      </div>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <small className="text-muted d-flex align-items-center">
                          <i className="bi bi-geo-alt me-1 text-danger"></i>
                          {opportunity.location}
                        </small>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-flex align-items-center">
                          <i className="bi bi-clock me-1 text-danger"></i>
                          {opportunity.timeCommitment}
                        </small>
                      </div>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <small className="text-muted d-flex align-items-center">
                          <i className="bi bi-briefcase me-1 text-danger"></i>
                          {opportunity.workType}
                        </small>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-flex align-items-center">
                          <i className="bi bi-calendar me-1 text-danger"></i>
                          {new Date(opportunity.startDate).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Volunteers Needed</small>
                        <small className="text-muted fw-bold">
                          {opportunity.volunteersApplied}/
                          {opportunity.volunteersNeeded}
                        </small>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-danger"
                          style={{
                            width: `${getProgressPercentage(
                              opportunity.volunteersApplied,
                              opportunity.volunteersNeeded
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        <strong>Requirements:</strong>{" "}
                        {opportunity.requirements.join(", ")}
                      </small>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button
                      className="btn btn-danger w-100 py-2 fw-bold"
                      onClick={() => onOpportunitySelect(opportunity)}
                      disabled={
                        opportunity.volunteersApplied >=
                        opportunity.volunteersNeeded
                      }
                    >
                      <i className="bi bi-person-plus me-2"></i>
                      {opportunity.volunteersApplied >=
                      opportunity.volunteersNeeded
                        ? "Fully Booked"
                        : "APPLY NOW"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOpportunities.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No opportunities found</h4>
          <p className="text-muted">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
};

export default VolunteerOpportunitiesNew;
