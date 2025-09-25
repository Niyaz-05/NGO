import React, { useState, useEffect } from "react";
import { volunteerAPI } from "../../services/api";
import { toast } from "react-toastify";

const VolunteerOpportunities = ({ onOpportunitySelect }) => {
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

      const response = await volunteerAPI.getOpportunities();
      const opportunitiesData = response.data || [];
      console.log("API Response:", response);
      console.log("Opportunities Data:", opportunitiesData);
      setOpportunities(opportunitiesData);
      setFilteredOpportunities(opportunitiesData);

      if (opportunitiesData.length === 0) {
        console.log("No opportunities returned from API");
        setError("No volunteer opportunities available at the moment.");
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setError(
        "Failed to load volunteer opportunities. Please check if the backend server is running."
      );
      toast.error("Failed to load opportunities from server.");
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
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      <div className="row">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading volunteer opportunities...</p>
          </div>
        ) : error ? (
          <div className="col-12">
            <div className="alert alert-warning text-center">
              <i className="bi bi-exclamation-triangle"></i>
              <p className="mb-2">{error}</p>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={fetchOpportunities}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="col-12 text-center py-5">
            <i
              className="bi bi-search text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="mt-3 text-muted">
              No opportunities found matching your criteria.
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <img
                  src={opportunity.image}
                  className="card-img-top"
                  alt={opportunity.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{opportunity.title}</h5>
                    <span className={getUrgencyBadge(opportunity.urgency)}>
                      {opportunity.urgency}
                    </span>
                  </div>
                  <p className="card-text text-muted small">
                    {opportunity.description}
                  </p>

                  <div className="mt-auto">
                    <div className="row mb-2">
                      <div className="col-6">
                        <small className="text-muted">
                          <i className="bi bi-building me-1"></i>
                          {typeof opportunity.ngo === "string"
                            ? opportunity.ngo
                            : opportunity.ngo?.organizationName ||
                              "Unknown NGO"}
                        </small>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {opportunity.location}
                        </small>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-6">
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {opportunity.timeCommitment}
                        </small>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">
                          <i className="bi bi-briefcase me-1"></i>
                          {opportunity.workType}
                        </small>
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(
                          opportunity.startDate
                        ).toLocaleDateString()} -{" "}
                        {new Date(opportunity.endDate).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Volunteers Needed</small>
                        <small className="text-muted">
                          {opportunity.volunteersApplied}/
                          {opportunity.volunteersNeeded}
                        </small>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-success"
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

                    <button
                      className="btn btn-success w-100"
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
                        : "Apply Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerOpportunities;
