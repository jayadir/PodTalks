import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
export default function CheckAuth({ children}) {
  const isAuthenticated= useSelector(state => state.user.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard"/> : children
}
