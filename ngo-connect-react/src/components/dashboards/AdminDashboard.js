import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total NGOs', value: '500+', color: 'primary' },
    { label: 'Active Donors', value: '2,500+', color: 'success' },
    { label: 'Volunteers', value: '10,000+', color: 'warning' },
    { label: 'Total Funds', value: '$2M+', color: 'info' }
  ];

  const recentActivities = [
    { id: 1, action: 'New NGO registered', time: '2 hours ago', type: 'registration' },
    { id: 2, action: 'Donation received', time: '4 hours ago', type: 'donation' },
    { id: 3, action: 'Volunteer joined', time: '6 hours ago', type: 'volunteer' },
    { id: 4, action: 'Campaign launched', time: '1 day ago', type: 'campaign' }
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className={`card bg-${stat.color} text-white`}>
              <div className="card-body text-center">
                <h3 className="card-title">{stat.value}</h3>
                <p className="card-text">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                    Manage NGOs
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/transparency/ledger" className="btn btn-success w-100">
                    View Ledger
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/events/volunteer-events" className="btn btn-warning w-100">
                    Manage Events
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/campaigns/campaign-detail" className="btn btn-info w-100">
                    Campaigns
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Recent Activities</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{activity.action}</strong>
                      <br />
                      <small className="text-muted">{activity.time}</small>
                    </div>
                    <span className={`badge bg-${activity.type === 'registration' ? 'primary' : 
                                         activity.type === 'donation' ? 'success' : 
                                         activity.type === 'volunteer' ? 'warning' : 'info'}`}>
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>System Status</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Platform Status:</strong>
                <span className="badge bg-success ms-2">Online</span>
              </div>
              <div className="mb-3">
                <strong>Last Backup:</strong>
                <br />
                <small className="text-muted">2 hours ago</small>
              </div>
              <div className="mb-3">
                <strong>Active Users:</strong>
                <br />
                <small className="text-muted">1,234 online</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
