import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaChartLine, 
  FaUsers, 
  FaStar, 
  FaBell,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaWallet,
  FaCreditCard
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthCheck } from '../../hooks/useAuthCheck';

const HostDashboard = () => {
  const { user, isAuthenticated, authChecked, hasRole } = useAuthCheck();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    activeBookings: 0,
    totalEarnings: 0,
    totalListings: 0,
    averageRating: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHostData();
    }
  }, [isAuthenticated]);

  const fetchHostData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, pendingRes] = await Promise.all([
        axios.get('/api/bookings/host/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/bookings/host/pending', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const allBookings = bookingsRes.data.data || [];
      const pendingBookings = pendingRes.data.data || [];

      // Calculate stats
      const totalBookings = allBookings.length;
      const activeBookings = allBookings.filter(b => b.status === 'active').length;
      const totalEarnings = allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      setStats({
        totalBookings,
        pendingBookings: pendingBookings.length,
        activeBookings,
        totalEarnings,
        totalListings: 0, // Will be implemented when we add listings endpoint
        averageRating: 4.8 // Placeholder
      });

      setRecentBookings(allBookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching host data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated or not a host
  if (!authChecked) {
    // Show loading while checking authentication
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user is host or admin (authentication already handled by ProtectedRoute)
  if (!hasRole('host')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to be a host to access this page.</p>
          <Link 
            to="/become-host" 
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Become a Host
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-blue-600 bg-blue-100',
      confirmed: 'text-green-600 bg-green-100',
      active: 'text-purple-600 bg-purple-100',
      completed: 'text-gray-600 bg-gray-100',
      cancelled: 'text-red-600 bg-red-100',
      rejected: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your properties today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-8 w-8 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaClock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Guests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaChartLine className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/host/review-requests"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaBell className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Review Requests</h3>
                <p className="text-sm text-gray-600">
                  {stats.pendingBookings} pending booking requests
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/host/manage-properties"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaHome className="h-6 w-6 text-pink-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Properties</h3>
                <p className="text-sm text-gray-600">
                  View and edit your listings
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/host/calendar"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaCalendarAlt className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Calendar</h3>
                <p className="text-sm text-gray-600">
                  Manage availability and pricing
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/messages"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaUsers className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">
                  Chat with your guests
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/host/payments"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaCreditCard className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Payments</h3>
                <p className="text-sm text-gray-600">
                  View received payments & transactions
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/host/earnings"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <FaWallet className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Earnings</h3>
                <p className="text-sm text-gray-600">
                  Track income and request payouts
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/host/analytics"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50"
          >
            <div className="flex items-center">
              <FaChartLine className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Analytics</h3>
                <p className="text-sm text-gray-600">
                  Advanced insights & pricing optimization
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              to="/host/bookings"
              className="text-pink-600 hover:text-pink-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {recentBookings.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {booking.user?.profileImage?.url ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={booking.user.profileImage.url}
                                alt={booking.user.firstName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {booking.user?.firstName?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user?.firstName} {booking.user?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.guests?.adults} adults
                              {booking.guests?.children > 0 && `, ${booking.guests.children} children`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.listing?.title}</div>
                        <div className="text-sm text-gray-500">{booking.listing?.location?.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(booking.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No bookings yet. Your first booking will appear here.
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HostDashboard;