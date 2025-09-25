import React, { useEffect, useState } from 'react';
import { donationAPI } from '../../services/api';
import { 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaUser, 
  FaCreditCard, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaHandHoldingHeart,
  FaExclamationTriangle,
  FaDownload
} from 'react-icons/fa';
import { Button, Spinner } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { Card, Table, Badge } from 'react-bootstrap';

const NGODonations = ({ ngoId }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!ngoId) {
        console.error('No NGO ID provided to NGODonations component');
        setError('No NGO ID provided. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching donations for NGO ID:', ngoId);
        const token = localStorage.getItem('token');
        console.log('Current auth token exists:', !!token);
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
        
        // Make the API call
        console.log('Making API call to fetch donations...');
        const response = await donationAPI.getNGODonations(ngoId);
        console.log('Donations API response:', response);
        
        if (!response || !response.data) {
          throw new Error('Invalid response format from server');
        }
        
        setDonations(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching donations:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          } : 'No response',
          config: err.config ? {
            url: err.config.url,
            method: err.config.method,
            headers: err.config.headers
          } : 'No config'
        });
        setError(`Failed to load donations: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (ngoId) {
      fetchDonations();
    }
  }, [ngoId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <FaCheckCircle className="me-1" />;
      case 'PENDING':
        return <FaClock className="me-1" />;
      case 'FAILED':
        return <FaTimesCircle className="me-1" />;
      default:
        return null;
    }
  };
  
  const getStatusVariant = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMM dd, yyyy hh:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center p-5">
          <div className="d-flex justify-content-center mb-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          <p className="text-muted">Loading your donations...</p>
          <small className="text-muted">NGO ID: {ngoId || 'Not available'}</small>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-danger">
        <Card.Body>
          <div className="d-flex align-items-center">
            <FaExclamationTriangle className="text-danger me-2" />
            <h5 className="mb-0">Error loading donations</h5>
          </div>
          <div className="mt-3">
            <p className="text-muted">{error}</p>
            <div className="bg-light p-3 rounded">
              <p className="small mb-1"><strong>Debug Info:</strong></p>
              <p className="small mb-1">NGO ID: {ngoId || 'Not provided'}</p>
              <p className="small mb-0">Token: {localStorage.getItem('token') ? 'Exists' : 'Missing'}</p>
            </div>
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Donation History</h5>
          <div>
            <Button variant="outline-primary" size="sm" className="me-2">
              <FaDownload className="me-1" /> Export
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {donations.length === 0 ? (
          <div className="text-center py-5">
            <div className="d-flex justify-content-center mb-3">
              <div className="bg-light rounded-circle p-4">
                <FaHandHoldingHeart className="text-primary" size={32} />
              </div>
            </div>
            <h5 className="mb-2">No donations yet</h5>
            <p className="text-muted mb-0">
              Your organization hasn't received any donations yet. Share your cause to start receiving support.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Donor</th>
                  <th className="text-end">Amount</th>
                  <th className="text-center">Payment Method</th>
                  <th className="text-center">Status</th>
                  <th className="text-end">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <FaUser className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-medium">
                            {donation.donor?.name || 'Anonymous Donor'}
                          </div>
                          {donation.donor?.email && (
                            <div className="text-muted small">
                              {donation.donor.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="text-end fw-medium">
                      <div className="d-flex align-items-center justify-content-end">
                        <FaRupeeSign className="text-muted me-1 small" />
                        {donation.amount ? donation.amount.toLocaleString('en-IN', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }) : '0'}
                      </div>
                    </td>
                    
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center">
                        <FaCreditCard className="me-2 text-muted" />
                        <span className="text-muted text-capitalize">
                          {(donation.paymentMethod || '').toLowerCase() || 'N/A'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="text-center">
                      <Badge bg={getStatusVariant(donation.status)} className="d-inline-flex align-items-center">
                        {getStatusIcon(donation.status)}
                        {donation.status || 'UNKNOWN'}
                      </Badge>
                    <div className="flex items-center justify-center">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        donation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatusIcon(donation.status)}
                        <span className="ml-1">
                          {(donation.status || '').toLowerCase().replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Date Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right pr-8">
                        <div className="d-flex align-items-center justify-content-end text-muted small">
                        <FaCalendarAlt className="me-2 flex-shrink-0" />
                        <span>{formatDate(donation.donationDate || donation.createdAt)}</span>
                      </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default NGODonations;
