import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaUsers,
  FaSave,
  FaVenusMars,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import DonationHistory from "../donation/DonationHistory";
import VolunteerHistory from "../volunteer/VolunteerHistory";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    location: "",
    bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserData({
          name: user.name || user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "",
          age: user.age || "",
          location: user.location || "",
          bio: user.bio || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating user data:", userData);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        ...userData,
        fullName: userData.name,
      })
    );

    setIsEditing(false);
  };

  const renderProfileForm = () => {
    return isEditing ? (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaEnvelope className="text-muted" />
            </span>
            <input
              type="email"
              className="form-control"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled
            />
          </div>
          <small className="text-muted">Email cannot be changed</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaPhone className="text-muted" />
            </span>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-select"
            name="gender"
            value={userData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            name="age"
            value={userData.age}
            onChange={handleInputChange}
            placeholder="Enter your age"
            min="1"
            max="120"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <div className="input-group">
            <span className="input-group-text">
              <FaMapMarkerAlt className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control"
              name="location"
              value={userData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            rows="4"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FaSave className="me-2" />
            Save Changes
          </button>
        </div>
      </form>
    ) : (
      <div className="profile-details">
        <div className="mb-4">
          <h5 className="text-muted mb-4">Personal Information</h5>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 text-muted">
              <FaUser size={20} />
            </div>
            <div>
              <div className="text-muted small">Full Name</div>
              <div className="fw-medium">{userData.name || "Not provided"}</div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 text-muted">
              <FaEnvelope size={20} />
            </div>
            <div>
              <div className="text-muted small">Email Address</div>
              <div className="fw-medium">
                {userData.email || "Not provided"}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 text-muted">
              <FaPhone size={20} />
            </div>
            <div>
              <div className="text-muted small">Phone Number</div>
              <div className="fw-medium">
                {userData.phone || "Not provided"}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 text-muted">
              <FaVenusMars size={20} />
            </div>
            <div>
              <div className="text-muted small">Gender</div>
              <div className="fw-medium">
                {userData.gender || "Not provided"}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 text-muted">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <div className="text-muted small">Age</div>
              <div className="fw-medium">{userData.age || "Not provided"}</div>
            </div>
          </div>
          <div className="d-flex align-items-center mb-4">
            <div className="me-3 text-muted">
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <div className="text-muted small">Location</div>
              <div className="fw-medium">
                {userData.location || "Not provided"}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-start">
            <div className="me-3 text-muted pt-1">
              <FaInfoCircle size={20} />
            </div>
            <div>
              <div className="text-muted small">Bio</div>
              <div className="fw-medium">
                {userData.bio || "No bio provided"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 100px)" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="mb-4">
              <FaUser className="me-2 text-primary" />
              User Dashboard
            </h2>

            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <FaUser className="me-2" />
                  Profile
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "donations" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("donations")}
                >
                  <FaHeart className="me-2" />
                  Donation History
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "volunteering" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("volunteering")}
                >
                  <FaUsers className="me-2" />
                  Volunteering History
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {activeTab === "profile" && (
                <div className="card shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="h5 mb-0">
                        <FaUser className="me-2 text-primary" />
                        My Profile
                      </h3>
                      {!isEditing && (
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="card-body p-4">{renderProfileForm()}</div>
                </div>
              )}

              {activeTab === "donations" && (
                <div className="card shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h3 className="h5 mb-0">
                      <FaHeart className="me-2 text-primary" />
                      Donation History
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <DonationHistory userId={userId} />
                  </div>
                </div>
              )}

              {activeTab === "volunteering" && (
                <div className="card shadow-sm">
                  <div className="card-header bg-white border-bottom-0 pt-4">
                    <h3 className="h5 mb-0">
                      <FaUsers className="me-2 text-primary" />
                      Volunteering History
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <VolunteerHistory userId={userId} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
