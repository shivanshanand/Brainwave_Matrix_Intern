// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { useAuthCheck } from '../../hooks/useAuth';

const ProtectedRoute = ({ 
  children, 
  fallback = null, 
  requiredRole = null,
  showLoginPrompt = true,
  redirectToLogin = false 
}) => {
  const { isAuthenticated, user, loading } = useAuthCheck();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    // Redirect to login if specified
    if (redirectToLogin) {
      window.location.href = '/login';
      return null;
    }

    // Show login prompt
    if (showLoginPrompt) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-700 p-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                <svg className="w-8 h-8 text-teal-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">Authentication Required</h3>
              <p className="text-gray-400 mb-8">
                Please log in to access this feature and create amazing content.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Log In
                </button>
                
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-600"></div>
                  <span className="px-3 text-gray-500 text-sm">or</span>
                  <div className="flex-1 border-t border-gray-600"></div>
                </div>
                
                <button
                  onClick={() => window.location.href = '/register'}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Create New Account
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full text-gray-400 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Return fallback component
    return fallback;
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-700 p-8">
          <div className="text-center">
            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Access Denied</h3>
            <p className="text-gray-400 mb-6">
              You don't have permission to access this content. 
              {requiredRole && ` ${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} role required.`}
            </p>
            
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              ← Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
