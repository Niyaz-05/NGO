import React from 'react';
import { Link } from 'react-router-dom';

const VolunteerEvents = () => {
  const events = [
    {
      id: 1,
      title: "Health Camp",
      ngo: "Healthcare Access Initiative",
      image: "https://savioursfoundation.org/wp-content/uploads/2020/03/Health.jpg",
      date: "2024-01-20",
      time: "9:00 AM - 5:00 PM",
      location: "Mumbai, Maharashtra",
      volunteers: 25,
      maxVolunteers: 50,
      description: "Join us for a health camp providing free medical checkups to rural communities."
    },
    {
      id: 2,
      title: "Education Drive",
      ngo: "Rural Education Trust",
      image: "https://drop.ndtv.com/albums/BUSINESS/ngo-education/educategirls.jpg",
      date: "2024-01-22",
      time: "2:00 PM - 6:00 PM",
      location: "Pune, Maharashtra",
      volunteers: 15,
      maxVolunteers: 30,
      description: "Help distribute educational materials and conduct awareness sessions."
    },
    {
      id: 3,
      title: "Tree Plantation",
      ngo: "Environmental Conservation Society",
      image: "https://im.whatshot.in/img/2020/Jun/jeevit-cropped-1591264925.jpg",
      date: "2024-01-25",
      time: "8:00 AM - 12:00 PM",
      location: "Hyderabad, Telangana",
      volunteers: 40,
      maxVolunteers: 60,
      description: "Participate in our tree plantation drive to make the environment greener."
    }
  ];

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Volunteer Events</h1>
      
      <div className="row">
        {events.map((event) => (
          <div key={event.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <img 
                src={event.image} 
                className="card-img-top" 
                alt={event.title}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="text-muted">{event.ngo}</p>
                <p className="card-text">{event.description}</p>
                
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar"></i> {event.date}<br />
                    <i className="bi bi-clock"></i> {event.time}<br />
                    <i className="bi bi-geo-alt"></i> {event.location}
                  </small>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">
                    Volunteers: {event.volunteers}/{event.maxVolunteers}
                  </small>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${(event.volunteers / event.maxVolunteers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <Link to="/events/join-event" className="btn btn-primary">
                  Join Event
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerEvents;
