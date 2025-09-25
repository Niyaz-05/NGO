import React, { useState, useEffect } from 'react';

const TransparencyPage = () => {
  const [transparencyData, setTransparencyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockData = {
      totalDonations: 2500000,
      totalNGOs: 150,
      totalVolunteers: 5000,
      fundUtilization: [
        { category: "Education Programs", amount: 1000000, percentage: 40, color: "success" },
        { category: "Healthcare Initiatives", amount: 750000, percentage: 30, color: "info" },
        { category: "Environmental Projects", amount: 500000, percentage: 20, color: "warning" },
        { category: "Administrative Costs", amount: 250000, percentage: 10, color: "danger" }
      ],
      monthlyStats: [
        { month: "Jan", donations: 200000, volunteers: 450 },
        { month: "Feb", donations: 180000, volunteers: 380 },
        { month: "Mar", donations: 220000, volunteers: 520 },
        { month: "Apr", donations: 250000, volunteers: 600 },
        { month: "May", donations: 300000, volunteers: 750 },
        { month: "Jun", donations: 280000, volunteers: 680 }
      ],
      topNGOs: [
        { name: "Green Earth Foundation", donations: 125000, volunteers: 200 },
        { name: "Education for All", donations: 110000, volunteers: 180 },
        { name: "Health First", donations: 95000, volunteers: 150 },
        { name: "Women Empowerment Hub", donations: 80000, volunteers: 120 }
      ]
    };

    setTimeout(() => {
      setTransparencyData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="bg-danger text-white">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center py-4">
              <div>
                <h2 className="mb-2">Transparency Report</h2>
                <p className="mb-0">Complete visibility into how your donations are making an impact</p>
              </div>
              <div className="text-end">
                <button className="btn btn-outline-light me-2">
                  <i className="bi bi-download me-2"></i>Download Report
                </button>
                <button className="btn btn-light">
                  <i className="bi bi-share me-2"></i>Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-4">
          {/* Key Metrics */}
          <div className="row mb-5">
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white h-100">
                <div className="card-body text-center">
                  <i className="bi bi-currency-dollar display-4 mb-2"></i>
                  <h3 className="card-title">${transparencyData.totalDonations.toLocaleString()}</h3>
                  <p className="card-text">Total Donations Raised</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white h-100">
                <div className="card-body text-center">
                  <i className="bi bi-building display-4 mb-2"></i>
                  <h3 className="card-title">{transparencyData.totalNGOs}</h3>
                  <p className="card-text">NGOs Supported</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white h-100">
                <div className="card-body text-center">
                  <i className="bi bi-people display-4 mb-2"></i>
                  <h3 className="card-title">{transparencyData.totalVolunteers.toLocaleString()}</h3>
                  <p className="card-text">Active Volunteers</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-white h-100">
                <div className="card-body text-center">
                  <i className="bi bi-graph-up display-4 mb-2"></i>
                  <h3 className="card-title">98%</h3>
                  <p className="card-text">Fund Utilization Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fund Utilization */}
          <div className="row mb-5">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Fund Utilization Breakdown</h5>
                </div>
                <div className="card-body">
                  {transparencyData.fundUtilization.map((item, index) => (
                    <div key={index} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{item.category}</h6>
                        <span className="fw-bold">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                      <div className="progress" style={{ height: '25px' }}>
                        <div 
                          className={`progress-bar bg-${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        >
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Monthly Trends</h5>
                </div>
                <div className="card-body">
                  <canvas id="monthlyChart" width="400" height="300"></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing NGOs */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Top Performing NGOs</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>NGO Name</th>
                          <th>Total Donations</th>
                          <th>Active Volunteers</th>
                          <th>Impact Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transparencyData.topNGOs.map((ngo, index) => (
                          <tr key={index}>
                            <td>
                              <span className={`badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-warning' : 'bg-light text-dark'}`}>
                                #{index + 1}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                     style={{ width: '40px', height: '40px' }}>
                                  <i className="bi bi-building text-white"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">{ngo.name}</h6>
                                  <small className="text-muted">Verified NGO</small>
                                </div>
                              </div>
                            </td>
                            <td className="fw-bold text-success">${ngo.donations.toLocaleString()}</td>
                            <td className="fw-bold text-info">{ngo.volunteers}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress me-2" style={{ width: '100px', height: '8px' }}>
                                  <div 
                                    className="progress-bar bg-danger" 
                                    style={{ width: `${(ngo.donations / 125000) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="fw-bold">{Math.round((ngo.donations / 125000) * 100)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Stories */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Impact Stories</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <div className="card border-0 shadow-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop" 
                          className="card-img-top" 
                          alt="Education Impact"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h6 className="card-title text-danger">Education Impact</h6>
                          <p className="card-text small">
                            Through our education programs, we've helped 5,000+ children access quality education 
                            and improve their academic performance.
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">5,000+ Children</small>
                            <span className="badge bg-success">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="card border-0 shadow-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop" 
                          className="card-img-top" 
                          alt="Healthcare Impact"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h6 className="card-title text-danger">Healthcare Impact</h6>
                          <p className="card-text small">
                            Our healthcare initiatives have provided medical assistance to 10,000+ people 
                            in rural communities across the country.
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">10,000+ People</small>
                            <span className="badge bg-success">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="card border-0 shadow-sm">
                        <img 
                          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop" 
                          className="card-img-top" 
                          alt="Environment Impact"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h6 className="card-title text-danger">Environment Impact</h6>
                          <p className="card-text small">
                            Environmental projects have resulted in 10,000+ trees planted and 50+ communities 
                            becoming more environmentally conscious.
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">10,000+ Trees</small>
                            <span className="badge bg-success">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparencyPage;
