import React from 'react';
import LoginForm from './LoginForm';

const DonorLogin = () => {
  return (
    <LoginForm
      userType="donor"
      title="Donor Login"
      registerLink="/auth/donor-register"
      dashboardLink="/auth/user-choice"
    />
  );
};

export default DonorLogin;
