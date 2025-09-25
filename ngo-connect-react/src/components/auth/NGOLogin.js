import React from 'react';
import LoginForm from './LoginForm';

const NGOLogin = () => {
  return (
    <LoginForm
      userType="ngo"
      title="NGO Login"
      registerLink="/auth/ngo-register"
      dashboardLink="/dashboards/ngo-dashboard"
    />
  );
};

export default NGOLogin;
