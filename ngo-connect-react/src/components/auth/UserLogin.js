import React from 'react';
import LoginForm from './LoginForm';

const UserLogin = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">User Login</h2>
              <LoginForm
                userType="user"
                title="User Login"
                registerLink="/auth/user-register"
                dashboardLink="/user-dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

