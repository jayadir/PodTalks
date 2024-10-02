import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function CheckAuthentication({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user);
  if (!isAuthenticated || (isAuthenticated && !user?.activated)) {
    console.log("login");
    return children;
  }
  // else if(isAuthenticated && !user?.activated){
  //   return children
  // }
  else {
    <Navigate to="/dashboard" />;
  }
}
