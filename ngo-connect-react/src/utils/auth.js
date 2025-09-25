// Helper function to get logged in user data
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('Retrieved from localStorage - user:', userStr ? 'exists' : 'not found');
    console.log('Retrieved from localStorage - token:', token ? 'exists' : 'not found');
    
    if (!userStr || !token) {
      console.error('Missing user or token in localStorage');
      return null;
    }
    
    const userData = JSON.parse(userStr);
    const user = {
      ...userData,
      token: token // Ensure token is included in user object
    };
    
    console.log('Current user data:', user);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
