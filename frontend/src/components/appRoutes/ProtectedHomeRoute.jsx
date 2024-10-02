// ProtectedRoute.js
import { useAuthContext } from "@/hooks/useAuth/useAuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedHomeRoute = ({ children }) => {
  const { isLoggedIn } = useAuthContext();

  // If the user is not authenticated, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  // If the user is authenticated, render the children
  return children;
};

export default ProtectedHomeRoute;
