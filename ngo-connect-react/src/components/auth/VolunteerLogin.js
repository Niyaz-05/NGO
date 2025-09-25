import React from 'react';
import LoginForm from './LoginForm';

const VolunteerLogin = () => {
  return (
    <LoginForm
      userType="volunteer"
      title="Volunteer Login"
      registerLink="/auth/volunteer-register"
      dashboardLink="/auth/user-choice"
    />
  );
};

export default VolunteerLogin;
