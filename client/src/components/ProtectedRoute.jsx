import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useSelector(state => state.auth);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // If not authenticated after initialization, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;