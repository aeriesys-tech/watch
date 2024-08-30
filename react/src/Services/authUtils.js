// src/Services/authUtils.js
import { getUserPermissions } from "./authService";

export const hasPermission = (requiredPermissions) => {
  const userPermissions = getUserPermissions();
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
};
