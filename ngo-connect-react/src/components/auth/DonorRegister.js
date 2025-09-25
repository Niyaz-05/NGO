import React from 'react';
import RegisterForm from './RegisterForm';

const DonorRegister = () => {
  return (
    <RegisterForm
      userType="donor"
      title="Donor Registration"
      loginLink="/auth/user-login"
    />
  );
};

export default DonorRegister;
