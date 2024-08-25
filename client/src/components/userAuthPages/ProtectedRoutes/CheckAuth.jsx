import React from 'react'
import { Navigate } from 'react-router-dom'

export default function CheckAuth({isAuthenticated, children}) {
  return isAuthenticated ? <Navigate to="/dashboard"/> : children
}
