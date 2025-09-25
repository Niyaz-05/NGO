import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-danger text-white">
                <h4 className="mb-0">
                  <i className="bi bi-envelope me-2"></i>
                  Contact Us
                </h4>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-control"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-danger">
                    <i className="bi bi-send me-2"></i>Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Get in Touch</h5>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="text-danger fw-bold">
                    <i className="bi bi-geo-alt me-2"></i>Address
                  </h6>
                  <p className="mb-0">
                    123 NGO Connect Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
                <div className="mb-4">
                  <h6 className="text-danger fw-bold">
                    <i className="bi bi-telephone me-2"></i>Phone
                  </h6>
                  <p className="mb-0">+1 (555) 123-4567</p>
                </div>
                <div className="mb-4">
                  <h6 className="text-danger fw-bold">
                    <i className="bi bi-envelope me-2"></i>Email
                  </h6>
                  <p className="mb-0">contact@ngoconnect.com</p>
                </div>
                <div className="mb-4">
                  <h6 className="text-danger fw-bold">
                    <i className="bi bi-clock me-2"></i>Business Hours
                  </h6>
                  <p className="mb-0">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
