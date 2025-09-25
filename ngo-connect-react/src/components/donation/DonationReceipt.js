import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { Card, Row, Col } from 'react-bootstrap';

const DonationReceipt = forwardRef(({ donation, ngo: ngoProp }, ref) => {
  if (!donation) return null;
  
  // Handle different data structures
  const ngo = ngoProp || donation.ngo;
  const donorName = donation.donor?.name || donation.donorName || 'Anonymous';
  const email = donation.donor?.email || donation.email || 'N/A';
  const amount = donation.amount || 0;
  const paymentMethod = donation.paymentMethod || 'Card';
  const transactionId = donation.paymentId || donation.transactionId || 'N/A';
  const status = donation.status || 'completed';
  const date = donation.date || new Date().toISOString();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy hh:mm a');
    } catch (e) {
      return 'N/A';
    }
  };

  // Format pledge type for display
  const formatPledgeType = (type) => {
    if (!type) return 'One Time';
    
    // Handle different formats (e.g., 'ONE_TIME' or 'one-time')
    const formattedType = type.toLowerCase().replace('_', '-');
    
    switch(formattedType) {
      case 'one-time':
        return 'One Time';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'yearly':
        return 'Yearly';
      default:
        return type.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }
  };
  
  // Format payment method for display
  const formatPaymentMethod = (method) => {
    if (!method) return 'N/A';
    
    const formattedMethod = method.toLowerCase();
    
    switch(formattedMethod) {
      case 'credit_card':
      case 'credit card':
        return 'Credit Card';
      case 'debit_card':
      case 'debit card':
        return 'Debit Card';
      case 'netbanking':
      case 'net_banking':
        return 'Net Banking';
      case 'bank_transfer':
      case 'bank transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      case 'upi':
        return 'UPI';
      default:
        return method.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    }
  };

  // Function to handle receipt download
  const handleDownload = () => {
    const receiptContent = document.getElementById('donation-receipt');
    const opt = {
      margin: 0.5,
      filename: `donation-receipt-${donation.id || Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Import html2pdf only on client side
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().from(receiptContent).set(opt).save();
    });
  };

  return (
    <div ref={ref} id="donation-receipt" className="p-4">
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="mb-1">NGO Connect</h2>
            <p className="text-muted mb-0">Donation Receipt</p>
            <small className="text-muted">Official Tax-Deductible Receipt</small>
          </div>

          <hr className="my-4" />

          {/* Receipt Info */}
          <Row className="mb-4">
            <Col md={6}>
              <p className="mb-1"><strong>Receipt #:</strong> {donation.id || 'N/A'}</p>
              <p className="mb-1"><strong>Date:</strong> {formatDate(date)}</p>
              <p className="mb-1"><strong>Transaction ID:</strong> {transactionId}</p>
            </Col>
            <Col md={6} className="text-md-end">
              <p className="mb-1"><strong>Status:</strong> 
                <span className="badge bg-success ms-2">
                  {status.toUpperCase()}
                </span>
              </p>
              <p className="mb-1"><strong>Payment Method:</strong> 
                {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
              </p>
            </Col>
          </Row>

          {/* Donor and NGO Info */}
          <Row className="mb-4">
            <Col md={6}>
              <div className="bg-light p-3 rounded">
                <h6 className="border-bottom pb-2 mb-3">Donor Information</h6>
                <p className="mb-1"><strong>Name:</strong> {donorName}</p>
                <p className="mb-1"><strong>Email:</strong> {email}</p>
              </div>
            </Col>
            <Col md={6} className="mt-3 mt-md-0">
              <div className="bg-light p-3 rounded">
                <h6 className="border-bottom pb-2 mb-3">Beneficiary</h6>
                <p className="mb-1"><strong>NGO:</strong> {ngo?.name || ngo?.organization_name || 'N/A'}</p>
                <p className="mb-1"><strong>Cause:</strong> {ngo?.cause || 'Social Cause'}</p>
                <p className="mb-1"><strong>Location:</strong> {ngo?.location || 'N/A'}</p>
              </div>
            </Col>
          </Row>

          {/* Donation Summary */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Donation Summary</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2"><strong>Donation Amount:</strong></p>
                  <p className="mb-2"><strong>Payment Type:</strong></p>
                  <p className="mb-2"><strong>Payment Method:</strong></p>
                </div>
                <div className="col-md-6 text-end">
                  <p className="mb-2">₹{amount.toLocaleString('en-IN')}</p>
                  <p className="mb-2">{formatPledgeType(donation.pledgeType || 'one-time')}</p>
                  <p className="mb-2">{formatPaymentMethod(paymentMethod)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Details */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Description</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Donation to {ngo?.name || ngo?.organization_name || 'NGO'}</td>
                  <td className="text-end">₹{parseFloat(amount).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="text-end"><strong>Total Amount</strong></td>
                  <td className="text-end">
                    <strong>₹{parseFloat(amount).toLocaleString('en-IN')}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-top pt-3 mt-4 text-center text-muted small">
            <p className="mb-1">Thank you for your generous contribution!</p>
            <p className="mb-1">This is an official receipt for income tax purposes.</p>
            <p>NGO Connect is a registered 501(c)(3) non-profit organization. Tax ID: XX-XXXXXXX</p>
          </div>

          {/* Download Button */}
          <div className="text-center mt-4">
            <button 
              onClick={handleDownload} 
              className="btn btn-primary"
              style={{ minWidth: '200px' }}
            >
              <i className="bi bi-download me-2"></i>Download Receipt
            </button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
});

DonationReceipt.displayName = 'DonationReceipt';

export default DonationReceipt;
