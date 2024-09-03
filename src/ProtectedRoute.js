import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from './UserAuth'; // Adjust the import based on your file structure

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user } = useUserAuth(); // Assuming user contains authentication info

  return user ? Component : <Navigate to="/signin" />;
};

export default ProtectedRoute;
