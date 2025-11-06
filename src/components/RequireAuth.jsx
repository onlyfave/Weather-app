import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth?.user) {
    // redirect to sign-in, preserving location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return children;
}
