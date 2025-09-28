import React, { useState, useEffect } from "react";
import axios from "axios";

const FundReportsList = ({ ngoId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!ngoId) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/transparency/reports/ngo/${ngoId}`
        );
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch fund reports:", error);
        setLoading(false);
      }
    };
    fetchReports();
  }, [ngoId]);

  if (loading) return <p>Loading transparency reports...</p>;
  if (!reports || reports.length === 0)
    return (
      <p>No fund utilization reports have been submitted by this NGO yet.</p>
    );

  return (
    <div className="mt-4">
      <h4>Fund Utilization Reports</h4>
      {reports.map((report) => (
        <div key={report.id} className="card mb-3">
          <div className="card-header">
            Report for Date:{" "}
            <strong>{new Date(report.reportDate).toLocaleDateString()}</strong>
          </div>
          <div className="card-body">
            <p>
              <strong>Total Funds Received:</strong> $
              {Number(report.totalFundsReceived).toLocaleString()}
            </p>
            <p>
              <strong>Total Funds Spent:</strong> $
              {Number(report.totalFundsSpent).toLocaleString()}
            </p>
            <p>
              <strong>Remaining Balance:</strong> $
              {Number(
                report.totalFundsReceived - report.totalFundsSpent
              ).toLocaleString()}
            </p>
            <h6>Breakdown:</h6>
            <pre style={{ whiteSpace: "pre-wrap" }}>{report.breakdown}</pre>
          </div>
          <div className="card-footer text-muted">
            Submitted on: {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FundReportsList;
