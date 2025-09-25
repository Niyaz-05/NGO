import React, { useState, useEffect } from 'react';
import { ngoAPI } from '../../services/api';
import { FaSave, FaTimes, FaCalendarAlt, FaUserFriends, FaMapMarkerAlt, FaTasks } from 'react-icons/fa';

const VolunteerRequirementForm = ({ ngoId, onSuccess, onCancel, initialData = {} }) => {
  // Helper function to format date to YYYY-MM-DD format for date inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Ensure we have a valid date
    if (isNaN(date.getTime())) return '';
    // Format as YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    skillsRequired: Array.isArray(initialData.skillsRequired) 
      ? initialData.skillsRequired.join(', ') 
      : initialData.skillsRequired || '',
    volunteersNeeded: initialData.volunteersNeeded || 1,
    workType: initialData.workType || 'ON_SITE',
    location: initialData.location || '',
    cause: initialData.cause || 'EDUCATION', // Default to EDUCATION or get from NGO profile
    timeCommitment: initialData.timeCommitment || 'FLEXIBLE', // Default value
    durationType: initialData.durationType || 'ONE_TIME',
    startDate: formatDateForInput(initialData.startDate) || '',
    endDate: formatDateForInput(initialData.endDate) || '',
    isActive: initialData.isActive !== undefined ? initialData.isActive : true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const WORK_TYPES = [
    { value: 'ON_SITE', label: 'On-site' },
    { value: 'REMOTE', label: 'Remote' },
    { value: 'HYBRID', label: 'Hybrid' }
  ];

  const DURATION_TYPES = [
    { value: 'ONE_TIME', label: 'One-time' },
    { value: 'SHORT_TERM', label: 'Short-term' },
    { value: 'LONG_TERM', label: 'Long-term' }
  ];

  const CAUSE_TYPES = [
    'EDUCATION', 'HEALTH', 'ENVIRONMENT', 'ANIMAL_WELFARE', 'HUMAN_RIGHTS',
    'WOMEN_EMPOWERMENT', 'CHILD_WELFARE', 'ELDERLY_CARE', 'DISABILITY', 'COMMUNITY_DEVELOPMENT',
    'RURAL_DEVELOPMENT', 'DISASTER_RELIEF', 'ENVIRONMENT_CONSERVATION', 'WILDLIFE_CONSERVATION',
    'WATER_SANITATION', 'AGRICULTURE', 'LIVELIHOOD', 'ARTS_CULTURE', 'SPORTS', 'OTHER'
  ];

  const TIME_COMMITMENT_TYPES = [
    'FLEXIBLE', 'PART_TIME', 'FULL_TIME', 'WEEKENDS', 'WEEKDAYS', 'MORNINGS', 'AFTERNOONS', 'EVENINGS'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.skillsRequired.trim()) newErrors.skillsRequired = 'Skills required is required';
    if (!formData.volunteersNeeded || formData.volunteersNeeded < 1) 
      newErrors.volunteersNeeded = 'Number of volunteers must be at least 1';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.cause) newErrors.cause = 'Cause is required';
    if (!formData.timeCommitment) newErrors.timeCommitment = 'Time commitment is required';
    if (!formData.startDate)
      newErrors.startDate = 'Start date is required';
    if (formData.durationType !== 'ONE_TIME' && !formData.endDate)
      newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate))
      newErrors.endDate = 'End date must be after start date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for date fields to ensure proper formatting
    let processedValue = value;
    if ((name === 'startDate' || name === 'endDate') && value) {
      // Ensure the date is in the correct format
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        processedValue = date.toISOString().split('T')[0];
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'volunteersNeeded' ? parseInt(value) || 0 : processedValue
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // If start date changes and is after end date, update end date to match
    if (name === 'startDate' && formData.endDate && new Date(value) > new Date(formData.endDate)) {
      setFormData(prev => ({
        ...prev,
        endDate: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user?.id) {
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/select-login';
      return;
    }

    setIsSubmitting(true);
    try {
      // Format dates to ISO string without timezone offset
      const formatDateForAPI = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        // Set to local date at midnight to avoid timezone issues
        date.setHours(0, 0, 0, 0);
        // Convert to ISO string and remove the timezone offset
        return date.toISOString().split('.')[0] + 'Z';
      };

      // Prepare the payload with proper date formatting
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.skillsRequired.split(',').map(skill => skill.trim()).filter(Boolean),
        volunteersNeeded: parseInt(formData.volunteersNeeded, 10),
        workType: formData.workType,
        location: formData.location,
        cause: formData.cause,
        timeCommitment: formData.timeCommitment,
        durationType: formData.durationType,
        isActive: formData.isActive,
        // Format dates properly for the API
        startDate: formatDateForAPI(formData.startDate),
        endDate: formData.durationType === 'ONE_TIME' 
          ? formatDateForAPI(formData.startDate)
          : formatDateForAPI(formData.endDate)
      };

      console.log('Submitting payload:', payload);

      let response;
      if (initialData.id) {
        // Update existing opportunity
        response = await ngoAPI.updateOpportunity(ngoId, initialData.id, payload);
      } else {
        // Create new opportunity
        response = await ngoAPI.createOpportunity(ngoId, payload);
      }
      
      console.log('API Response:', response);
      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 3000);
    } catch (error) {
      console.error('Error saving volunteer requirement:', error);
      
      // Handle network errors
      if (error.code === 'ERR_NETWORK') {
        alert('Network Error: Could not connect to the server. Please check your internet connection and ensure the backend server is running.');
        console.error('Network error details:', {
          code: error.code,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
          }
        });
        return;
      }
      
      // Handle HTTP errors
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      const status = error.response?.status;
      
      console.error('Error details:', {
        status,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
        responseData: error.response?.data,
        message: errorMessage
      });
      
      if (status === 401) {
        // Token is expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Your session has expired. Please log in again.');
        window.location.href = '/auth/select-login';
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        alert('You do not have permission to perform this action.');
      } else if (status === 400) {
        // Bad request - show validation errors
        alert(`Invalid data: ${errorMessage}`);
      } else {
        // Other errors
        alert(`Failed to save volunteer requirement: ${errorMessage || 'Please try again later.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="position-relative">
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3" style={{ zIndex: 9999 }}>
          <i className="bi bi-check-circle-fill me-2"></i>
          Requirements posted successfully!
          <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
        </div>
      )}
      <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          {initialData.id ? 'Edit Volunteer Requirement' : 'Post New Volunteer Requirement'}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">
              Title of Requirement *
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Web Developer Volunteer"
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">
              Description of Role *
            </label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and impact"
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                <FaUserFriends className="me-2" />
                Number of Volunteers Needed *
              </label>
              <input
                type="number"
                min="1"
                className={`form-control ${errors.volunteersNeeded ? 'is-invalid' : ''}`}
                name="volunteersNeeded"
                value={formData.volunteersNeeded}
                onChange={handleChange}
              />
              {errors.volunteersNeeded && <div className="invalid-feedback">{errors.volunteersNeeded}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                <FaTasks className="me-2" />
                Type of Work *
              </label>
              <select
                className="form-select"
                name="workType"
                value={formData.workType}
                onChange={handleChange}
              >
                {WORK_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-heart me-2"></i>
                Cause *
              </label>
              <select
                className={`form-select ${errors.cause ? 'is-invalid' : ''}`}
                name="cause"
                value={formData.cause}
                onChange={handleChange}
              >
                <option value="">Select a cause</option>
                {CAUSE_TYPES.map(cause => (
                  <option key={cause} value={cause}>
                    {cause.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                  </option>
                ))}
              </select>
              {errors.cause && <div className="invalid-feedback">{errors.cause}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-clock me-2"></i>
                Time Commitment *
              </label>
              <select
                className={`form-select ${errors.timeCommitment ? 'is-invalid' : ''}`}
                name="timeCommitment"
                value={formData.timeCommitment}
                onChange={handleChange}
              >
                <option value="">Select time commitment</option>
                {TIME_COMMITMENT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                  </option>
                ))}
              </select>
              {errors.timeCommitment && <div className="invalid-feedback">{errors.timeCommitment}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                <FaMapMarkerAlt className="me-2" />
                Location *
              </label>
              <input
                type="text"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY or Remote"
              />
              {errors.location && <div className="invalid-feedback">{errors.location}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                <FaCalendarAlt className="me-2" />
                Duration *
              </label>
              <select
                className="form-select"
                name="durationType"
                value={formData.durationType}
                onChange={handleChange}
              >
                {DURATION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                Start Date *
              </label>
              <div className="position-relative">
                <input
                  type="date"
                  className={`form-control ${errors.startDate ? 'is-invalid' : ''} pe-4`}
                  name="startDate"
                  min={today}
                  value={formData.startDate || ''}
                  onChange={handleChange}
                  onFocus={(e) => {
                    if (!formData.startDate) {
                      handleChange({
                        target: { name: 'startDate', value: today }
                      });
                    }
                  }}
                  style={{ appearance: 'none', paddingRight: '2rem' }}
                />
              </div>
              {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-medium">
                End Date {formData.durationType !== 'ONE_TIME' && '*'}
              </label>
              <div className="position-relative">
                <input
                  type="date"
                  className={`form-control ${errors.endDate ? 'is-invalid' : ''} pe-4`}
                  name="endDate"
                  min={formData.startDate || today}
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  onFocus={(e) => {
                    if (!formData.endDate) {
                      const defaultDate = formData.startDate || today;
                      handleChange({
                        target: { name: 'endDate', value: defaultDate }
                      });
                    }
                  }}
                  style={{ appearance: 'none', paddingRight: '2rem' }}
                />
              </div>
              {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">
              Skills Required * <span className="text-muted">(comma separated)</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.skillsRequired ? 'is-invalid' : ''}`}
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="e.g., Web Development, Graphic Design, Social Media"
            />
            {errors.skillsRequired && <div className="invalid-feedback">{errors.skillsRequired}</div>}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <FaTimes className="me-1" /> Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="me-1" />
                  {initialData.id ? 'Update' : 'Post'} Requirement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default VolunteerRequirementForm;
