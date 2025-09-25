import React from 'react';
import RegisterForm from './RegisterForm';

const UserRegister = () => {
  return (
    <RegisterForm
      userType="user"
      title="User Registration"
      loginLink="/auth/user-login"
    />
  );
};

export default UserRegister;

