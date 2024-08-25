import React from 'react'
import { Navigate } from 'react-router-dom'

export default function IntermediateProtectedRoute({children,isAuthenticated,user}) {
  if(!isAuthenticated){
    <Navigate to='/login'/>
  }
  else if(isAuthenticated && !user?.activated){
    return children
  }
  else{
    <Navigate to='/dashboard'/>
  }
}
