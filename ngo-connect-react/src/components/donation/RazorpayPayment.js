import React, { useState, useEffect } from 'react';

const RazorpayPayment = ({ amount, ngo, pledgeType, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = () => {
    if (!paymentData.name || !paymentData.email || !paymentData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    // Simulate Razorpay payment process
    setTimeout(() => {
      const options = {
        key: 'rzp_test_dummy_key', // Dummy key for testing
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'NGO Connect',
        description: `Donation to ${ngo.name}`,
        image: 'https://via.placeholder.com/150x150',
        order_id: `order_${Date.now()}`,
        handler: function (response) {
          console.log('Payment successful:', response);
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: amount,
            ngo: ngo,
            pledgeType: pledgeType,
            donor: paymentData
          });
        },
        prefill: {
          name: paymentData.name,
          email: paymentData.email,
          contact: paymentData.phone
        },
        notes: {
          address: paymentData.address,
          ngo_id: ngo.id,
          pledge_type: pledgeType
        },
        theme: {
          color: '#dc3545'
        }
      };

      // For demo purposes, we'll simulate the payment
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for demo
        alert('Razorpay not loaded. This is a demo payment.');
        onSuccess({
          paymentId: `demo_${Date.now()}`,
          orderId: `order_${Date.now()}`,
          signature: 'demo_signature',
          amount: amount,
          ngo: ngo,
          pledgeType: pledgeType,
          donor: paymentData
        });
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-header bg-danger text-white">
            <h4 className="mb-0">
              <i className="bi bi-credit-card me-2"></i>
              Complete Your Donation
            </h4>
          </div>
          <div className="card-body p-4">
            {/* Donation Summary */}
            <div className="bg-light p-3 rounded mb-4">
              <h5 className="text-danger fw-bold mb-3">Donation Summary</h5>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>NGO:</strong> {ngo.name}</p>
                  <p className="mb-1"><strong>Amount:</strong> ₹{amount.toLocaleString()}</p>
                  <p className="mb-1"><strong>Type:</strong> {pledgeType === 'one-time' ? 'One-time' : 'Monthly'}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Payment Method:</strong> Razorpay</p>
                  <p className="mb-1"><strong>Currency:</strong> INR</p>
                  <p className="mb-0"><strong>Status:</strong> <span className="text-warning">Pending</span></p>
                </div>
              </div>
            </div>

            {/* Donor Information */}
            <h5 className="fw-bold mb-3">Donor Information</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={paymentData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={paymentData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={paymentData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={paymentData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Payment Methods</h5>
              <div className="row">
                <div className="col-md-4 mb-2">
                  <div className="card border-danger">
                    <div className="card-body text-center">
                      <i className="bi bi-credit-card text-danger fs-1"></i>
                      <p className="mb-0">Credit/Debit Card</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="card border-danger">
                    <div className="card-body text-center">
                      <i className="bi bi-bank text-danger fs-1"></i>
                      <p className="mb-0">Net Banking</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="card border-danger">
                    <div className="card-body text-center">
                      <i className="bi bi-phone text-danger fs-1"></i>
                      <p className="mb-0">UPI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="alert alert-info">
              <i className="bi bi-shield-check me-2"></i>
              <strong>Secure Payment:</strong> Your payment information is encrypted and secure. We use Razorpay for processing payments.
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary flex-grow-1"
                onClick={onCancel}
                disabled={isProcessing}
              >
                <i className="bi bi-arrow-left me-2"></i>Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger flex-grow-1 py-2 fw-bold"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-credit-card me-2"></i>
                    Pay ₹{amount.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
