import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * ProtectedRoute:
 * Requires the visitor to be authenticated before accessing the page.
 * Unauthenticated visitors are redirected to /login.
 */
export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user || !user.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

/**
 * PublicOnlyRoute:
 * For pages like /login and /signup.
 * If user is already logged in, redirects them straight to the home page (/).
 */
export function PublicOnlyRoute({ children }) {
  const { user } = useApp();

  if (user && user.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

