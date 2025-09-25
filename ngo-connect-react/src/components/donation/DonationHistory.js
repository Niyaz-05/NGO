import React, { useState, useEffect } from 'react';
import { getDonationHistory } from '../../services/donationService';
import { getCurrentUser } from '../../utils/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Formatting utilities are now handled by native Date methods

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentUser = getCurrentUser();
        if (!currentUser?.id) {
          throw new Error('Please sign in to view your donation history');
        }
        
        // Show loading toast
        const toastId = toast.loading('Fetching your donation history...');
        
        try {
          const data = await getDonationHistory(currentUser.id);
          
          if (!data || data.length === 0) {
            toast.update(toastId, {
              render: 'No donation history found',
              type: 'info',
              isLoading: false,
              autoClose: 3000,
              closeButton: true
            });
            setDonations([]);
            return;
          }
          
          // Transform the API response to match the expected format
          const formattedDonations = data.map(donation => ({
            id: donation.id,
            ngoName: donation.ngo?.organizationName || 'NGO',
            amount: donation.amount,
            date: donation.createdAt ? new Date(donation.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: (donation.status || 'completed').toLowerCase(),
            cause: donation.ngo?.cause || 'General',
            message: donation.message || '',
            paymentId: donation.paymentId || `DON-${donation.id || 'N/A'}`,
            paymentMethod: donation.paymentMethod || 'card'
          }));
          
          setDonations(formattedDonations);
          
          toast.update(toastId, {
            render: `Loaded ${formattedDonations.length} donations`,
            type: 'success',
            isLoading: false,
            autoClose: 3000,
            closeButton: true
          });
          
        } catch (err) {
          console.error('API Error:', err);
          const errorMessage = err.response?.data?.message || 'Failed to load donation history. Please try again later.';
          setError(errorMessage);
          
          toast.update(toastId, {
            render: errorMessage,
            type: 'error',
            isLoading: false,
            autoClose: 5000,
            closeButton: true
          });
        }
        
      } catch (err) {
        console.error('Error in fetchDonations:', err);
        setError(err.message || 'An unexpected error occurred');
        toast.error(err.message || 'Failed to load donation history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
    
    // Cleanup function to abort any pending requests if component unmounts
    return () => {
      // You can add request cancellation logic here if using axios cancel tokens
    };
  }, []);

  const filteredDonations = donations.filter(donation => {
    if (filter === 'all') return true;
    return donation.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { class: 'success', icon: 'check-circle', label: 'Completed' },
      'pending': { class: 'warning', icon: 'clock', label: 'Pending' },
      'failed': { class: 'danger', icon: 'x-circle', label: 'Failed' },
      'refunded': { class: 'info', icon: 'arrow-counterclockwise', label: 'Refunded' },
      'cancelled': { class: 'secondary', icon: 'slash-circle', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'secondary', icon: 'question-circle', label: status || 'Unknown' };
    
    return (
      <span className={`badge bg-${config.class} d-flex align-items-center`}>
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getPaymentMethodIcon = (method) => {
    const methods = {
      'card': 'credit-card',
      'netbanking': 'bank',
      'upi': 'phone',
      'wallet': 'wallet2',
      'emi': 'credit-card-2-back',
      'cardless_emi': 'credit-card-2-front'
    };
    return methods[method] || 'cash-coin';
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-3">Loading your donation history</h4>
        <p className="text-muted">Please wait while we fetch your donations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: '1.5rem' }}></i>
          <div>
            <h5 className="alert-heading mb-1">Unable to load donation history</h5>
            <p className="mb-0">{error}</p>
            <button 
              className="btn btn-outline-danger mt-3" 
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-8">
          <h4>Your Donation History</h4>
          <p className="text-muted">Track all your charitable contributions</p>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Donations</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

<div className="card">
        <div className="card-body">
          {filteredDonations.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>NGO</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Cause</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map(donation => (
                    <tr key={donation.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" 
                                 style={{ width: '40px', height: '40px' }}>
                              {donation.ngoName.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-0">{donation.ngoName}</h6>
                          </div>
                        </div>
                      </td>
                      <td className="fw-bold">
                        {formatCurrency(donation.amount)}
                        <div className="small text-muted">
                          <i className={`bi bi-${getPaymentMethodIcon(donation.paymentMethod)} me-1`}></i>
                          {donation.paymentMethod || 'card'}
                        </div>
                      </td>
                      <td>
                        <div>{formatDate(donation.date)}</div>
                        <div className="small text-muted">ID: {donation.paymentId}</div>
                      </td>
                      <td>
                        {getStatusBadge(donation.status)}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{donation.cause}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-gift display-1 text-muted"></i>
              <h4 className="text-muted mt-3">No donations found</h4>
              <p className="text-muted">
                {filter === 'all' 
                  ? "You haven't made any donations yet. Start making a difference today!"
                  : `No ${filter} donations found.`
                }
              </p>
              {filter === 'all' && (
                <button className="btn btn-success">
                  <i className="bi bi-heart me-2"></i>Make Your First Donation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
