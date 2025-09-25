import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const LoginForm = ({ userType, title, registerLink, dashboardLink }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure userType is properly formatted (should be 'user' for regular users)
      const formattedUserType = userType === 'user' ? 'USER' : userType.toUpperCase();
      
      const payload = {
        email: formData.email,
        password: formData.password,
        userType: formattedUserType
      };

      console.log('Sending login request with:', payload);
      const response = await authAPI.login(payload);
      console.log('Raw login response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
      
      if (response && response.data) {
        const { data } = response;
        console.log('Login data received:', {
          userType: data.userType,
          role: data.role,
          id: data.id,
          email: data.email
        });
        
        if (!data.token) {
          throw new Error('No authentication token received');
        }

        // Store the JWT token
        localStorage.setItem('token', data.token);
        console.log('JWT token stored');
        
        // Log the raw data we received
        console.log('Raw user data from backend:', {
          id: data.id,
          userId: data.userId,
          email: data.email,
          userType: data.userType,
          role: data.role,
          fullName: data.fullName,
          name: data.name
        });

        // Prepare user data with fallbacks
        const user = {
          id: data.id || data.userId,
          email: data.email,
          name: data.fullName || data.name || formData.email.split('@')[0],
          // Use the role from backend, fallback to userType, then to 'USER'
          role: (data.role || data.userType || 'USER').toUpperCase(),
          organizationName: data.organizationName || data.orgName || '',
          token: data.token // Store token in user object for convenience
        };
        
        // Ensure role is one of the expected values
        const validRoles = ['USER', 'DONOR', 'VOLUNTEER', 'NGO', 'ADMIN'];
        if (!validRoles.includes(user.role)) {
          console.warn(`Unexpected role: ${user.role}. Defaulting to USER`);
          user.role = 'USER';
        }
        
        // Debug the final user object
        console.log('Final user object before redirect:', user);

        // If this is an NGO user, store the NGO ID
        if (user.role === 'NGO' && !user.ngoId) {
          user.ngoId = data.id;
        }

        console.log('Processed user data:', user);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Store NGO profile data if available
        if (user.role === 'NGO' && data.ngoProfile) {
          localStorage.setItem('ngoProfile', JSON.stringify(data.ngoProfile));
          console.log('NGO profile data stored');
        }
        
        // Log the user's role and current path for debugging
        console.log('User role after login:', user.role);
        console.log('Current path:', window.location.pathname);

        // Always redirect to user-choice page after login
        const redirectPath = '/auth/user-choice';
        console.log('Redirecting to:', redirectPath);
        
        // Clear any existing navigation state
        window.history.replaceState({}, '', redirectPath);
        
        // Force a hard redirect to ensure navigation
        window.location.href = redirectPath;
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Login failed. Please check your credentials and try again.';
      alert(errorMessage);
    }
  };

  const getButtonColor = () => {
    switch (userType) {
      case 'ngo': return 'btn-success';
      case 'user': return 'btn-success';
      case 'donor': return 'btn-success';
      case 'volunteer': return 'btn-success';
      case 'admin': return 'btn-dark';
      default: return 'btn-success';
    }
  };

  const getBackgroundStyle = () => {
    if (userType === 'donor' || userType === 'volunteer') {
      return {
        background: "white",
        minHeight: "100vh"
      };
    }
    return {
      background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
      minHeight: "100vh"
    };
  };

  return (
    <div style={getBackgroundStyle()}>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="bg-white bg-opacity-75 p-5 rounded shadow" style={{minWidth: "300px", maxWidth: "400px"}}>
          <h2 className="text-center mb-4">{title}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="d-grid">
              <button type="submit" className={`btn ${getButtonColor()}`}>
                Login
              </button>
            </div>
          </form>
          
          <div className="text-center mt-3">
            <p>Don't have an account? <Link to={registerLink}>Register here</Link></p>
            <Link to="/auth/select-login" className="btn btn-outline-secondary btn-sm">
              Back to Role Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
