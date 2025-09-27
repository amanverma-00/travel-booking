import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useAuthCheck = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('token');
    
    if (token && !isAuthenticated) {
      // If we have a token but not authenticated in Redux, wait for auth restoration
      const timer = setTimeout(() => {
        setAuthChecked(true);
      }, 1000); // Wait 1 second for auth restoration
      return () => clearTimeout(timer);
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated]);

  return {
    user,
    isAuthenticated,
    authChecked,
    // Helper function to check if user has required role
    hasRole: (role) => user?.role === role || user?.role === 'admin'
  };
};