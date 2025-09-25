import React from 'react';

const Ledger = () => {
  const transactions = [
    {
      id: 1,
      date: '2024-01-15',
      description: 'Donation - Women Empowerment Campaign',
      amount: 1000,
      type: 'credit',
      donor: 'Anonymous',
      ngo: 'Women Empowerment Foundation'
    },
    {
      id: 2,
      date: '2024-01-14',
      description: 'Donation - Healthcare Initiative',
      amount: 500,
      type: 'credit',
      donor: 'John Doe',
      ngo: 'Healthcare Access Initiative'
    },
    {
      id: 3,
      date: '2024-01-13',
      description: 'Platform Fee',
      amount: 50,
      type: 'debit',
      donor: 'System',
      ngo: 'Platform'
    },
    {
      id: 4,
      date: '2024-01-12',
      description: 'Donation - Education Drive',
      amount: 2000,
      type: 'credit',
      donor: 'Jane Smith',
      ngo: 'Rural Education Trust'
    }
  ];

  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalCredits - totalDebits;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Financial Ledger</h1>
    

      {/* Transactions Table */}
      <div className="card">
        <div className="card-header">
          <h5>Recent Transactions</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Donor</th>
                  <th>NGO</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.donor}</td>
                    <td>{transaction.ngo}</td>
                    <td className={transaction.type === 'credit' ? 'text-success' : 'text-danger'}>
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge bg-${transaction.type === 'credit' ? 'success' : 'danger'}`}>
                        {transaction.type.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Transparency Note */}
      <div className="card mt-4">
        <div className="card-body">
          <h5>Transparency Commitment</h5>
          <p>
            We are committed to complete transparency in all financial transactions. 
            Every donation, fee, and transfer is recorded and publicly available. 
            Our platform fee is 5% of each donation, which helps us maintain and 
            improve the platform for all users.
          </p>
          <div className="row">
            <div className="col-md-6">
              <h6>Platform Fees Breakdown:</h6>
              <ul>
                <li>Payment Processing: 2%</li>
                <li>Platform Maintenance: 2%</li>
                <li>Support Services: 1%</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Verification Process:</h6>
              <ul>
                <li>All NGOs are verified</li>
                <li>Regular audits conducted</li>
                <li>Real-time transaction tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
