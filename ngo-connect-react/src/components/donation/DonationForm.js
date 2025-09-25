import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DonationReceipt from './DonationReceipt';
import { Modal, Button } from 'react-bootstrap';

const DonationForm = ({ ngo, onBack }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'CREDIT_CARD', // Default to CREDIT_CARD which matches backend enum
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [donationData, setDonationData] = useState(null);
  const receiptRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid donation amount';
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!formData.nameOnCard) {
        newErrors.nameOnCard = 'Name on card is required';
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      
          try {
        // In a real app, you would call your API endpoint here
        const response = await fetch('http://localhost:8080/api/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ngoId: ngo.id,
            amount: parseFloat(formData.amount),
            paymentMethod: formData.paymentMethod, // This should now be CREDIT_CARD, DEBIT_CARD, etc.
            donorMessage: formData.message,
            email: formData.email
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Donation failed');
        }
        
        const responseData = await response.json();
        
        // Use the actual response data
        const donationResponse = {
          ...responseData,
          ngoName: ngo.name,
          donorName: formData.nameOnCard || 'Anonymous',
          date: new Date().toISOString()
        };
        
        setDonationData(donationResponse);
        setShowSuccess(true);
      } catch (error) {
        console.error('Donation failed:', error);
        alert('Donation failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `donation-receipt-${donationData?.id || 'receipt'}`,
    onAfterPrint: () => console.log('Receipt printed successfully'),
    pageStyle: `
      @page { size: auto; margin: 0mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
        .no-print { display: none !important; }
      }
    `
  });
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onBack();
  };

  const quickAmounts = [25, 50, 100, 250, 500];

  return (
    <>
      {donationData && (
        <div style={{ display: 'none' }}>
          <DonationReceipt ref={receiptRef} donation={donationData} ngo={ngo} />
        </div>
      )}
      
      <Modal show={showSuccess} onHide={handleCloseSuccess} centered>
        <Modal.Header closeButton>
          <Modal.Title>Donation Successful! 🎉</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            <h4 className="mt-3">Thank you for your donation!</h4>
            <p className="text-muted">Your contribution of <strong>${donationData?.amount}</strong> to <strong>{ngo?.name}</strong> has been received.</p>
            <p>Transaction ID: <code>{donationData?.transactionId}</code></p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={handlePrintReceipt}>
            <i className="bi bi-download me-2"></i>Download Receipt
          </Button>
          <Button variant="outline-secondary" onClick={handleCloseSuccess}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    <div className="row">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">Make a Donation</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Donation Amount</label>
                <div className="row mb-3">
                  {quickAmounts.map(amount => (
                    <div key={amount} className="col-2">
                      <button
                        type="button"
                        className={`btn w-100 ${formData.amount === amount ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFormData({...formData, amount: amount})}
                      >
                        ${amount}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter custom amount"
                    min="1"
                  />
                </div>
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label">Payment Method</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="creditCard"
                    value="CREDIT_CARD"
                    checked={formData.paymentMethod === 'CREDIT_CARD'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="creditCard">
                    Credit Card
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="debitCard"
                    value="DEBIT_CARD"
                    checked={formData.paymentMethod === 'DEBIT_CARD'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="debitCard">
                    Debit Card
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paypal"
                    value="PAYPAL"
                    checked={formData.paymentMethod === 'PAYPAL'}
                    onChange={handleChange}
                  />
                  <label className="btn btn-outline-primary" htmlFor="paypal">
                    <i className="bi bi-paypal me-2"></i>PayPal
                  </label>
                </div>
              </div>

              {(formData.paymentMethod === 'CREDIT_CARD' || formData.paymentMethod === 'DEBIT_CARD') && (
                <div className="mb-4">
                  <div className="row">
                    <div className="col-md-8">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="4"
                      />
                      {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Name on Card</label>
                      <input
                        type="text"
                        className={`form-control ${errors.nameOnCard ? 'is-invalid' : ''}`}
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleChange}
                        placeholder="John Doe"
                      />
                      {errors.nameOnCard && <div className="invalid-feedback">{errors.nameOnCard}</div>}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label">Message (Optional)</label>
                <textarea
                  className="form-control"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Leave a message for the NGO..."
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onBack}
                >
                  <i className="bi bi-arrow-left me-2"></i>Back to NGOs
                </button>
                <button
                  type="submit"
                  className="btn btn-success flex-grow-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-heart me-2"></i>Donate ${formData.amount || '0'}
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
            <h5 className="mb-0">Donation Summary</h5>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <img
                src={ngo.image}
                alt={ngo.name}
                className="rounded me-3"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="mb-0">{ngo.name}</h6>
                <small className="text-muted">{ngo.cause}</small>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Donation Amount:</span>
              <span className="fw-bold">${formData.amount || '0'}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Processing Fee:</span>
              <span>$0.00</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold text-success">${formData.amount || '0'}</span>
            </div>
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Your donation is secure and encrypted
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DonationForm;
