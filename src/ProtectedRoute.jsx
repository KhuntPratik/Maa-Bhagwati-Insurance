import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthorized = localStorage.getItem("isAuthorized") === "true";

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;