import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from '../../utils/auth';
import { createDonation } from '../../services/donationService';
import { processMockPayment } from '../../services/mockPaymentService';

const DonationFormNew = ({ ngo, onBack, onSuccess }) => {
  const [pledgeType, setPledgeType] = useState('one-time');
  const [selectedAmount, setSelectedAmount] = useState(800);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('netbanking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const [donorDetails, setDonorDetails] = useState({
    name: '',
    email: ''
  });

  const quickAmounts = [800, 1200, 1600, 2400];

  // Load user data on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setDonorDetails({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  }, []);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const getFinalAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const validateForm = () => {
    const { name, email } = donorDetails;
    if (!name?.trim()) {
      toast.error('Please log in to make a donation');
      return false;
    }
    if (!email?.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please log in with a valid email address');
      return false;
    }
    return true;
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    console.log('Donate button clicked');
    
    // Check authentication status
    const currentUser = getCurrentUser();
    console.log('Current user:', currentUser);
    
    if (!currentUser || !currentUser.token) {
      console.error('No user token found in handleDonate');
      toast.error('Please log in to make a donation');
      return;
    }
    
    // Initialize toastId at the function scope
    let toastId;
    
    try {
      // Validate amount
      const finalAmount = getFinalAmount();
      console.log('Final amount:', finalAmount);
      
      if (finalAmount <= 0) {
        const errorMsg = 'Please select or enter a valid amount';
        console.error(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      if (!validateForm()) {
        console.error('Form validation failed');
        return;
      }

      setIsSubmitting(true);
      toastId = toast.loading('Processing your donation...');
      console.log('Starting donation process...');
      
      // Process payment (simulated)
      console.log('Processing payment...');
      const paymentResult = await processMockPayment({
        amount: finalAmount,
        email: currentUser.email,
        name: currentUser.name,
        paymentMethod: paymentMethod
      });
      console.log('Payment result:', paymentResult);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }
      
      if (!paymentResult || !paymentResult.success) {
        throw new Error(paymentResult?.message || 'Payment processing failed');
      }
      
      console.log('Saving donation record...');
      
      // Map frontend payment method values to backend enum values
      const paymentMethodMap = {
        'netbanking': 'BANK_TRANSFER',
        'card': 'CREDIT_CARD', // or 'DEBIT_CARD' if you want to distinguish
        'upi': 'UPI'
      };
      
      // Get the backend-compatible payment method
      const backendPaymentMethod = paymentMethodMap[paymentMethod] || 'BANK_TRANSFER';
      
      // Prepare donation data for the backend
      const donationPayload = {
        amount: finalAmount,
        ngoId: ngo?.id,
        userId: currentUser.id,
        paymentMethod: backendPaymentMethod,
        paymentId: paymentResult.paymentId || `DON-${Date.now()}`,
        pledgeType: pledgeType.toUpperCase().replace('-', '_'),
        message: '',
        status: 'COMPLETED'
      };
      console.log('Donation payload:', donationPayload);

      // Save the donation to the backend
      const savedDonation = await createDonation(donationPayload);
      
      // Prepare receipt data for the UI
      const receiptData = {
        id: savedDonation.id || Date.now().toString(),
        amount: finalAmount,
        date: new Date().toISOString(),
        donor: {
          name: currentUser?.name || 'Anonymous',
          email: currentUser?.email || 'N/A',
          phone: currentUser?.phone || 'Not provided'
        },
        ngo: {
          name: ngo?.organization_name || 'NGO',
          cause: ngo?.cause || 'Social Cause',
          location: ngo?.location || 'Location not specified'
        },
        paymentMethod: backendPaymentMethod,
        status: 'completed',
        transactionId: savedDonation.paymentId || paymentResult.paymentId || `txn_${Date.now()}`,
        pledgeType: pledgeType
      };
      
      console.log('Donation successful, showing receipt...');
      
      // Dismiss the loading toast
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      // Prepare donation data for success callback
      const donationResult = {
        ...savedDonation,
        donor: {
          ...currentUser,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || 'Not provided'
        },
        ngo: {
          name: ngo?.organization_name || 'NGO',
          cause: ngo?.cause || 'Social Cause',
          location: ngo?.location || 'Location not specified'
        },
        amount: finalAmount,
        pledgeType,
        paymentId: savedDonation.paymentId || paymentResult.paymentId,
        date: new Date().toISOString()
      };
      
      console.log('Donation successful, showing receipt...');
      
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      // Prepare donation data for receipt and history
      const donationData = {
        id: savedDonation.id || Date.now().toString(),
        amount: finalAmount,
        date: new Date().toISOString(),
        donor: {
          name: currentUser?.name || 'Anonymous',
          email: currentUser?.email || 'N/A'
        },
        ngo: {
          name: ngo?.organization_name || 'NGO',
          cause: ngo?.cause || 'Social Cause',
          location: ngo?.location || 'Location not specified'
        },
        paymentMethod: paymentMethod,
        status: 'completed',
        transactionId: savedDonation.paymentId || paymentResult.paymentId || `txn_${Date.now()}`
      };

      // Call onSuccess with donation data to show receipt
      if (onSuccess) {
        onSuccess(donationData);
      }
      
      // Show success message with more details
      const successMessage = (
        <div className="text-center">
          <h5 className="text-success fw-bold mb-2">🎉 Donation Successful!</h5>
          <p className="mb-1">Thank you for your generous donation of <strong>₹{finalAmount.toLocaleString()}</strong></p>
          <p className="mb-0">Your receipt is ready to view.</p>
        </div>
      );
      
      toast.success(successMessage, {
        position: 'top-center',
        autoClose: 5000,
        closeButton: true,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        icon: false,
        className: 'success-toast'
      });
      
      // Update user's donation history in local storage (temporary solution)
      const userDonations = JSON.parse(localStorage.getItem('userDonations') || '[]');
      userDonations.push({
        id: donationData.id,
        amount: donationData.amount,
        date: donationData.date,
        ngo: ngo?.organization_name || 'NGO',
        status: 'completed',
        transactionId: donationData.transactionId
      });
      localStorage.setItem('userDonations', JSON.stringify(userDonations));
      
      // Reset form fields after successful donation
      setSelectedAmount(800);
      setCustomAmount('');
      setPledgeType('one-time');
      setPaymentMethod('netbanking');
      
      // Reset form if it exists
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Donation error:', error);
      // Dismiss any active toasts
      toast.dismiss();
      // Show error message
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      if (toastId && toast.isActive?.(toastId)) {
        toast.dismiss(toastId);
      }
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      toast.error('Please log in to make a donation');
      return;
    }
    
    // Validate amount
    const finalAmount = getFinalAmount();
    if (finalAmount <= 0) {
      toast.error('Please select or enter a valid amount');
      return;
    }
    
    // Proceed with donation
    await handleDonate(e);
  };

  // Define prop types
  DonationFormNew.propTypes = {
    ngo: PropTypes.shape({
      id: PropTypes.string,
      organization_name: PropTypes.string,
      cause: PropTypes.string,
      location: PropTypes.string
    }),
    onBack: PropTypes.func,
    onSuccess: PropTypes.func
  };

  DonationFormNew.defaultProps = {
    ngo: {},
    onBack: () => {},
    onSuccess: () => {}
  };

  // Add custom styles for the success toast
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .Toastify__toast--success {
        font-size: 1rem;
        border-radius: 8px;
        padding: 15px 20px;
      }
      .success-toast .Toastify__toast-body {
        padding: 0;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="toast-container" />
      <div className="row g-4">
        {/* Left Section - NGO Info */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <i className="bi bi-heart-fill text-danger fs-4"></i>
                  </div>
                </div>
                <div>
                  <h2 className="h4 mb-1 fw-bold">{ngo?.organization_name || 'NGO'}</h2>
                  <div className="d-flex align-items-center text-muted">
                    <i className="bi bi-geo-alt me-1"></i>
                    <span>{ngo?.location || 'Location not specified'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-light p-3 rounded mb-4">
                <h5 className="text-uppercase text-muted mb-3">About the Cause</h5>
                <p className="mb-0">
                  Support {ngo?.organization_name || 'this NGO'} in their mission to create positive change. 
                  Your contribution will help make a difference in the lives of those in need.
                </p>
              </div>
              
              <div className="bg-light p-3 rounded">
                <h5 className="text-uppercase text-muted mb-3">How Your Donation Helps</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Provide essential supplies to those in need
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Support education and healthcare initiatives
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Fund community development programs
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Help us reach more beneficiaries
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Why Donate?</h5>
              <p>
                We work in close coordination with government agencies at various levels - National, State, 
                and District - to run child welfare projects. We aim to support and contribute towards 
                building a better world where children can thrive and reach their full potential.
              </p>
              <p className="mb-0">
                Your donation will directly support our ongoing projects and help us reach more children in need. 
                Every contribution, no matter how small, makes a significant impact in their lives.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Donation Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm sticky-top" style={{top: '20px'}}>
            <div className="card-body p-4">
              <h3 className="h4 fw-bold mb-4 text-center">Make a Donation</h3>
              
              <form onSubmit={handleSubmit}>
                {/* Pledge Type */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">I want to</h6>
                  <div className="d-flex gap-2 mb-3">
                    <div className="form-check form-check-inline flex-grow-1">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="pledgeType"
                        id="oneTime"
                        value="one-time"
                        checked={pledgeType === 'one-time'}
                        onChange={() => setPledgeType('one-time')}
                      />
                      <label className="form-check-label w-100" htmlFor="oneTime">
                        <div className={`p-3 border rounded ${pledgeType === 'one-time' ? 'bg-success text-white' : ''}`}>
                          One-time Donation
                        </div>
                      </label>
                    </div>
                    <div className="form-check form-check-inline flex-grow-1">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="pledgeType"
                        id="monthly"
                        value="monthly"
                        checked={pledgeType === 'monthly'}
                        onChange={() => setPledgeType('monthly')}
                      />
                      <label className="form-check-label w-100" htmlFor="monthly">
                        <div className={`p-3 rounded text-center ${pledgeType === 'monthly' ? 'bg-success text-white' : 'border'}`}>
                          Monthly Donation
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Donation Amount */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Select Amount (₹)</h6>
                  <div className="row g-2 mb-3">
                    {quickAmounts.map(amount => (
                      <div key={amount} className="col-4">
                        <button
                          type="button"
                          className={`btn w-100 ${selectedAmount === amount ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          ₹{amount}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Or enter a custom amount</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Select Payment Method</h6>
                  <div className="list-group">
                    {[
                      { id: 'netbanking', label: 'Net Banking', icon: 'bank' },
                      { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card' },
                      { id: 'upi', label: 'UPI', icon: 'phone' }
                    ].map(method => (
                      <label 
                        key={method.id}
                        className={`list-group-item d-flex align-items-center p-3 ${paymentMethod === method.id ? 'border-success bg-light' : 'border'}`}
                        style={{ borderLeft: paymentMethod === method.id ? '3px solid #28a745' : '3px solid transparent' }}
                      >
                        <input
                          type="radio"
                          className="form-check-input flex-shrink-0 me-3"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <i className={`bi bi-${method.icon} fs-5 me-3`}></i>
                        <span className="flex-grow-1">{method.label}</span>
                        {paymentMethod === method.id && <i className="bi bi-check-lg text-success"></i>}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Donation Summary */}
                <div className="bg-light p-3 rounded-3 mb-4">
                  <h6 className="fw-bold mb-3">Donation Summary</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Donation Amount:</span>
                    <span className="fw-bold">₹{getFinalAmount().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Payment Type:</span>
                    <span>{pledgeType === 'one-time' ? 'One-time' : 'Monthly'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Payment Method:</span>
                    <span className="text-capitalize">
                      {paymentMethod === 'netbanking' ? 'Net Banking' : 
                       paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg py-3 fw-bold"
                    disabled={isSubmitting || getFinalAmount() <= 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      `Donate ₹${getFinalAmount().toLocaleString()}`
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={onBack}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-arrow-left me-2"></i>Back to NGO List
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p className="small text-muted mb-0">
                  <i className="bi bi-lock-fill me-1"></i>
                  Your donation is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationFormNew;
