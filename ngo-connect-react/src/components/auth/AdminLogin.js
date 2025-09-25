import React from 'react';
import LoginForm from './LoginForm';

const AdminLogin = () => {
  return (
    <LoginForm
      userType="admin"
      title="Admin Login"
      registerLink="/auth/admin-register"
      dashboardLink="/dashboards/admin-dashboard"
    />
  );
};

export default AdminLogin;
