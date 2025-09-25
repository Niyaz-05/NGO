import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoAPI } from '../../services/api';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaDonate, 
  FaFileAlt, 
  FaCommentDots,
  FaHandsHelping,
  FaClipboardList
} from 'react-icons/fa';
import { 
  Tab, 
  Tabs, 
  Container, 
  Alert, 
  Spinner, 
  Button
} from 'react-bootstrap';

// Import components
import NGODonations from './NGODonations';
import ProfileTab from './ProfileTab';

// Tab components
const VolunteerNeedsTab = ({ ngoId }) => (
  <div className="py-3">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4>Volunteer Needs</h4>
      <Button variant="primary" size="sm">
        <FaClipboardList className="me-2" /> Add Need
      </Button>
    </div>
    <p>Manage your organization's volunteer opportunities here.</p>
  </div>
);

const ReportsTab = ({ ngoId }) => (
  <div className="py-3">
    <h4 className="mb-4">Reports</h4>
    <p>View and generate reports for your NGO's activities.</p>
  </div>
);

const FeedbackTab = ({ ngoId }) => (
  <div className="py-3">
    <h4 className="mb-4">Feedback</h4>
    <p>View and respond to feedback from volunteers and donors.</p>
  </div>
);

const NGODashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    address: '',
    
    // Registration Details
    registrationNumber: '',
    registrationId: '',
    
    // Organization Details
    description: '',
    location: '',
    website: '',
    
    // Point of Contact
    pointOfContactName: '',
    pointOfContactPhone: '',
    
    // Social Media
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    
    // Causes
    causes: []
  });

  // Check authentication and load profile on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!token || !userData) {
          navigate('/auth/select-login');
          return;
        }

        if (userData.role !== 'NGO') {
          setError('Access denied. This dashboard is for NGO users only.');
          setLoading(false);
          return;
        }

        setUser(userData);
        await loadProfile(userData);
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/select-login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Load profile data
  const loadProfile = async (storedUser) => {
    try {
      setLoading(true);
      
      if (!storedUser || !storedUser.email) {
        console.error('No user email found in localStorage');
        return;
      }
      
      // Get NGO profile data by email
      console.log('Fetching NGO profile for email:', storedUser.email);
      const ngoResponse = await ngoAPI.getByEmail(storedUser.email);
      console.log('NGO Profile Response:', ngoResponse);
      
      if (ngoResponse.status === 200 && ngoResponse.data) {
        const ngoData = ngoResponse.data;
        const profileData = {
          name: ngoData.organizationName || '',
          email: ngoData.email || storedUser.email || '',
          phone: ngoData.phone || '',
          address: ngoData.address || '',
          description: ngoData.description || '',
          website: ngoData.website || '',
          registrationNumber: ngoData.registrationNumber || '',
          registrationId: ngoData.registrationId || '',
          pointOfContactName: ngoData.pointOfContactName || '',
          pointOfContactPhone: ngoData.pointOfContactPhone || '',
          facebookUrl: ngoData.facebookUrl || '',
          instagramUrl: ngoData.instagramUrl || '',
          linkedinUrl: ngoData.linkedinUrl || '',
          causes: Array.isArray(ngoData.causes) ? ngoData.causes : 
                (ngoData.cause ? [ngoData.cause] : [])
        };
        
        setProfile(profileData);
      } else {
        console.error('No NGO data found in response');
        // Fallback to localStorage data if no data in response
        if (storedUser) {
          const fallbackData = {
            name: storedUser.name || '',
            email: storedUser.email || '',
            phone: storedUser.phone || '',
            address: storedUser.address || '',
            description: storedUser.description || '',
            website: storedUser.website || '',
            registrationNumber: storedUser.registrationNumber || '',
            registrationId: storedUser.registrationId || '',
            pointOfContactName: storedUser.pointOfContactName || '',
            pointOfContactPhone: storedUser.pointOfContactPhone || '',
            facebookUrl: storedUser.facebookUrl || '',
            instagramUrl: storedUser.instagramUrl || '',
            linkedinUrl: storedUser.linkedinUrl || '',
            causes: Array.isArray(storedUser.causes) ? storedUser.causes : 
                  (storedUser.cause ? [storedUser.cause] : [])
          };
          setProfile(fallbackData);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to localStorage data if API fails
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser) {
        const fallbackData = {
          name: storedUser.name || '',
          email: storedUser.email || '',
          phone: storedUser.phone || '',
          address: storedUser.address || '',
          description: storedUser.description || '',
          website: storedUser.website || '',
          registrationNumber: storedUser.registrationNumber || '',
          registrationId: storedUser.registrationId || '',
          pointOfContactName: storedUser.pointOfContactName || '',
          pointOfContactPhone: storedUser.pointOfContactPhone || '',
          facebookUrl: storedUser.facebookUrl || '',
          instagramUrl: storedUser.instagramUrl || '',
          linkedinUrl: storedUser.linkedinUrl || '',
          causes: Array.isArray(storedUser.causes) ? storedUser.causes : 
                (storedUser.cause ? [storedUser.cause] : [])
        };
        setProfile(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));
    
    // Update user data in local storage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({
      ...userData,
      ...updatedProfile
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/select-login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>NGO Dashboard</h2>
        <Button variant="outline-secondary" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Logout
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        id="ngo-dashboard-tabs"
      >
        <Tab eventKey="profile" title={<span><FaUser className="me-1" /> Profile</span>}>
          <ProfileTab 
            profile={profile} 
            user={user} 
            onUpdate={handleProfileUpdate} 
            setProfile={setProfile}
          />
        </Tab>
        <Tab eventKey="volunteer-needs" title={<span><FaHandsHelping className="me-1" /> Volunteer Needs</span>}>
          <VolunteerNeedsTab ngoId={user?.id} />
        </Tab>
        <Tab eventKey="donations" title={<span><FaDonate className="me-1" /> Donations</span>}>
          <NGODonations ngoId={user?.id} />
        </Tab>
        <Tab eventKey="reports" title={<span><FaFileAlt className="me-1" /> Reports</span>}>
          <ReportsTab ngoId={user?.id} />
        </Tab>
        <Tab eventKey="feedback" title={<span><FaCommentDots className="me-1" /> Feedback</span>}>
          <FeedbackTab ngoId={user?.id} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default NGODashboard;
