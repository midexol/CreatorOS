import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useDashboard();

  if (!user) {
    // Tight security: If unauthenticated user copies the dashboard URL, redirect immediately to landing
    return <Navigate to="/?authRequired=true" replace />;
  }

  return <>{children}</>;
};
