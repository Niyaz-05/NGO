import React, { useState } from 'react';

const VolunteerApplication = ({ opportunity, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    motivation: '',
    availability: '',
    emergencyContact: '',
    emergencyPhone: '',
    skills: [],
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSkills = [
    'Teaching', 'Leadership', 'Communication', 'First Aid', 'Event Planning',
    'Social Media', 'Photography', 'Translation', 'Cooking', 'Driving',
    'Technical Support', 'Fundraising', 'Counseling', 'Research', 'Writing'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required for volunteering logistics';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Please describe your relevant experience';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please explain your motivation to volunteer';
    }

    if (!formData.availability.trim()) {
      newErrors.availability = 'Please specify your availability';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact name is required';
    }

    if (!formData.emergencyPhone) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate application submission
      setTimeout(() => {
        alert('Application submitted successfully! You will be contacted soon.');
        setIsSubmitting(false);
        onBack();
      }, 2000);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">Volunteer Application</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Availability *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.availability ? 'is-invalid' : ''}`}
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="e.g., Weekends, 2-4 PM"
                    required
                  />
                  {errors.availability && <div className="invalid-feedback">{errors.availability}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address *</label>
                <textarea
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Enter your full address for volunteering logistics"
                  required
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Relevant Experience *</label>
                <textarea
                  className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your relevant volunteer or work experience"
                  required
                />
                {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Motivation *</label>
                <textarea
                  className={`form-control ${errors.motivation ? 'is-invalid' : ''}`}
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Why do you want to volunteer for this opportunity?"
                  required
                />
                {errors.motivation && <div className="invalid-feedback">{errors.motivation}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Skills (Select all that apply)</label>
                <div className="row">
                  {availableSkills.map(skill => (
                    <div key={skill} className="col-md-3 col-sm-4 col-6 mb-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={skill}
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                        />
                        <label className="form-check-label" htmlFor={skill}>
                          {skill}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Emergency Contact Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.emergencyContact ? 'is-invalid' : ''}`}
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                  />
                  {errors.emergencyContact && <div className="invalid-feedback">{errors.emergencyContact}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.emergencyPhone ? 'is-invalid' : ''}`}
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    required
                  />
                  {errors.emergencyPhone && <div className="invalid-feedback">{errors.emergencyPhone}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Additional Information</label>
                <textarea
                  className="form-control"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onBack}
                >
                  <i className="bi bi-arrow-left me-2"></i>Back to Opportunities
                </button>
                <button
                  type="submit"
                  className="btn btn-success flex-grow-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Opportunity Details</h5>
          </div>
          <div className="card-body">
            <h6 className="card-title">{opportunity.title}</h6>
            <p className="text-muted small mb-3">{opportunity.description}</p>
            
            <div className="mb-3">
              <h6>Organization</h6>
              <p className="text-muted">{opportunity.ngo}</p>
            </div>

            <div className="mb-3">
              <h6>Location</h6>
              <p className="text-muted">
                <i className="bi bi-geo-alt me-1"></i>{opportunity.location}
              </p>
            </div>

            <div className="mb-3">
              <h6>Time Commitment</h6>
              <p className="text-muted">
                <i className="bi bi-clock me-1"></i>{opportunity.timeCommitment}
              </p>
            </div>

            <div className="mb-3">
              <h6>Work Type</h6>
              <p className="text-muted">
                <i className="bi bi-briefcase me-1"></i>{opportunity.workType}
              </p>
            </div>

            <div className="mb-3">
              <h6>Duration</h6>
              <p className="text-muted">
                <i className="bi bi-calendar me-1"></i>
                {new Date(opportunity.startDate).toLocaleDateString()} - {new Date(opportunity.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-3">
              <h6>Requirements</h6>
              <ul className="list-unstyled">
                {opportunity.requirements.map((req, index) => (
                  <li key={index} className="small text-muted">
                    <i className="bi bi-check-circle me-1"></i>{req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <h6>Volunteers Needed</h6>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">Progress</small>
                <small className="text-muted">{opportunity.volunteersApplied}/{opportunity.volunteersNeeded}</small>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${Math.round((opportunity.volunteersApplied / opportunity.volunteersNeeded) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerApplication;
