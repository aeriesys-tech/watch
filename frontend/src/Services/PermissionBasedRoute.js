// src/Services/PermissionBasedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./authService";
import { hasPermission } from "./authUtils";

const PermissionBasedRoute = ({ children, requiredPermissions = [] }) => {
  // const isAuth = isAuthenticated();

  // if (!isAuth) {
  //   return <Navigate to="/auth/login" />;
  // }

  const hasRequiredPermission =
    requiredPermissions.length === 0 || hasPermission(requiredPermissions);

  if (!hasRequiredPermission) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PermissionBasedRoute;
