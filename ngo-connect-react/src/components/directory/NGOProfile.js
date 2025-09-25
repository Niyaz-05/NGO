import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ngoAPI } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';

const NGOProfile = () => {
  const [loading, setLoading] = useState(true);
  const [ngoData, setNgoData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNGOData = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Try to fetch NGO data by logged-in user's organization name
        const response = await ngoAPI.getByOrganizationName(user.organizationName || user.name);
        console.log('API Response:', response);
        
        if (response && response.data) {
          setNgoData({
            name: response.data.organizationName,
            image: response.data.imageUrl || "https://www.planindia.org/wp-content/uploads/2019/08/young-helath.jpg",
            description: response.data.description || 'No description available',
            location: response.data.location || 'Not specified',
            established: response.data.establishedYear || 'Not specified',
            focus: response.data.causes || ['Not specified'],
            contact: {
              email: response.data.email,
              phone: response.data.phone || 'Not specified',
              address: response.data.address || 'Not specified',
              website: response.data.website || 'Not specified',
              contactPerson: response.data.pointOfContactName || 'Not specified',
              contactPhone: response.data.pointOfContactPhone || 'Not specified'
            },
            socialMedia: {
              facebook: response.data.facebookUrl,
              instagram: response.data.instagramUrl,
              linkedin: response.data.linkedinUrl
            },
            // These would come from your backend if available
            achievements: response.data.achievements || [
              "No achievements listed yet"
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching NGO data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading NGO profile...</p>
      </div>
    );
  }

  if (!ngoData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>No NGO Profile Found</h4>
          <p>You haven't set up your NGO profile yet. Please register your NGO to get started.</p>
          <Link to="/register-ngo" className="btn btn-success">
            Register Your NGO
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Your NGO Profile</h1>
        <Link to="/edit-ngo-profile" className="btn btn-success">
          <i className="bi bi-pencil me-2"></i>Edit Profile
        </Link>
      </div>
      
      <>
        <div className="card shadow-sm mb-4">
        <div className="row g-0">
          <div className="col-md-4">
            <img 
              src={ngoData.image} 
              alt={ngoData.name}
              className="img-fluid rounded-start"
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h2 className="card-title">{ngoData.name}</h2>
              <p className="card-text lead">{ngoData.description}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5 className="text-success">Organization Details</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-geo-alt-fill text-success me-2"></i>
                      <strong>Location:</strong> {ngoData.location}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-calendar-check-fill text-success me-2"></i>
                      <strong>Established:</strong> {ngoData.established}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-award-fill text-success me-2"></i>
                      <strong>Focus Areas:</strong>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {Array.isArray(ngoData.focus) ? ngoData.focus.map((area, index) => (
                          <span key={index} className="badge bg-success bg-opacity-10 text-success">
                            {area}
                          </span>
                        )) : (
                          <span className="text-muted">Not specified</span>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
                  
                  <div className="col-md-6">
                    <h5 className="text-success">Contact Information</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-envelope-fill text-success me-2"></i>
                        <strong>Email:</strong> <a href={`mailto:${ngoData.contact.email}`} className="text-decoration-none">
                          {ngoData.contact.email}
                        </a>
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-telephone-fill text-success me-2"></i>
                        <strong>Phone:</strong> <a href={`tel:${ngoData.contact.phone}`} className="text-decoration-none">
                          {ngoData.contact.phone}
                        </a>
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-geo-alt-fill text-success me-2"></i>
                        <strong>Address:</strong> {ngoData.contact.address}
                      </li>
                      {ngoData.contact.website !== 'Not specified' && (
                        <li className="mb-2">
                          <i className="bi bi-globe text-success me-2"></i>
                          <strong>Website:</strong> <a href={ngoData.contact.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            {ngoData.contact.website}
                          </a>
                        </li>
                      )}
                    </ul>
                    
                    <div className="mt-4">
                      <h5 className="text-success">Social Media</h5>
                      <div className="d-flex gap-3">
                        {ngoData.socialMedia?.facebook && (
                          <a href={ngoData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <i className="bi bi-facebook fs-4 text-primary"></i>
                          </a>
                        )}
                        {ngoData.socialMedia?.instagram && (
                          <a href={ngoData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <i className="bi bi-instagram fs-4 text-danger"></i>
                          </a>
                        )}
                        {ngoData.socialMedia?.linkedin && (
                          <a href={ngoData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <i className="bi bi-linkedin fs-4 text-primary"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title text-success">Achievements</h5>
            <ul className="list-group list-group-flush">
              {ngoData.achievements.map((achievement, index) => (
                <li key={index} className="list-group-item d-flex">
                  <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="d-flex gap-2 mb-4">
          <Link to="/campaigns/campaign-detail" className="btn btn-primary">
            <i className="bi bi-megaphone me-2"></i>View Campaigns
          </Link>
          <Link to="/events/volunteer-events" className="btn btn-success">
            <i className="bi bi-people me-2"></i>Volunteer Opportunities
          </Link>
          <Link to="/directory/ngo-directory" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>Back to Directory
          </Link>
        </div>
      </>
    </div>
  );
};

export default NGOProfile;
