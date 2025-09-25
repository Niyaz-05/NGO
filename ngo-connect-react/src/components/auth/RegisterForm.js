import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, ngoAPI } from '../../services/api';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaIdCard, FaLock, FaUserTie, FaLink
} from 'react-icons/fa';

const ALL_CAUSES = [
  'Education', 'Healthcare', 'Environment', 'Women Empowerment', 
  'Child Welfare', 'Disaster Relief', 'Animals', 'Elderly', 'Arts & Culture'
];

const RegisterForm = ({ userType, title, loginLink }) => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '', 
    address: '', 
    registrationId: '',
    registrationNumber: '',
    description: '',
    location: '',
    pointOfContactName: '',
    pointOfContactPhone: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    causes: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (userType === 'ngo') {
      if (!formData.registrationId) {
        newErrors.registrationId = 'Registration ID is required';
      }
      if (!formData.registrationNumber) {
        newErrors.registrationNumber = 'Registration number is required';
      }
      if (formData.causes.length === 0) {
        newErrors.causes = 'Please select at least one cause';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    // If called as an event handler
    if (name && name.target) {
      const { name: fieldName, value: fieldValue } = name.target;
      setFormData(prev => ({
        ...prev,
        [fieldName]: fieldValue
      }));
      
      // Clear error when user types
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: null
        }));
      }
    } else {
      // Direct value set (used for website field)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user types
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };

  const toggleCause = (cause) => {
    setFormData(prev => {
      const causes = prev.causes.includes(cause)
        ? prev.causes.filter(c => c !== cause)
        : [...prev.causes, cause];
      return { ...prev, causes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // 1. Prepare user registration payload
      // Map frontend user type to backend expected format
      const userTypeMap = {
        'user': 'USER',  // Map 'user' to 'USER' role
        'ngo': 'NGO',
        'donor': 'DONOR',
        'volunteer': 'VOLUNTEER',
        'admin': 'ADMIN'
      };
      
      const userPayload = {
        fullName: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.replace(/\D/g, ''), // Remove non-numeric characters
        address: formData.address.trim(),
        userType: userTypeMap[userType.toLowerCase()] || 'DONOR'  // Default to DONOR if type not found
      };
      
      console.log('Registering user with payload:', userPayload);
      
      // 2. Register the user
      const response = await authAPI.register(userPayload);
      const userData = response.data;
      
      // We're not storing user data in localStorage anymore
      // The token is managed by the API service automatically
      
      // 3. If NGO, create NGO profile
      if (userType === 'ngo') {
        
        // Clean and format NGO data - ensure all fields have default empty strings instead of null/undefined
        const ngoPayload = {
          organizationName: formData.name.trim(),
          registrationNumber: formData.registrationNumber ? formData.registrationNumber.trim() : '',
          registrationId: formData.registrationId ? formData.registrationId.trim() : '',
          description: formData.description ? formData.description.trim() : '',
          location: formData.location ? formData.location.trim() : '',
          address: formData.address ? formData.address.trim() : '',
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.replace(/\D/g, ''), // Remove non-numeric characters
          website: '', // Add empty string for website field
          pointOfContactName: formData.pointOfContactName ? formData.pointOfContactName.trim() : '',
          pointOfContactPhone: formData.pointOfContactPhone ? formData.pointOfContactPhone.replace(/\D/g, '') : '',
          facebookUrl: formData.facebookUrl ? formData.facebookUrl.trim() : '',
          instagramUrl: formData.instagramUrl ? formData.instagramUrl.trim() : '',
          linkedinUrl: formData.linkedinUrl ? formData.linkedinUrl.trim() : '',
          causes: Array.isArray(formData.causes) ? formData.causes : [],
          userId: userData.userId
        };
        
        console.log('Creating NGO profile with payload:', ngoPayload);
        
        // 4. Create NGO profile - we don't need the response data
        await ngoAPI.create(ngoPayload);
        
        // The backend handles the NGO-user association
        // No need to store ngoId in localStorage
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = loginLink;
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      alert(error.response?.data?.error || error.message || 'Registration failed. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form fields based on user type
  const renderUserFields = () => (
    <div className="mb-4">
      <label className="form-label fw-medium">
        <FaUser className="me-2" />
        Full Name
      </label>
      <input
        type="text"
        className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
    </div>
  );

  const renderNGOFields = () => (
    <>
      <div className="mb-4">
        <label className="form-label fw-medium">
          <FaUser className="me-2" />
          Organization Name *
        </label>
        <input
          type="text"
          className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label fw-medium">
              <FaIdCard className="me-2" />
              Registration Number *
            </label>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.registrationNumber ? 'is-invalid' : ''}`}
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
            {errors.registrationNumber && <div className="invalid-feedback">{errors.registrationNumber}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label fw-medium">
              <FaIdCard className="me-2" />
              Registration ID
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="registrationId"
              value={formData.registrationId}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label fw-medium">
          <FaEnvelope className="me-2" />
          Organization Description
        </label>
        <textarea
          className="form-control form-control-lg"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
    </>
  );

  const renderCommonFields = () => (
    <>
      <div className="mb-4">
        <label className="form-label fw-medium">
          <FaEnvelope className="me-2" />
          Email Address *
        </label>
        <input
          type="email"
          className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label fw-medium">
              <FaPhone className="me-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label fw-medium">
          <FaMapMarkerAlt className="me-2" />
          Address *
        </label>
        <input
          type="text"
          className={`form-control form-control-lg ${errors.address ? 'is-invalid' : ''}`}
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
      </div>

      {userType === 'ngo' && (
        <div className="mb-4">
          <label className="form-label fw-medium">
            <FaMapMarkerAlt className="me-2" />
            City/Location *
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      )}

      {userType === 'ngo' && (
        <div className="mb-4">
          <label className="form-label fw-medium d-block mb-2">
            Causes/Areas of Work *
          </label>
          <div className="d-flex flex-wrap gap-2">
            {ALL_CAUSES.map(cause => (
              <button
                type="button"
                key={cause}
                className={`btn btn-sm ${
                  formData.causes.includes(cause) ? 'btn-success' : 'btn-outline-secondary'
                }`}
                onClick={() => toggleCause(cause)}
              >
                {cause}
              </button>
            ))}
          </div>
          {errors.causes && <div className="text-danger small mt-2">{errors.causes}</div>}
        </div>
      )}

      {userType === 'ngo' && (
        <>
          <h5 className="mt-4 mb-3">Point of Contact</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label fw-medium">
                  <FaUserTie className="me-2" />
                  Contact Person Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="pointOfContactName"
                  value={formData.pointOfContactName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label className="form-label fw-medium">
                  <FaPhone className="me-2" />
                  Contact Person Phone
                </label>
                <input
                  type="tel"
                  className="form-control form-control-lg"
                  name="pointOfContactPhone"
                  value={formData.pointOfContactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mb-4">
        <label className="form-label fw-medium">
          <FaLock className="me-2" />
          Password *
        </label>
        <input
          type="password"
          className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>

      <div className="mb-4">
        <label className="form-label fw-medium">
          <FaLock className="me-2" />
          Confirm Password *
        </label>
        <input
          type="password"
          className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
      </div>

      {userType === 'ngo' && (
        <div className="mb-4">
          <label className="form-label fw-medium d-block mb-2">
            <FaLink className="me-2" />
            Social Media Links (Optional)
          </label>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fab fa-facebook text-primary"></i>
                </span>
                <input
                  type="url"
                  className="form-control"
                  placeholder="Facebook"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fab fa-instagram text-danger"></i>
                </span>
                <input
                  type="url"
                  className="form-control"
                  placeholder="Instagram"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fab fa-linkedin text-primary"></i>
                </span>
                <input
                  type="url"
                  className="form-control"
                  placeholder="LinkedIn"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div 
      className="min-vh-100 d-flex align-items-center py-5"
      style={{
        background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
      }}
    >
      <div className="container">
      <div className="row justify-content-center">
        <div className={`${userType === 'ngo' ? 'col-lg-10' : 'col-md-8 col-lg-6'}`}>
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-success text-white py-4">
              <h1 className="h4 mb-0 text-center">{title}</h1>
              <p className="mb-0 small opacity-75 text-center">
                {userType === 'ngo' 
                  ? 'Register your NGO and start making an impact' 
                  : 'Join our community and make a difference'}
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    {userType === 'ngo' ? renderNGOFields() : renderUserFields()}
                    {renderCommonFields()}
                    
                    <div className="d-grid gap-2 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-success btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registering...
                          </>
                        ) : (
                          'Register Now'
                        )}
                      </button>
                      
                      <div className="text-center mt-3">
                        Already have an account?{' '}
                        <Link to={loginLink} className="text-success fw-medium">
                          Login here
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegisterForm;
