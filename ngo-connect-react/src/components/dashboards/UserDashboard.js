import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from local storage or API
    const fetchUserData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData({
          name: user.name || user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the user data via API
    console.log('Updating user data:', userData);
    
    // Update local storage with new data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...userData,
      fullName: userData.name // Keep backward compatibility
    }));
    
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white border-bottom-0 pt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0">
                    <FaUser className="me-2 text-primary" />
                    My Profile
                  </h2>
                  {!isEditing && (
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser className="text-muted" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope className="text-muted" />
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      <small className="text-muted">Email cannot be changed</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaPhone className="text-muted" />
                        </span>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaMapMarkerAlt className="text-muted" />
                        </span>
                        <textarea
                          className="form-control"
                          name="address"
                          rows="3"
                          value={userData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details">
                    <div className="mb-4">
                      <h5 className="text-muted mb-4">Personal Information</h5>
                      <div className="d-flex align-items-center mb-4">
                        <div className="me-3 text-muted">
                          <FaUser size={20} />
                        </div>
                        <div>
                          <div className="text-muted small">Full Name</div>
                          <div className="fw-medium">{userData.name || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-4">
                        <div className="me-3 text-muted">
                          <FaEnvelope size={20} />
                        </div>
                        <div>
                          <div className="text-muted small">Email Address</div>
                          <div className="fw-medium">{userData.email || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-4">
                        <div className="me-3 text-muted">
                          <FaPhone size={20} />
                        </div>
                        <div>
                          <div className="text-muted small">Phone Number</div>
                          <div className="fw-medium">{userData.phone || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-start">
                        <div className="me-3 text-muted pt-1">
                          <FaMapMarkerAlt size={20} />
                        </div>
                        <div>
                          <div className="text-muted small">Address</div>
                          <div className="fw-medium">
                            {userData.address || 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
