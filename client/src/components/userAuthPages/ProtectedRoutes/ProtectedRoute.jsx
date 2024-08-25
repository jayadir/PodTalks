import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ isAuthenticated, children,user }) {
  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }
  else if (isAuthenticated && !user?.activated) {
    return <Navigate to='/activate' />
  }
  else {
    return children
  }
}