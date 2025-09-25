import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserChoice = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%)",
        minHeight: "100vh",
        padding: "0",
      }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            {/* Welcome Header */}
            <div className="text-center mb-5">
              <div
                className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "100px",
                  height: "100px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                <i
                  className="bi bi-person-check-fill text-success"
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>
              <h2 className="display-4 fw-bold text-white mb-3">
                Welcome
                {user ? `, ${user.name || user.email?.split("@")[0]}` : ""}!
              </h2>
              <p
                className="lead text-white mb-0"
                style={{ fontSize: "1.2rem", opacity: 0.9 }}
              >
                Thank you for joining our mission to make a difference. Choose
                how you'd like to contribute to positive change in your
                community.
              </p>
            </div>

            {/* Action Cards */}
            <div className="row g-4">
              {/* Donate Card */}
              <div className="col-md-6">
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{
                    transition: "all 0.3s ease",
                    borderRadius: "15px",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.closest(".card").style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.closest(".card").style.transform = "scale(1)")
                  }
                >
                  <div className="card-body p-5 text-center">
                    <div
                      className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i
                        className="bi bi-heart-fill text-danger"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                    </div>
                    <h4
                      className="card-title fw-bold mb-3"
                      style={{ color: "#333" }}
                    >
                      Make a Donation
                    </h4>
                    <p
                      className="text-muted mb-4"
                      style={{ fontSize: "1rem", lineHeight: "1.6" }}
                    >
                      Support causes you care about with a financial
                      contribution. Your donation, no matter the size, can make
                      a real impact in someone's life.
                    </p>
                    <Link
                      to="/donate"
                      className="btn btn-danger btn-lg px-5 py-3 shadow-sm"
                      style={{
                        borderRadius: "25px",
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <i className="bi bi-heart me-2"></i>Donate Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Volunteer Card */}
              <div className="col-md-6">
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{
                    transition: "all 0.3s ease",
                    borderRadius: "15px",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.closest(".card").style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.closest(".card").style.transform = "scale(1)")
                  }
                >
                  <div className="card-body p-5 text-center">
                    <div
                      className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i
                        className="bi bi-people-fill text-success"
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                    </div>
                    <h4
                      className="card-title fw-bold mb-3"
                      style={{ color: "#333" }}
                    >
                      Volunteer
                    </h4>
                    <p
                      className="text-muted mb-4"
                      style={{ fontSize: "1rem", lineHeight: "1.6" }}
                    >
                      Give your time and skills to help NGOs achieve their
                      missions. Find volunteer opportunities that match your
                      interests and availability.
                    </p>
                    <Link
                      to="/volunteer"
                      className="btn btn-success btn-lg px-5 py-3 shadow-sm"
                      style={{
                        borderRadius: "25px",
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <i className="bi bi-people me-2"></i>Find Opportunities
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Login */}
            <div className="text-center mt-5">
              <Link
                to="/auth/select"
                className="btn btn-outline-light btn-sm px-4"
                style={{
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  opacity: 0.8,
                  border: "1px solid rgba(255,255,255,0.6)",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>Back to Login Selection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChoice;
