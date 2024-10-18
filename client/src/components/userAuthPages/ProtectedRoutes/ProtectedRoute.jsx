import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function ProtectedRoute({  children }) {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  const user = useSelector(state => state.user)
  if (!isAuthenticated) {
    console.log("login")
    return <Navigate to='/login' />
  }
  else if (isAuthenticated && !user?.user.activated) {
    // console.log('User:', user);
    // console.log('User Activated:', user?.activated, typeof user?.activated);
    return <Navigate to='/login' />;
  }
  else {
    console.log("children")
    return children
  }
}