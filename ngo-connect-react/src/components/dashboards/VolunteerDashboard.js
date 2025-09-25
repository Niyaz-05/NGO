import React from 'react';
import { Link } from 'react-router-dom';

const VolunteerDashboard = () => {
  

  const upcomingEvents = [
    { id: 1, title: 'Health Camp', ngo: 'Healthcare Access Initiative', date: '2024-01-20', time: '9:00 AM' },
    { id: 2, title: 'Education Drive', ngo: 'Rural Education Trust', date: '2024-01-22', time: '2:00 PM' },
    { id: 3, title: 'Tree Plantation', ngo: 'Environmental Conservation Society', date: '2024-01-25', time: '8:00 AM' }
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Volunteer Dashboard</h1>
      
     

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
                  <Link to="/events/volunteer-events" className="btn btn-primary w-100">
                    Find Events
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/events/join-event" className="btn btn-success w-100">
                    Join Event
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/directory/ngo-directory" className="btn btn-info w-100">
                    Browse NGOs
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/campaigns/campaign-detail" className="btn btn-warning w-100">
                    Campaigns
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Upcoming Events</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{event.title}</h6>
                        <p className="mb-1 text-muted">{event.ngo}</p>
                        <small className="text-muted">{event.date} at {event.time}</small>
                      </div>
                      <Link to="/events/join-event" className="btn btn-sm btn-outline-primary">
                        Join
                      </Link>
                    </div>
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

export default VolunteerDashboard;
