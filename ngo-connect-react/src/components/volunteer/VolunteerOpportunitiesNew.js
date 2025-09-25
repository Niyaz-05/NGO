import React, { useState, useEffect } from 'react';

const VolunteerOpportunitiesNew = ({ onOpportunitySelect }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [filters, setFilters] = useState({
    cause: '',
    location: '',
    timeCommitment: '',
    workType: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - replace with API call
    const mockOpportunities = [
      {
        id: 1,
        title: "Environmental Cleanup Drive",
        ngo: "Green Earth Foundation",
        cause: "Environment",
        location: "Central Park, New York",
        timeCommitment: "4 hours",
        workType: "Physical Work",
        requirements: ["Physical fitness", "Comfortable with outdoor work"],
        description: "Join us for a community cleanup drive to make our parks cleaner and greener. Help remove litter, plant trees, and educate the community about environmental conservation.",
        startDate: "2024-02-15",
        endDate: "2024-02-15",
        volunteersNeeded: 20,
        volunteersApplied: 15,
        urgency: "Medium",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
        ngoImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=100&h=100&fit=crop"
      },
      {
        id: 2,
        title: "Teaching Assistant",
        ngo: "Education for All",
        cause: "Education",
        location: "Community Center, California",
        timeCommitment: "2 hours/week",
        workType: "Teaching",
        requirements: ["Teaching experience preferred", "Patience with children"],
        description: "Help children with their homework and provide educational support. Work with underprivileged children to improve their academic performance and confidence.",
        startDate: "2024-02-01",
        endDate: "2024-06-30",
        volunteersNeeded: 10,
        volunteersApplied: 7,
        urgency: "High",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
        ngoImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop"
      },
      {
        id: 3,
        title: "Medical Camp Support",
        ngo: "Health First",
        cause: "Healthcare",
        location: "Rural Clinic, Texas",
        timeCommitment: "8 hours",
        workType: "Support Work",
        requirements: ["Basic first aid knowledge", "Comfortable with patients"],
        description: "Assist medical professionals during a free health camp for rural communities. Help with patient registration, basic health checks, and community outreach.",
        startDate: "2024-02-20",
        endDate: "2024-02-20",
        volunteersNeeded: 15,
        volunteersApplied: 12,
        urgency: "High",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        ngoImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop"
      },
      {
        id: 4,
        title: "Women's Workshop Facilitator",
        ngo: "Women Empowerment Hub",
        cause: "Women Empowerment",
        location: "Community Hall, Florida",
        timeCommitment: "3 hours/week",
        workType: "Facilitation",
        requirements: ["Leadership skills", "Experience with women's issues"],
        description: "Facilitate workshops on women's rights and empowerment. Help women develop skills, confidence, and knowledge to improve their lives and communities.",
        startDate: "2024-02-10",
        endDate: "2024-05-10",
        volunteersNeeded: 5,
        volunteersApplied: 3,
        urgency: "Medium",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop",
        ngoImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
      }
    ];
    setOpportunities(mockOpportunities);
    setFilteredOpportunities(mockOpportunities);
  }, []);

  useEffect(() => {
    let filtered = opportunities;

    if (filters.cause) {
      filtered = filtered.filter(opp => opp.cause === filters.cause);
    }
    if (filters.location) {
      filtered = filtered.filter(opp => opp.location.includes(filters.location));
    }
    if (filters.timeCommitment) {
      filtered = filtered.filter(opp => opp.timeCommitment === filters.timeCommitment);
    }
    if (filters.workType) {
      filtered = filtered.filter(opp => opp.workType === filters.workType);
    }
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.ngo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, filters, searchTerm]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'success'
    };
    return `badge bg-${badges[urgency] || 'secondary'}`;
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

      {/* Opportunities List */}
      <div className="row">
        {filteredOpportunities.map(opportunity => (
          <div key={opportunity.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="position-relative">
                <img
                  src={opportunity.image}
                  className="card-img-top"
                  alt={opportunity.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span className={getUrgencyBadge(opportunity.urgency)}>{opportunity.urgency}</span>
                </div>
              </div>
              <div className="card-body d-flex flex-column p-4">
                <div className="mb-3">
                  <h5 className="card-title text-dark fw-bold mb-2">{opportunity.title}</h5>
                  <p className="card-text text-muted small mb-3">{opportunity.description}</p>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={opportunity.ngoImage}
                      alt={opportunity.ngo}
                      className="rounded-circle me-2"
                      style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0 text-primary">{opportunity.ngo}</h6>
                      <small className="text-muted">{opportunity.cause}</small>
                    </div>
                  </div>
                  
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <small className="text-muted d-flex align-items-center">
                        <i className="bi bi-geo-alt me-1 text-danger"></i>{opportunity.location}
                      </small>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-flex align-items-center">
                        <i className="bi bi-clock me-1 text-danger"></i>{opportunity.timeCommitment}
                      </small>
                    </div>
                  </div>
                  
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <small className="text-muted d-flex align-items-center">
                        <i className="bi bi-briefcase me-1 text-danger"></i>{opportunity.workType}
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
                      <small className="text-muted fw-bold">{opportunity.volunteersApplied}/{opportunity.volunteersNeeded}</small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar bg-danger" 
                        style={{ width: `${getProgressPercentage(opportunity.volunteersApplied, opportunity.volunteersNeeded)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">
                      <strong>Requirements:</strong> {opportunity.requirements.join(', ')}
                    </small>
                  </div>
                </div>

                <div className="mt-auto">
                  <button
                    className="btn btn-danger w-100 py-2 fw-bold"
                    onClick={() => onOpportunitySelect(opportunity)}
                    disabled={opportunity.volunteersApplied >= opportunity.volunteersNeeded}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    {opportunity.volunteersApplied >= opportunity.volunteersNeeded ? 'Fully Booked' : 'APPLY NOW'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h4 className="text-muted mt-3">No opportunities found</h4>
          <p className="text-muted">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default VolunteerOpportunitiesNew;
