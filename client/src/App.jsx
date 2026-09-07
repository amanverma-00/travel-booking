import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { useEffect, Suspense } from 'react';
import { store } from './store';
import { loginSuccess, initializeAuth } from './store/authSlice';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import ListingDetail from './pages/ListingDetail';
import Wishlist from './pages/Wishlist';
import BecomeHost from './pages/BecomeHost';
import Messages from './pages/Messages';
import NotificationsPage from './pages/NotificationsPage';
import LanguageTest from './components/LanguageTest';

// Host pages
import HostDashboard from './pages/host/HostDashboard';
import HostBookingManagement from './pages/host/HostBookingManagement';
import MyBookings from './pages/MyBookings';
import MyPayments from './pages/MyPayments';
import PaymentDetails from './pages/PaymentDetails';
import HostCalendar from './pages/host/HostCalendar';
import EarningsPage from './pages/host/EarningsPage';
import HostAnalyticsDashboard from './pages/host/HostAnalyticsDashboard';
import ReviewRequests from './pages/host/ReviewRequests';
import ManageProperties from './pages/host/ManageProperties';
import EditProperty from './pages/host/EditProperty';
import HostPayments from './pages/host/HostPayments';

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('AuthProvider: Checking stored authentication...');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        
        // Validate token format and expiration
        if (token.includes('.')) {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenPayload.exp && tokenPayload.exp > currentTime) {
            // Token is valid, restore user session
            dispatch(loginSuccess(user.user || user)); // Handle both user object formats
            console.log('Session restored from localStorage');
          } else {
            // Token expired, clean up
            console.log('Token expired, clearing localStorage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch(initializeAuth()); // Mark initialization complete
          }
        } else {
          // Invalid token format, clean up
          console.log('Invalid token format, clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch(initializeAuth()); // Mark initialization complete
        }
      } catch (error) {
        console.error('Error parsing authentication data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(initializeAuth()); // Mark initialization complete
      }
    } else {
      console.log('No stored authentication found');
      dispatch(initializeAuth()); // Mark initialization complete
    }
  }, [dispatch]);

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/listing/:id" element={<ListingDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/become-host" element={<BecomeHost />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-bookings" element={
                    <ProtectedRoute>
                      <MyBookings />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-payments" element={
                    <ProtectedRoute>
                      <MyPayments />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment/:id" element={
                    <ProtectedRoute>
                      <PaymentDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/language-test" element={<LanguageTest />} />
                  
                  {/* Host Routes */}
                  <Route path="/host/dashboard" element={
                    <ProtectedRoute>
                      <HostDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/bookings" element={
                    <ProtectedRoute>
                      <HostBookingManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/bookings/pending" element={
                    <ProtectedRoute>
                      <HostBookingManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/review-requests" element={
                    <ProtectedRoute>
                      <ReviewRequests />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/manage-properties" element={
                    <ProtectedRoute>
                      <ManageProperties />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/listings" element={
                    <ProtectedRoute>
                      <ManageProperties />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/edit-property/:id" element={
                    <ProtectedRoute>
                      <EditProperty />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/calendar" element={
                    <ProtectedRoute>
                      <HostCalendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/earnings" element={
                    <ProtectedRoute>
                      <EarningsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/analytics" element={
                    <ProtectedRoute>
                      <HostAnalyticsDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/payments" element={
                    <ProtectedRoute>
                      <HostPayments />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </Provider>
  );
}

export default App;