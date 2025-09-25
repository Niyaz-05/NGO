import React from 'react';
import RegisterForm from './RegisterForm';

const NGORegister = () => {
  return (
    <RegisterForm
      userType="ngo"
      title="NGO Registration"
      loginLink="/auth/ngo-login"
    />
  );
};

export default NGORegister;
