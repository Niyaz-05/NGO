import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VolunteerOpportunitiesNew from './VolunteerOpportunitiesNew';
import VolunteerApplication from './VolunteerApplication';
import VolunteerHistory from './VolunteerHistory';

const VolunteerPage = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const handleOpportunitySelect = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setActiveTab('apply');
  };

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">Volunteer Opportunities</h2>
          <Link to="/auth/user-choice" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Back to Options
          </Link>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'opportunities' ? 'active' : ''}`}
              onClick={() => setActiveTab('opportunities')}
            >
              <i className="bi bi-search me-2"></i>Find Opportunities
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'apply' ? 'active' : ''}`}
              onClick={() => setActiveTab('apply')}
              disabled={!selectedOpportunity}
            >
              <i className="bi bi-person-plus me-2"></i>Apply Now
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="bi bi-clock-history me-2"></i>My Applications
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === 'opportunities' && (
            <VolunteerOpportunitiesNew onOpportunitySelect={handleOpportunitySelect} />
          )}
          {activeTab === 'apply' && selectedOpportunity && (
            <VolunteerApplication 
              opportunity={selectedOpportunity} 
              onBack={() => setActiveTab('opportunities')} 
            />
          )}
          {activeTab === 'history' && (
            <VolunteerHistory />
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;
