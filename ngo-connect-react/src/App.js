import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

// Import components
// Import only what's needed
import Home from "./components/Home";
import SelectLogin from "./components/auth/SelectLogin";
import NGOLogin from "./components/auth/NGOLogin";
import AdminLogin from "./components/auth/AdminLogin";
import NGORegister from "./components/auth/NGORegister";
import DonorRegister from "./components/auth/DonorRegister";
import VolunteerRegister from "./components/auth/VolunteerRegister";
import AdminRegister from "./components/auth/AdminRegister";
import NGODirectory from "./components/directory/NGODirectory";
import NGORegisterForm from "./components/directory/NGORegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import NGOProfile from "./components/directory/NGOProfile";
import WomenEmpowerment from "./components/directory/WomenEmpowerment";
import Healthcare from "./components/directory/Healthcare";
import Education from "./components/directory/Education";
import Environment from "./components/directory/Environment";
import DisasterRelief from "./components/directory/DisasterRelief";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import NGOManagement from "./components/admin/NGOManagement";
import UserManagement from "./components/admin/UserManagement";
import DonationOversight from "./components/admin/DonationOversight";
import VolunteerOversight from "./components/admin/VolunteerOversight";
import DonorDashboard from "./components/dashboards/DonorDashboard";
import VolunteerDashboard from "./components/dashboards/VolunteerDashboard";
// Import the NGODashboard component
import NGODashboard from "./components/dashboards/NGODashboard";
import CampaignDetail from "./components/campaigns/CampaignDetail";
import VolunteerEvents from "./components/events/VolunteerEvents";
import JoinEvent from "./components/events/JoinEvent";
import Ledger from "./components/transparency/Ledger";
import TransparencyPage from "./components/transparency/TransparencyPage";
import UserLogin from "./components/auth/UserLogin";
import UserRegister from "./components/auth/UserRegister";
import UserChoice from "./components/auth/UserChoice";
import DonationPage from "./components/donation/DonationPage";
import DonationReceipt from "./components/donation/DonationReceipt";
import VolunteerPage from "./components/volunteer/VolunteerPage";
import UserDashboard from "./components/dashboards/UserDashboard";
import ConditionalNavbar from "./components/ConditionalNavbar";

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <ConditionalNavbar />
        <div className="app-container flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Auth Routes */}
            <Route path="/auth/select-login" element={<SelectLogin />} />
            <Route path="/auth/ngo-login" element={<NGOLogin />} />
            <Route path="/auth/admin-login" element={<AdminLogin />} />

            {/* Registration Routes */}
            <Route path="/auth/ngo-register" element={<NGORegister />} />
            <Route path="/auth/donor-register" element={<DonorRegister />} />
            <Route
              path="/auth/volunteer-register"
              element={<VolunteerRegister />}
            />
            <Route path="/auth/admin-register" element={<AdminRegister />} />

            {/* Directory Routes */}
            <Route
              path="/directory/ngo-directory"
              element={
                <ProtectedRoute>
                  <NGODirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/directory/ngo-register"
              element={
                <ProtectedRoute>
                  <NGORegisterForm />
                </ProtectedRoute>
              }
            />
            <Route path="/directory/ngo-profile" element={<NGOProfile />} />
            <Route
              path="/directory/women-empowerment"
              element={<WomenEmpowerment />}
            />
            <Route path="/directory/healthcare" element={<Healthcare />} />
            <Route path="/directory/education" element={<Education />} />
            <Route path="/directory/environment" element={<Environment />} />
            <Route
              path="/directory/disaster-relief"
              element={<DisasterRelief />}
            />

            {/* Dashboard Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/dashboards/admin-dashboard"
              element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/ngo-management"
              element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                  <NGOManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                  <DonationOversight />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/volunteer-opportunities"
              element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                  <VolunteerOversight />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin/user-management"
              element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                  <UserManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/donations"
              element={
                <RoleProtectedRoute roles={["ADMIN"]}>
                  <DonationOversight />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/donor-dashboard"
              element={
                <RoleProtectedRoute roles={["DONOR"]}>
                  <DonorDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/ngo-dashboard"
              element={
                <RoleProtectedRoute roles={["NGO", "ADMIN"]}>
                  <NGODashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/volunteer-dashboard"
              element={
                <RoleProtectedRoute roles={["VOLUNTEER"]}>
                  <VolunteerDashboard />
                </RoleProtectedRoute>
              }
            />

            {/* Legacy dashboard routes - redirect to new paths */}
            <Route
              path="/dashboards/ngo-dashboard"
              element={
                <RoleProtectedRoute roles={["NGO"]}>
                  <NGODashboard />
                </RoleProtectedRoute>
              }
            />

            {/* Campaign Routes */}
            <Route
              path="/campaigns/campaign-detail"
              element={<CampaignDetail />}
            />

            {/* Event Routes */}
            <Route
              path="/events/volunteer-events"
              element={<VolunteerEvents />}
            />
            <Route path="/events/join-event" element={<JoinEvent />} />

            {/* Transparency Routes */}
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/transparency/ledger" element={<Ledger />} />

            {/* User Management Routes */}
            <Route path="/auth/user-login" element={<UserLogin />} />
            <Route path="/auth/user-register" element={<UserRegister />} />
            <Route path="/auth/user-choice" element={<UserChoice />} />

            {/* Feature Pages */}
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/donation-receipt" element={<DonationReceipt />} />
            <Route path="/volunteer" element={<VolunteerPage />} />

            {/* User Dashboard */}
            <Route
              path="/user-dashboard"
              element={
                <RoleProtectedRoute roles={["USER", "ADMIN"]}>
                  <UserDashboard />
                </RoleProtectedRoute>
              }
            />

            {/* 404 Route - Keep this last */}
            <Route
              path="*"
              element={
                <div className="container py-5 text-center">
                  <h1>404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
