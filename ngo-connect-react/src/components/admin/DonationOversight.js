import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const DonationOversight = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/api/admin/donations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDonations(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch donations.");
        console.error("Fetch Donations Error:", error);
        setLoading(false);
      }
    };
    fetchDonations();
  }, [token]);

  if (loading) {
    return <p className="text-center">Loading all donations...</p>;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">
          <i className="bi bi-cash-stack me-2"></i>Donation Oversight
        </h6>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Donor Name</th>
                <th>NGO Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.id}</td>
                  <td>{donation.donorName || "N/A"}</td>
                  <td>
                    {donation.ngo ? donation.ngo.organizationName : "N/A"}
                  </td>
                  <td>${donation.amount.toFixed(2)}</td>
                  <td>
                    <span className="badge bg-success">{donation.status}</span>
                  </td>
                  <td>
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationOversight;
