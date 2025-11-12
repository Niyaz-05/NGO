import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CreateFundReport = ({ ngoId, onReportCreated }) => {
  const [reportDate, setReportDate] = useState("");
  const [totalFundsReceived, setTotalFundsReceived] = useState("");
  const [totalFundsSpent, setTotalFundsSpent] = useState("");
  const [breakdown, setBreakdown] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reportData = {
      reportDate,
      totalFundsReceived,
      totalFundsSpent,
      breakdown,
    };

    try {
      await axios.post(
        `http://localhost:8080/api/transparency/reports/ngo/${ngoId}`,
        reportData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Fund utilization report submitted successfully!");
      if (onReportCreated) onReportCreated(); // Refresh the list of reports
      // Clear form
      setReportDate("");
      setTotalFundsReceived("");
      setTotalFundsSpent("");
      setBreakdown("");
    } catch (error) {
      toast.error("Failed to submit report. Please check the details.");
    }
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header">
        <h6 className="m-0">Submit New Fund Utilization Report</h6>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Report Date</label>
            <input
              type="date"
              className="form-control"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Total Funds Received (₹)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={totalFundsReceived}
              onChange={(e) => setTotalFundsReceived(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Total Funds Spent (₹)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={totalFundsSpent}
              onChange={(e) => setTotalFundsSpent(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Breakdown of Spending</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="e.g., Education: ₹5000, Health Camps: ₹3000, Admin: ₹1000"
              value={breakdown}
              onChange={(e) => setBreakdown(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFundReport;
