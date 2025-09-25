import React from 'react';
import RegisterForm from './RegisterForm';

const VolunteerRegister = () => {
  return (
    <RegisterForm
      userType="volunteer"
      title="Volunteer Registration"
      loginLink="/auth/user-login"
    />
  );
};

export default VolunteerRegister;
