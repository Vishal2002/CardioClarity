import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-300 flex items-center justify-center">
      <Outlet /> {/* This renders the Signup/Signin components */}
    </div>
  );
};

export default AuthLayout;
