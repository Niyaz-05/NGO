import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JoinEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event: 'Health Camp',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event registration:', formData);
    alert('Thank you for registering! We will contact you soon.');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2>Join Volunteer Event</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="event" className="form-label">Select Event</label>
                  <select
                    className="form-select"
                    id="event"
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                  >
                    <option value="Health Camp">Health Camp - Jan 20, 2024</option>
                    <option value="Education Drive">Education Drive - Jan 22, 2024</option>
                    <option value="Tree Plantation">Tree Plantation - Jan 25, 2024</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message (Optional)</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any specific skills or preferences..."
                  ></textarea>
                </div>
                
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success btn-lg">
                    Register for Event
                  </button>
                  <Link to="/events/volunteer-events" className="btn btn-outline-secondary">
                    Back to Events
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinEvent;
