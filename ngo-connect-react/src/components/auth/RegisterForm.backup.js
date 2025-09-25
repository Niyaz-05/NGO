import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, ngoAPI } from '../../services/api';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaIdCard, FaArrowLeft, FaLock, FaCheckCircle, FaGlobe, FaUserTie, FaLink
} from 'react-icons/fa';

const ALL_CAUSES = [
  'Education', 'Healthcare', 'Environment', 'Women Empowerment', 
  'Child Welfare', 'Disaster Relief', 'Animals', 'Elderly', 'Arts & Culture'
];

const RegisterForm = ({ userType, title, loginLink }) => {
  const navigate = useNavigate();
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
    website: '',
    pointOfContactName: '',
    pointOfContactPhone: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    causes: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

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
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
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
    if (userType === 'ngo' && !formData.registrationId) {
      newErrors.registrationId = 'Registration ID is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
      // 1. Register the user
      const userPayload = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        registrationId: formData.registrationId,
        userType: userType.toUpperCase()
      };
      
      const { data: userData } = await authAPI.register(userPayload);
      
      // 2. If NGO, create NGO profile
      if (userType === 'ngo') {
        const ngoPayload = {
          organizationName: formData.name,
          registrationNumber: formData.registrationNumber,
          registrationId: formData.registrationId,
          description: formData.description,
          location: formData.location,
          address: formData.address,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          pointOfContactName: formData.pointOfContactName,
          pointOfContactPhone: formData.pointOfContactPhone,
          facebookUrl: formData.facebookUrl,
          instagramUrl: formData.instagramUrl,
          linkedinUrl: formData.linkedinUrl,
          causes: formData.causes
        };
        
        const { data: ngoData } = await ngoAPI.create(ngoPayload);
        
        // Update user with ngoId
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.ngoId = ngoData.id;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Redirect to dashboard
      window.location.href = loginLink;
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form fields based on user type
  const renderUserFields = () => (
    <>
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
    </>
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
              Registration ID (if any)
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
        <div className="input-group">
          <input
            type="email"
            className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={`btn ${emailVerified ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => setEmailVerified(!emailVerified)}
            disabled={!formData.email || emailVerified}
          >
            {emailVerified ? <FaCheckCircle /> : 'Verify'}
          </button>
        </div>
        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
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
        <div className="col-md-6">
          <div className="mb-4">
            <label className="form-label fw-medium">
              <FaGlobe className="me-2" />
              Website
            </label>
            <input
              type="url"
              className="form-control form-control-lg"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
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
    <div className="min-vh-100 d-flex align-items-center py-5" 
      style={{
        background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
      }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className={`${userType === 'ngo' ? 'col-lg-10' : 'col-md-8 col-lg-6'}`}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-success text-white py-4">
                <div className="d-flex align-items-center mb-2">
                  <Link to="/auth/select-login" className="text-white me-3">
                    <FaArrowLeft />
                  </Link>
                  <h1 className="h4 mb-0">{title}</h1>
                </div>
                <p className="mb-0 small opacity-75">
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
                      required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className={`btn ${emailVerified ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setEmailVerified(!emailVerified)}
                        disabled={!formData.email || emailVerified}
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <FaMapMarkerAlt className="me-2" />
                      Address (Optional)
                    </label>
                    <textarea
                      className="form-control form-control-lg"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                    />
                  </div>

                  {/* Registration ID (NGO only) */}
                  {userType === 'ngo' && (
                    <div className="mb-4">
                      <label className="form-label fw-medium">
                        <FaIdCard className="me-2" />
                        Registration ID
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.registrationId ? 'is-invalid' : ''}`}
                        name="registrationId"
                        value={formData.registrationId}
                        onChange={handleChange}
                        required
                      />
                      {errors.registrationId && (
                        <div className="invalid-feedback">{errors.registrationId}</div>
                      )}
                    </div>
                  )}

                  {/* Password Fields */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <FaLock className="me-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium">
                      <FaLock className="me-2" />
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="mb-2">
                      Already have an account?{' '}
                      <Link to={loginLink} className="text-success fw-medium">
                        Sign in
                      </Link>
                    </p>
                    <Link 
                      to="/auth/select-login" 
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Back to Role Selection
                    </Link>
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

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
