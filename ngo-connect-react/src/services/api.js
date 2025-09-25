import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('No Response Received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Skip adding auth header for registration and other public endpoints
    const isPublicEndpoint = [
      '/auth/register',
      '/auth/login',
      '/auth/verify-email'
    ].some(endpoint => config.url.endsWith(endpoint));

    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Add timestamp to prevent caching of authenticated requests
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: new Date().getTime()
        };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token if refresh token is available
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
          const { token, user } = response.data;
          
          // Store the new token
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If we get here, token refresh failed or no refresh token
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/auth/select-login')) {
        window.location.href = '/auth/select-login';
      }
    }
    
    // For other errors, just reject with the error
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyEmail: (email) => api.post('/auth/verify-email', null, { params: { email } }),
  getUserProfile: () => api.get('/auth/user-profile'),
};

// NGO API
export const ngoAPI = {
  // Get NGO profile by ID
  getProfile: async (id) => {
    const response = await api.get(`/ngos/${id}/profile`);
    return response.data;
  },
  getAll: async () => {
    try {
      console.log('Fetching all NGOs...');
      const response = await api.get('/ngos');
      console.log('NGOs fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      console.log(`Fetching NGO with ID: ${id}...`);
      const response = await api.get(`/ngos/${id}`);
      console.log(`NGO ${id} fetched successfully:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching NGO ${id}:`, error);
      throw error;
    }
  },
  getByOrganizationName: async (organizationName) => {
    try {
      console.log(`Looking up NGO by organization name: ${organizationName}...`);
      const response = await api.get('/ngos/by-organization', { params: { organizationName } });
      console.log('NGO lookup by organization name response:', response.data);
      return response;
    } catch (error) {
      console.error(`Error looking up NGO by organization name ${organizationName}:`, error);
      throw error;
    }
  },
  
  getByEmail: async (email) => {
    try {
      console.log(`Looking up NGO by email: ${email}...`);
      const response = await api.get('/ngos/by-email', { params: { email } });
      console.log('NGO lookup by email response:', response.data);
      return response;
    } catch (error) {
      console.error(`Error looking up NGO by email ${email}:`, error);
      throw error;
    }
  },
  create: async (ngo) => {
    try {
      console.log('Creating new NGO:', ngo);
      const response = await api.post('/ngos', ngo);
      console.log('NGO created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating NGO:', error);
      throw error;
    }
  },
  update: async (id, ngo) => {
    try {
      console.log(`Updating NGO ${id}:`, ngo);
      const response = await api.put(`/ngos/${id}`, ngo);
      console.log(`NGO ${id} updated successfully:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error updating NGO ${id}:`, error);
      throw error;
    }
  },
  getDonations: async (id) => {
    try {
      console.log(`Fetching donations for NGO ${id}...`);
      const response = await api.get(`/ngos/${id}/donations`);
      console.log(`Donations for NGO ${id}:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching donations for NGO ${id}:`, error);
      throw error;
    }
  },
  getFundReports: async (id) => {
    try {
      console.log(`Fetching fund reports for NGO ${id}...`);
      const response = await api.get(`/ngos/${id}/fund-reports`);
      console.log(`Fund reports for NGO ${id}:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching fund reports for NGO ${id}:`, error);
      throw error;
    }
  },
  createFundReport: async (id, report) => {
    try {
      console.log(`Creating fund report for NGO ${id}:`, report);
      const response = await api.post(`/ngos/${id}/fund-reports`, report);
      console.log('Fund report created successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error creating fund report for NGO ${id}:`, error);
      throw error;
    }
  },
  getOpportunities: async (id) => {
    try {
      console.log(`Fetching volunteer opportunities for NGO ${id}...`);
      const response = await api.get(`/ngos/${id}/opportunities`);
      console.log(`Volunteer opportunities for NGO ${id}:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching volunteer opportunities for NGO ${id}:`, error);
      throw error;
    }
  },
  createOpportunity: (id, data) => api.post(`/ngos/${id}/opportunities`, data),
  updateOpportunity: (ngoId, oppId, data) => api.put(`/ngos/${ngoId}/opportunities/${oppId}`, data),
  deleteOpportunity: (ngoId, oppId) => api.delete(`/ngos/${ngoId}/opportunities/${oppId}`),
  search(filters = {}) {
    return api.get('/ngos/search', { 
      params: {
        ...filters,
        _t: new Date().getTime() // Prevent caching
      } 
    });
  },
  getCauses() {
    return api.get('/ngos/causes', { 
      params: { _t: new Date().getTime() } // Prevent caching
    });
  },
  getLocations() {
    return api.get('/ngos/locations', { 
      params: { _t: new Date().getTime() } // Prevent caching
    });
  },
  getUrgencyLevels() {
    return Promise.resolve({
      data: ['High', 'Medium', 'Low']
    });
  }
};

// Donation API
export const donationAPI = {
  create: (donationData) => api.post('/donations', donationData),
  getUserDonations: (userId) => api.get(`/donations/user/${userId}`),
  getNGODonations(ngoId) {
    return api.get(`/donations/ngo/${ngoId}`);
  }
};

// Volunteer API
export const volunteerAPI = {
  getOpportunities: () => api.get('/opportunities'),
  getOpportunityById: (id) => api.get(`/opportunities/${id}`),
  searchOpportunities: (filters) => api.get('/opportunities/search', { params: filters }),
  applyForOpportunity: (opportunityId, applicationData) => 
    api.post(`/opportunities/${opportunityId}/apply`, applicationData),
  getUserApplications: (userId) => api.get(`/applications/user/${userId}`),
};

export default api;
