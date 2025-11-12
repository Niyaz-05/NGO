import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { ngoAPI } from '../../services/api';

const ProfileTab = ({ profile, user, onUpdate, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.id) {
      alert('Cannot update NGO: Missing NGO ID. Please refresh the page or contact support.');
      return;
    }
    setSaving(true);
    try {
      // Prepare the update data with all required fields
      const updateData = {
        // Required fields
        organizationName: formData.name || 'NGO Name',
        description: formData.description || 'No description provided',
        cause: formData.causes?.[0] || 'General',
        location: formData.location || 'Unknown',
        
        // Basic Info
        email: formData.email || '',
        phone: formData.phone ? formData.phone.replace(/\D/g, '') : '',
        address: formData.address || '',
        
        // Registration Details
        registrationNumber: formData.registrationNumber || '',
        registrationId: formData.registrationId || '',
        
        // Organization Details
        website: formData.website || '',
        
        // Point of Contact
        pointOfContactName: formData.pointOfContactName || '',
        pointOfContactPhone: formData.pointOfContactPhone ? 
          formData.pointOfContactPhone.replace(/\D/g, '') : '',
        
        // Social Media
        facebookUrl: formData.facebookUrl || '',
        instagramUrl: formData.instagramUrl || '',
        linkedinUrl: formData.linkedinUrl || '',
        
        // Causes - ensure at least one cause is present
        causes: formData.causes && formData.causes.length > 0 ? 
          formData.causes : ['General']
      };
      
      console.log('Sending update data:', JSON.stringify(updateData, null, 2));
      
      // Call the update API using the NGO's ID from the profile
      const response = await ngoAPI.update(profile.id, updateData);
      
      if (response && response.data) {
        // Update the parent component's state
        onUpdate({
          ...updateData,
          id: response.data.id || profile.id
        });
        
        // Update form data with the latest values
        setFormData(prev => ({
          ...prev,
          ...updateData
        }));
        
        setIsEditing(false);
      } else {
        throw new Error('No data returned from server');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Show error message to the user
      alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  // Define available causes for the causes selector
  const availableCauses = [
    'Education', 'Healthcare', 'Environment', 'Women Empowerment', 
    'Child Welfare', 'Disaster Relief', 'Animals', 'Elderly', 'Arts & Culture'
  ];

  // Toggle cause selection
  const toggleCause = (cause) => {
    const newCauses = formData.causes && formData.causes.includes(cause)
      ? formData.causes.filter(c => c !== cause)
      : [...(formData.causes || []), cause];
    
    setFormData(prev => ({
      ...prev,
      causes: newCauses
    }));
  };

  return (
    <div className="d-flex justify-content-center p-3">
      <Card className="w-100 shadow-sm" style={{ maxWidth: '800px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Organization Profile</h4>
            {!isEditing ? (
              <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                <FaEdit className="me-2" /> Edit Profile
              </Button>
            ) : (
              <Button variant="outline-secondary" onClick={() => setIsEditing(false)}>
                Cancel Editing
              </Button>
            )}
          </div>

          {isEditing ? (
            <Form onSubmit={handleSubmit} className="p-3 bg-light rounded">
              <h5 className="mb-4 pb-2 border-bottom">Basic Information</h5>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Organization Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Phone *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <h5 className="mt-5 mb-3 pb-2 border-bottom">Registration Details</h5>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Registration Number *</Form.Label>
                    <Form.Control
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber || ''}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Registration ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="registrationId"
                      value={formData.registrationId || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <h5 className="mt-5 mb-3 pb-2 border-bottom">Point of Contact</h5>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="pointOfContactName"
                      value={formData.pointOfContactName || ''}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Phone *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="pointOfContactPhone"
                      value={formData.pointOfContactPhone || ''}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <h5 className="mt-5 mb-3 pb-2 border-bottom">Social Media</h5>
              <div className="row">
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Facebook URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="facebookUrl"
                      value={formData.facebookUrl || ''}
                      onChange={handleChange}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Instagram URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="instagramUrl"
                      value={formData.instagramUrl || ''}
                      onChange={handleChange}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl || ''}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </Form.Group>
                </div>
              </div>

              <h5 className="mt-5 mb-3 pb-2 border-bottom">Causes You Support *</h5>
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2">
                  {availableCauses.map((cause) => (
                    <Button
                      key={cause}
                      variant={formData.causes?.includes(cause) ? 'primary' : 'outline-secondary'}
                      onClick={() => toggleCause(cause)}
                      type="button"
                      size="sm"
                      className="mb-2"
                    >
                      {cause}
                    </Button>
                  ))}
                </div>
                {(!formData.causes || formData.causes.length === 0) && (
                  <div className="text-danger small">Please select at least one cause</div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setIsEditing(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={saving || !formData.causes || formData.causes.length === 0}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </Form>
          ) : (
            <div className="row">
              <div className="col-12">
                <h5 className="mb-3 pb-2 border-bottom">Organization Information</h5>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th style={{ width: '200px' }}>Organization Name</th>
                      <td>{profile.name || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{profile.email || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{profile.phone || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{profile.address || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>{profile.description || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Website</th>
                      <td>
                        {profile.website ? (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer">
                            {profile.website}
                          </a>
                        ) : 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <th>Registration Number</th>
                      <td>{profile.registrationNumber || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Registration ID</th>
                      <td>{profile.registrationId || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Contact Person</th>
                      <td>{profile.pointOfContactName || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Contact Phone</th>
                      <td>{profile.pointOfContactPhone || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Social Media</th>
                      <td>
                        {profile.facebookUrl || profile.instagramUrl || profile.linkedinUrl ? (
                          <div className="d-flex flex-column">
                            {profile.facebookUrl && (
                              <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="mb-1">
                                {profile.facebookUrl}
                              </a>
                            )}
                            {profile.instagramUrl && (
                              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="mb-1">
                                {profile.instagramUrl}
                              </a>
                            )}
                            {profile.linkedinUrl && (
                              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                {profile.linkedinUrl}
                              </a>
                            )}
                          </div>
                        ) : 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <th>Causes</th>
                      <td>
                        {profile.causes && profile.causes.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {profile.causes.map((cause, index) => (
                              <span key={index} className="badge bg-primary me-1">
                                {cause}
                              </span>
                            ))}
                          </div>
                        ) : 'Not specified'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileTab;
