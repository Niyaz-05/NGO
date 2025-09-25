import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CampaignDetail = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationMessage, setDonationMessage] = useState('');

  const campaign = {
    title: "Women Empowerment Education Drive",
    ngo: "Women Empowerment Foundation",
    image: "https://www.planindia.org/wp-content/uploads/2019/08/young-helath.jpg",
    description: "This campaign aims to provide education and skill development opportunities to 1000 women in rural areas. We will establish learning centers and provide necessary resources for their development.",
    goal: 50000,
    raised: 35000,
    donors: 150,
    daysLeft: 15,
    category: "Education",
    location: "Mumbai, Maharashtra"
  };

  const progress = (campaign.raised / campaign.goal) * 100;

  const handleDonateNow = () => {
    setShowDonationModal(true);
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    // Here you would typically integrate with a payment gateway
    // For now, we'll just show a success message
    alert(`Thank you for your donation of ₹${donationAmount}! Your contribution will make a difference.`);
    setShowDonationModal(false);
    setDonationAmount('');
    setDonorName('');
    setDonorEmail('');
    setDonationMessage('');
  };

  const handleCloseModal = () => {
    setShowDonationModal(false);
    setDonationAmount('');
    setDonorName('');
    setDonorEmail('');
    setDonationMessage('');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <img 
            src={campaign.image} 
            alt={campaign.title}
            className="img-fluid rounded mb-4"
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
          
          <h1>{campaign.title}</h1>
          <p className="text-muted">by {campaign.ngo}</p>
          
          <div className="mb-4">
            <span className="badge bg-primary me-2">{campaign.category}</span>
            <span className="badge bg-secondary">{campaign.location}</span>
          </div>
          
          <p className="lead">{campaign.description}</p>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5>Campaign Details</h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Goal:</strong> ₹{campaign.goal.toLocaleString()}</p>
                  <p><strong>Raised:</strong> ₹{campaign.raised.toLocaleString()}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Donors:</strong> {campaign.donors}</p>
                  <p><strong>Days Left:</strong> {campaign.daysLeft}</p>
                </div>
              </div>
              
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                >
                  {progress.toFixed(1)}%
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-success btn-lg" onClick={handleDonateNow}>Donate Now</button>
                <Link to="/events/volunteer-events" className="btn btn-outline-primary">
                  Volunteer for this Campaign
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Recent Donations</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Anonymous</strong>
                      <br />
                      <small className="text-muted">2 hours ago</small>
                    </div>
                    <span className="text-success">₹1,000</span>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>John Doe</strong>
                      <br />
                      <small className="text-muted">5 hours ago</small>
                    </div>
                    <span className="text-success">₹500</span>
                  </div>
                </div>
                <div className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Jane Smith</strong>
                      <br />
                      <small className="text-muted">1 day ago</small>
                    </div>
                    <span className="text-success">₹2,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mt-3">
            <div className="card-header">
              <h5>Campaign Updates</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Milestone Reached!</strong>
                <br />
                <small className="text-muted">We've reached 70% of our goal! Thank you to all our supporters.</small>
              </div>
              <div className="mb-3">
                <strong>New Learning Center</strong>
                <br />
                <small className="text-muted">We've established our first learning center in rural Maharashtra.</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDonationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Make a Donation</h3>
            <form onSubmit={handleDonationSubmit}>
              <div className="mb-3">
                <label htmlFor="donationAmount" className="form-label">Donation Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="donationAmount" 
                  value={donationAmount} 
                  onChange={(e) => setDonationAmount(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="donorName" className="form-label">Your Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="donorName" 
                  value={donorName} 
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="donorEmail" className="form-label">Your Email (optional)</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="donorEmail" 
                  value={donorEmail} 
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="donationMessage" className="form-label">Message (optional)</label>
                <textarea 
                  className="form-control" 
                  id="donationMessage" 
                  rows="3" 
                  value={donationMessage} 
                  onChange={(e) => setDonationMessage(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Donation</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={handleCloseModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
