import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Unauthenticated user -> Redirect to /login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role check if allowedRoles specified -> Redirect to /403 if insufficient permission
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/403" state={{ requiredRoles: allowedRoles, currentRole: currentUser.role }} replace />;
  }

  return <>{children}</>;
};
