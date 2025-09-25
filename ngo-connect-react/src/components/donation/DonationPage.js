import React, { useState } from 'react';
import NGOList from './NGOList';
import DonationFormNew from './DonationFormNew';
import DonationReceipt from './DonationReceipt';
import DonationHistory from './DonationHistory';

const DonationPage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [donationData, setDonationData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);


  const handlePaymentSuccess = (paymentData) => {
    setDonationData(paymentData);
    setShowReceipt(true);
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    setDonationData(null);
    setActiveTab('browse');
  };

  return (
    <div style={{ background: "white", minHeight: "100vh", overflowY: 'auto' }}>
      <div className="container-fluid px-0">
        <div className="container pt-4">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
                onClick={() => setActiveTab('browse')}
              >
                <i className="bi bi-search me-2"></i>Browse NGOs
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <i className="bi bi-clock-history me-2"></i>Donation History
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === 'browse' && (
              <NGOList onNGOSelect={(ngo) => {
                setSelectedNGO(ngo);
                // Show donation form directly when an NGO is selected
                setActiveTab('donate');
              }} />
            )}
            {activeTab === 'donate' && selectedNGO && (
              <DonationFormNew 
                ngo={selectedNGO} 
                onBack={() => setActiveTab('browse')} 
                onSuccess={handlePaymentSuccess} 
              />
            )}
            {activeTab === 'history' && (
              <DonationHistory />
            )}
          </div>
        </div>
      </div>

      {/* Donation Receipt Modal */}
      {showReceipt && donationData && (
        <div 
          className="receipt-modal" 
          onClick={handleReceiptClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            cursor: 'pointer'
          }}
        >
          <div 
            className="receipt-container" 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              cursor: 'default',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            }}
          >
            <button 
              onClick={handleReceiptClose}
              style={{
                position: 'absolute',
                right: '15px',
                top: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.8rem',
                cursor: 'pointer',
                color: '#6c757d',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s',
                zIndex: 10000
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              aria-label="Close"
            >
              &times;
            </button>
            <DonationReceipt 
              donation={donationData} 
              ngo={selectedNGO}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
