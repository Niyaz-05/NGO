import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, City, Country',
    userType: 'Donor'
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <FaUser className="me-2 text-primary" />
                  My Profile
                </h4>
                {!isEditing && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="me-1" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            <div className="card-body p-4">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profile.email}
                        disabled
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FaPhone className="me-2 text-muted" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="col-12 mb-4">
                      <label className="form-label">
                        <FaMapMarkerAlt className="me-2 text-muted" />
                        Address
                      </label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        value={profile.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                      >
                        <FaTimes className="me-1" /> Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-1" /> Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="profile-view">
                  <div className="d-flex align-items-center mb-4">
                    <div className="avatar me-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                        <FaUser size={32} />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1">{profile.fullName}</h3>
                      <span className="badge bg-success">{profile.userType}</span>
                    </div>
                  </div>
                  
                  <div className="profile-details">
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-container me-3">
                        <FaEnvelope className="text-muted" />
                      </div>
                      <div>
                        <div className="text-muted small">Email</div>
                        <div>{profile.email}</div>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-container me-3">
                        <FaPhone className="text-muted" />
                      </div>
                      <div>
                        <div className="text-muted small">Phone</div>
                        <div>{profile.phone}</div>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-start">
                      <div className="icon-container me-3">
                        <FaMapMarkerAlt className="text-muted mt-1" />
                      </div>
                      <div>
                        <div className="text-muted small">Address</div>
                        <div>{profile.address}</div>
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
  );
};

export default ProfileSection;
