import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import { createDonation } from "../../services/donationService";
import { processMockPayment } from "../../services/mockPaymentService";
import axios from "axios";

const DonationFormNew = ({ ngo, onBack, onSuccess }) => {
  const navigate = useNavigate();
  const [pledgeType, setPledgeType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState(800);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("netbanking");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const [donorDetails, setDonorDetails] = useState({
    name: "",
    email: "",
  });

  const quickAmounts = [800, 1200, 1600, 2400];

  // Load user data on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setDonorDetails({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, []);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
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
      toast.error("Please log in to make a donation");
      return false;
    }
    if (!email?.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please log in with a valid email address");
      return false;
    }
    return true;
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    console.log("Donate button clicked");

    // Check authentication status
    const currentUser = getCurrentUser();
    console.log("Current user:", currentUser);

    if (!currentUser || !currentUser.token) {
      console.error("No user token found in handleDonate");
      toast.error("Please log in to make a donation");
      return;
    }

    // Initialize toastId at the function scope
    let toastId;

    try {
      // Validate amount
      const finalAmount = getFinalAmount();
      console.log("Final amount:", finalAmount);

      if (finalAmount <= 0) {
        const errorMsg = "Please select or enter a valid amount";
        console.error(errorMsg);
        toast.error(errorMsg);
        return;
      }

      if (!validateForm()) {
        console.error("Form validation failed");
        return;
      }

      setIsSubmitting(true);
      toastId = toast.loading("Processing your donation...");
      console.log("Starting donation process...");
      console.log("Initial values:", {
        ngo,
        finalAmount,
        paymentMethod,
        pledgeType,
      });


      // Validate ngoId
      let ngoId = ngo?.id;
      if (!ngoId || isNaN(Number(ngoId))) {
        toast.error("Invalid NGO selected. Please try again.");
        setIsSubmitting(false);
        return;
      }
      ngoId = Number(ngoId);

      // Validate payment method
      const paymentMethodMap = {
        netbanking: "BANK_TRANSFER",
        card: "CREDIT_CARD",
        upi: "UPI",
      };
      const backendPaymentMethod = paymentMethodMap[paymentMethod] || "BANK_TRANSFER";
      const validPaymentMethods = ["BANK_TRANSFER", "CREDIT_CARD", "UPI"];
      if (!validPaymentMethods.includes(backendPaymentMethod)) {
        toast.error("Invalid payment method. Please select a valid option.");
        setIsSubmitting(false);
        return;
      }

      // Validate pledgeType
      const pledgeTypeMap = {
        "one-time": "ONE_TIME",
        "monthly": "MONTHLY",
        "quarterly": "QUARTERLY",
        "yearly": "YEARLY",
      };
      const backendPledgeType = pledgeTypeMap[pledgeType] || "ONE_TIME";
      const validPledgeTypes = ["ONE_TIME", "MONTHLY", "QUARTERLY", "YEARLY"];
      if (!validPledgeTypes.includes(backendPledgeType)) {
        toast.error("Invalid pledge type. Please select a valid option.");
        setIsSubmitting(false);
        return;
      }

      const donationData = {
        ngoId,
        amount: finalAmount,
        paymentMethod: backendPaymentMethod,
        pledgeType: backendPledgeType,
      };

      console.log("Donation data being sent (final):", donationData);
      console.log("NGO object:", ngo);

      const token = localStorage.getItem("token");
      const currentUser = getCurrentUser();

      console.log("Authentication check:");
      console.log("- Current user:", currentUser);
      console.log("- Token exists:", !!token);
      console.log(
        "- Token value:",
        token ? token.substring(0, 20) + "..." : "null"
      );

      if (!currentUser || !token) {
        throw new Error("Authentication required. Please log in first.");
      }

      const response = await axios.post(
        "http://localhost:8080/api/donations/process-dummy",
        donationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Dismiss the loading toast
      if (toastId) {
        toast.dismiss(toastId);
      }

      // On success, navigate to the receipt page and pass the response data
      toast.success("Processing donation...");
      navigate("/donation-receipt", { state: { receipt: response.data } });
    } catch (error) {
      console.error("Donation failed:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });

      // Dismiss any active toasts
      toast.dismiss();

      // Show specific error message based on status code
      let errorMessage = "Donation failed. Please try again.";

      if (error.response?.status === 403) {
        errorMessage = "Access denied. Please log in and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message.includes("Authentication required")) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
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
      toast.error("Please log in to make a donation");
      return;
    }

    // Validate amount
    const finalAmount = getFinalAmount();
    if (finalAmount <= 0) {
      toast.error("Please select or enter a valid amount");
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
      location: PropTypes.string,
    }),
    onBack: PropTypes.func,
    onSuccess: PropTypes.func,
  };

  DonationFormNew.defaultProps = {
    ngo: {},
    onBack: () => {},
    onSuccess: () => {},
  };

  // Add custom styles for the success toast
  useEffect(() => {
    const style = document.createElement("style");
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
                  <h2 className="h4 mb-1 fw-bold">
                    {ngo?.organization_name || "NGO"}
                  </h2>
                  <div className="d-flex align-items-center text-muted">
                    <i className="bi bi-geo-alt me-1"></i>
                    <span>{ngo?.location || "Location not specified"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-light p-3 rounded mb-4">
                <h5 className="text-uppercase text-muted mb-3">
                  About the Cause
                </h5>
                <p className="mb-0">
                  Support {ngo?.organization_name || "this NGO"} in their
                  mission to create positive change. Your contribution will help
                  make a difference in the lives of those in need.
                </p>
              </div>

              <div className="bg-light p-3 rounded">
                <h5 className="text-uppercase text-muted mb-3">
                  How Your Donation Helps
                </h5>
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
                We work in close coordination with government agencies at
                various levels - National, State, and District - to run child
                welfare projects. We aim to support and contribute towards
                building a better world where children can thrive and reach
                their full potential.
              </p>
              <p className="mb-0">
                Your donation will directly support our ongoing projects and
                help us reach more children in need. Every contribution, no
                matter how small, makes a significant impact in their lives.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Donation Form */}
        <div className="col-lg-5">
          <div
            className="card border-0 shadow-sm sticky-top"
            style={{ top: "20px" }}
          >
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
                        checked={pledgeType === "one-time"}
                        onChange={() => setPledgeType("one-time")}
                      />
                      <label
                        className="form-check-label w-100"
                        htmlFor="oneTime"
                      >
                        <div
                          className={`p-3 border rounded ${
                            pledgeType === "one-time"
                              ? "bg-success text-white"
                              : ""
                          }`}
                        >
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
                        checked={pledgeType === "monthly"}
                        onChange={() => setPledgeType("monthly")}
                      />
                      <label
                        className="form-check-label w-100"
                        htmlFor="monthly"
                      >
                        <div
                          className={`p-3 rounded text-center ${
                            pledgeType === "monthly"
                              ? "bg-success text-white"
                              : "border"
                          }`}
                        >
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
                    {quickAmounts.map((amount) => (
                      <div key={amount} className="col-4">
                        <button
                          type="button"
                          className={`btn w-100 ${
                            selectedAmount === amount
                              ? "btn-success"
                              : "btn-outline-success"
                          }`}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          ₹{amount}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Or enter a custom amount
                    </label>
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
                      { id: "netbanking", label: "Net Banking", icon: "bank" },
                      {
                        id: "card",
                        label: "Credit/Debit Card",
                        icon: "credit-card",
                      },
                      { id: "upi", label: "UPI", icon: "phone" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`list-group-item d-flex align-items-center p-3 ${
                          paymentMethod === method.id
                            ? "border-success bg-light"
                            : "border"
                        }`}
                        style={{
                          borderLeft:
                            paymentMethod === method.id
                              ? "3px solid #28a745"
                              : "3px solid transparent",
                        }}
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
                        {paymentMethod === method.id && (
                          <i className="bi bi-check-lg text-success"></i>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Donation Summary */}
                <div className="bg-light p-3 rounded-3 mb-4">
                  <h6 className="fw-bold mb-3">Donation Summary</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Donation Amount:</span>
                    <span className="fw-bold">
                      ₹{getFinalAmount().toLocaleString()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Payment Type:</span>
                    <span>
                      {pledgeType === "one-time" ? "One-time" : "Monthly"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Payment Method:</span>
                    <span className="text-capitalize">
                      {paymentMethod === "netbanking"
                        ? "Net Banking"
                        : paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : "UPI"}
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
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
