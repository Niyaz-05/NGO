import React from 'react';
import { Link } from 'react-router-dom';

const DonorDashboard = () => {
  const stats = [
    { label: 'Total Donations', value: '$5,000', color: 'success' },
    { label: 'NGOs Supported', value: '15', color: 'primary' },
    { label: 'Campaigns', value: '8', color: 'warning' },
    { label: 'Impact Score', value: '95%', color: 'info' }
  ];

  const recentDonations = [
    { id: 1, ngo: 'Women Empowerment Foundation', amount: '500', date: '2024-01-15' },
    { id: 2, ngo: 'Healthcare Access Initiative', amount: '300', date: '2024-01-10' },
    { id: 3, ngo: 'Rural Education Trust', amount: '200', date: '2024-01-05' }
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Donor Dashboard</h1>
      
      

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <Link to="/directory/ngo-directory" className="btn btn-primary w-100">
                    Find NGOs
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/campaigns/campaign-detail" className="btn btn-success w-100">
                    View Campaigns
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/transparency/ledger" className="btn btn-info w-100">
                    Track Impact
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/events/volunteer-events" className="btn btn-warning w-100">
                    Volunteer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Recent Donations</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{donation.ngo}</strong>
                      <br />
                      <small className="text-muted">{donation.date}</small>
                    </div>
                    <span className="badge bg-success">{donation.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default DonorDashboard;
