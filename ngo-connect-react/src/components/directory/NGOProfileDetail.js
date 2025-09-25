import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const NGOProfileDetail = () => {
  const { id } = useParams();
  const [ngo, setNGO] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockNGO = {
      id: parseInt(id),
      name: "Green Earth Foundation",
      description: "Since 2004, Green Earth Foundation has been working in several states of India to help children get a happy childhood and a bright future. We work in close coordination with government agencies at various levels - National, State, and District - to run child welfare projects.",
      cause: "Environment",
      location: "New York, USA",
      website: "https://greenearth.org",
      phone: "+1-555-0123",
      email: "info@greenearth.org",
      registrationNumber: "NGO-2004-001",
      foundedYear: 2004,
      totalDonations: 125000,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=400&fit=crop",
      urgency: "High",
      isVerified: true,
      mission: "To create a sustainable future by protecting the environment and empowering communities through education and action.",
      vision: "A world where every child grows up in a clean, healthy environment with access to quality education and opportunities.",
      projects: [
        {
          id: 1,
          name: "Tree Plantation Drive",
          description: "Planting 10,000 trees across urban areas to combat air pollution",
          status: "Active",
          progress: 75
        },
        {
          id: 2,
          name: "Environmental Education Program",
          description: "Teaching children about environmental conservation and sustainability",
          status: "Active",
          progress: 60
        },
        {
          id: 3,
          name: "Clean Water Initiative",
          description: "Providing clean drinking water to rural communities",
          status: "Completed",
          progress: 100
        }
      ],
      testimonials: [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Donor",
          message: "Amazing work! The transparency and impact of this NGO is incredible.",
          rating: 5
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "Volunteer",
          message: "Great experience volunteering with them. Very organized and impactful.",
          rating: 5
        }
      ],
      transparency: {
        totalFunds: 125000,
        totalUtilized: 122500,
        utilization: [
          { category: "Education Programs", amount: 50000, percentage: 40 },
          { category: "Environmental Projects", amount: 37500, percentage: 30 },
          { category: "Administrative Costs", amount: 12500, percentage: 10 },
          { category: "Community Outreach", amount: 25000, percentage: 20 }
        ],
        remainingBalance: 2500,
        utilizationRate: 98,
        lastUpdated: "2024-01-15",
        auditTrail: [
          { date: "2024-01-15", action: "Monthly report published", amount: 0 },
          { date: "2024-01-10", action: "Education program funding", amount: 5000 },
          { date: "2024-01-05", action: "Environmental project allocation", amount: 3000 }
        ]
      }
    };

    setTimeout(() => {
      setNGO(mockNGO);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="text-center py-5">
        <h4>NGO not found</h4>
        <Link to="/donate" className="btn btn-danger">Back to Donations</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="bg-danger text-white">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center py-3">
              <div className="d-flex align-items-center">
                <Link to="/donate" className="btn btn-outline-light me-3">
                  <i className="bi bi-arrow-left"></i>
                </Link>
                <div>
                  <h4 className="mb-0">{ngo.name}</h4>
                  <small>Verified NGO • {ngo.cause}</small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-light">
                  <i className="bi bi-share me-2"></i>Share
                </button>
                <button className="btn btn-light">
                  <i className="bi bi-heart me-2"></i>Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-4">
          {/* NGO Header */}
          <div className="row mb-4">
            <div className="col-md-4">
              <img
                src={ngo.image}
                alt={ngo.name}
                className="img-fluid rounded shadow"
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
            </div>
            <div className="col-md-8">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="text-danger fw-bold mb-2">{ngo.name}</h2>
                  <p className="text-muted mb-3">{ngo.description}</p>
                </div>
                <div className="text-end">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    <span className="fw-bold">{ngo.rating}</span>
                    <span className="text-muted ms-1">(127 reviews)</span>
                  </div>
                  <span className={`badge bg-${ngo.urgency === 'High' ? 'danger' : ngo.urgency === 'Medium' ? 'warning' : 'success'} fs-6`}>
                    {ngo.urgency} Priority
                  </span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo-alt text-danger me-2"></i>
                    <span>{ngo.location}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-calendar text-danger me-2"></i>
                    <span>Founded {ngo.foundedYear}</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-globe text-danger me-2"></i>
                    <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      {ngo.website}
                    </a>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-telephone text-danger me-2"></i>
                    <span>{ngo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-house me-2"></i>Overview
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <i className="bi bi-folder me-2"></i>Projects
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'transparency' ? 'active' : ''}`}
                onClick={() => setActiveTab('transparency')}
              >
                <i className="bi bi-graph-up me-2"></i>Transparency
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'testimonials' ? 'active' : ''}`}
                onClick={() => setActiveTab('testimonials')}
              >
                <i className="bi bi-chat-quote me-2"></i>Testimonials
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                <i className="bi bi-envelope me-2"></i>Contact
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="row">
                <div className="col-md-8">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="mb-0">About {ngo.name}</h5>
                    </div>
                    <div className="card-body">
                      <h6 className="text-danger fw-bold">Mission</h6>
                      <p className="mb-3">{ngo.mission}</p>
                      
                      <h6 className="text-danger fw-bold">Vision</h6>
                      <p className="mb-3">{ngo.vision}</p>
                      
                      <h6 className="text-danger fw-bold">Impact</h6>
                      <div className="row text-center">
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-danger fw-bold">10,000+</h4>
                            <small className="text-muted">Trees Planted</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-danger fw-bold">5,000+</h4>
                            <small className="text-muted">Children Educated</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-danger fw-bold">50+</h4>
                            <small className="text-muted">Communities Served</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-danger fw-bold">20+</h4>
                            <small className="text-muted">Years of Service</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Quick Stats</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Donations:</span>
                        <span className="fw-bold text-success">${ngo.totalDonations.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Rating:</span>
                        <span className="fw-bold">
                          <i className="bi bi-star-fill text-warning me-1"></i>{ngo.rating}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Status:</span>
                        <span className="badge bg-success">Verified</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Registration:</span>
                        <span className="text-muted">{ngo.registrationNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="row">
                {ngo.projects.map(project => (
                  <div key={project.id} className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title text-danger">{project.name}</h5>
                        <p className="card-text">{project.description}</p>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Progress</small>
                            <small className="text-muted">{project.progress}%</small>
                          </div>
                          <div className="progress">
                            <div 
                              className={`progress-bar ${project.status === 'Completed' ? 'bg-success' : 'bg-danger'}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className={`badge ${project.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'transparency' && (
              <div>
                {/* Public Transparency Header */}
                <div className="card mb-4">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-shield-check me-2"></i>Transparency & Accountability Report
                    </h5>
                    <small>Last updated: {ngo.transparency.lastUpdated} • Verified by NGO Connect</small>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-4">
                      This NGO provides complete transparency in fund utilization. All financial data is verified and audited regularly to ensure accountability and build trust with donors.
                    </p>
                    
                    <div className="row mb-4">
                      <div className="col-md-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h3 className="text-danger fw-bold">${ngo.transparency.totalFunds.toLocaleString()}</h3>
                          <p className="mb-0 fw-bold">Total Funds Received</p>
                          <small className="text-muted">From all donors</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h3 className="text-success fw-bold">${ngo.transparency.totalUtilized.toLocaleString()}</h3>
                          <p className="mb-0 fw-bold">Total Funds Utilized</p>
                          <small className="text-muted">For programs & activities</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h3 className="text-info fw-bold">${ngo.transparency.remainingBalance.toLocaleString()}</h3>
                          <p className="mb-0 fw-bold">Remaining Balance</p>
                          <small className="text-muted">Available for future use</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center p-3 bg-light rounded">
                          <h3 className="text-warning fw-bold">{ngo.transparency.utilizationRate}%</h3>
                          <p className="mb-0 fw-bold">Utilization Rate</p>
                          <small className="text-muted">Efficiency metric</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fund Utilization Breakdown */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-pie-chart me-2"></i>Detailed Fund Allocation Breakdown
                    </h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-4">
                      Complete breakdown of how funds are allocated across different program categories, ensuring maximum transparency and accountability.
                    </p>
                    
                    <div className="row">
                      <div className="col-md-8">
                        {ngo.transparency.utilization.map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0 fw-bold">{item.category}</h6>
                              <div className="text-end">
                                <span className="fw-bold text-success">${item.amount.toLocaleString()}</span>
                                <br />
                                <small className="text-muted">{item.percentage}% of total funds</small>
                              </div>
                            </div>
                            <div className="progress" style={{ height: '30px' }}>
                              <div 
                                className={`progress-bar bg-${index === 0 ? 'success' : index === 1 ? 'info' : index === 2 ? 'warning' : 'danger'}`}
                                style={{ width: `${item.percentage}%` }}
                              >
                                {item.percentage}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="fw-bold mb-3">Transparency Features</h6>
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <i className="bi bi-check-circle text-success me-2"></i>
                                Real-time fund tracking
                              </li>
                              <li className="mb-2">
                                <i className="bi bi-check-circle text-success me-2"></i>
                                Monthly audit reports
                              </li>
                              <li className="mb-2">
                                <i className="bi bi-check-circle text-success me-2"></i>
                                Public financial records
                              </li>
                              <li className="mb-2">
                                <i className="bi bi-check-circle text-success me-2"></i>
                                Third-party verification
                              </li>
                              <li className="mb-2">
                                <i className="bi bi-check-circle text-success me-2"></i>
                                Donor impact reports
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="bi bi-clock-history me-2"></i>Recent Financial Activity
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Activity</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ngo.transparency.auditTrail.map((activity, index) => (
                            <tr key={index}>
                              <td>{new Date(activity.date).toLocaleDateString()}</td>
                              <td>{activity.action}</td>
                              <td className="fw-bold text-success">
                                {activity.amount > 0 ? `$${activity.amount.toLocaleString()}` : 'N/A'}
                              </td>
                              <td><span className="badge bg-success">Verified</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="row">
                {ngo.testimonials.map(testimonial => (
                  <div key={testimonial.id} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-person text-white"></i>
                          </div>
                          <div>
                            <h6 className="mb-0">{testimonial.name}</h6>
                            <small className="text-muted">{testimonial.role}</small>
                          </div>
                        </div>
                        <p className="card-text">"{testimonial.message}"</p>
                        <div className="d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`bi bi-star-fill ${i < testimonial.rating ? 'text-warning' : 'text-muted'}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Contact Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <h6 className="text-danger fw-bold">Email</h6>
                          <p><a href={`mailto:${ngo.email}`} className="text-decoration-none">{ngo.email}</a></p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <h6 className="text-danger fw-bold">Phone</h6>
                          <p><a href={`tel:${ngo.phone}`} className="text-decoration-none">{ngo.phone}</a></p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <h6 className="text-danger fw-bold">Website</h6>
                          <p><a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{ngo.website}</a></p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <h6 className="text-danger fw-bold">Location</h6>
                          <p>{ngo.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Quick Actions</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <button className="btn btn-danger">
                          <i className="bi bi-heart me-2"></i>Donate Now
                        </button>
                        <button className="btn btn-outline-danger">
                          <i className="bi bi-people me-2"></i>Volunteer
                        </button>
                        <button className="btn btn-outline-secondary">
                          <i className="bi bi-share me-2"></i>Share
                        </button>
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
  );
};

export default NGOProfileDetail;
