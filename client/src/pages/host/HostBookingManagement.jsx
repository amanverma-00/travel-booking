import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaFilter,
  FaCalendarAlt,
  FaUsers,
  FaArrowLeft,
  FaCheckCircle,
  FaStar
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import EnhancedReviewSystem from '../../components/EnhancedReviewSystem';
import { useLanguage } from '../../contexts/LanguageContext';

const HostBookingManagement = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings/host/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(t('msg.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === statusFilter));
    }
  };

  const handleApproveBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setProcessingAction(true);
      const response = await axios.patch(
        `/api/bookings/${selectedBooking._id}/approve`,
        { message: approvalMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        toast.success(t('msg.bookingApproved'));
        fetchBookings(); // Refresh the list
        setShowApprovalModal(false);
        setApprovalMessage('');
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error(error.response?.data?.error || t('msg.failedToApprove'));
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking || !rejectionReason.trim()) {
      toast.error(t('msg.provideReason'));
      return;
    }
    
    try {
      setProcessingAction(true);
      const response = await axios.patch(
        `/api/bookings/${selectedBooking._id}/reject`,
        { reason: rejectionReason },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        toast.success(t('msg.bookingRejected'));
        fetchBookings(); // Refresh the list
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error(error.response?.data?.error || t('msg.failedToReject'));
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      setProcessingAction(true);
      const response = await axios.patch(
        `/api/bookings/${bookingId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        toast.success(t('msg.bookingCompleted'));
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      toast.error(error.response?.data?.error || t('msg.failedToComplete'));
    } finally {
      setProcessingAction(false);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaCalendarAlt className="w-4 h-4" />;
      case 'approved':
        return <FaCheck className="w-4 h-4" />;
      case 'confirmed':
        return <FaCheck className="w-4 h-4" />;
      case 'rejected':
        return <FaTimes className="w-4 h-4" />;
      default:
        return <FaCalendarAlt className="w-4 h-4" />;
    }
  };

  // Check if user is host or admin (authentication already handled by ProtectedRoute)
  if (user?.role !== 'host' && user?.role !== 'admin') {
    return <Navigate to="/host/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('booking.loading')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/host/dashboard"
              className="mr-4 p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('booking.title')}</h1>
              <p className="text-gray-600">{t('booking.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{t('booking.filterBy')}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">{t('booking.all')}</option>
              <option value="pending">{t('booking.pending')}</option>
              <option value="approved">{t('booking.approved')}</option>
              <option value="confirmed">{t('booking.confirmed')}</option>
              <option value="active">{t('booking.active')}</option>
              <option value="completed">{t('booking.completed')}</option>
              <option value="cancelled">{t('booking.cancelled')}</option>
              <option value="rejected">{t('booking.rejected')}</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow">
          {filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.guest')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.property')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.dates')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.guests')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.amount')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
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
                              {booking.user?.emailId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.listing?.title}</div>
                        <div className="text-sm text-gray-500">{booking.listing?.location?.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{t('booking.checkin')}: {new Date(booking.startDate).toLocaleDateString()}</div>
                        <div>{t('booking.checkout')}: {new Date(booking.endDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaUsers className="mr-1" />
                          {booking.guests?.adults} {t('booking.adults')}
                          {booking.guests?.children > 0 && (
                            <span>, {booking.guests.children} {t('booking.children')}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(booking.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowApprovalModal(true);
                                }}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                                title={t('action.approve')}
                              >
                                <FaCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowRejectionModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title={t('action.reject')}
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && new Date(booking.endDate) <= new Date() && (
                            <button
                              onClick={() => handleCompleteBooking(booking._id)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded"
                              title={t('action.complete')}
                              disabled={processingAction}
                            >
                              <FaCheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status === 'completed' && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowReviewModal(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                              title={t('action.viewReviews')}
                            >
                              <FaStar className="w-4 h-4" />
                            </button>
                          )}
                          <Link
                            to={`/host/bookings/${booking._id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title={t('action.viewDetails')}
                          >
                            <FaEye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaCalendarAlt className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('msg.noBookings')}</h3>
              <p className="text-gray-500">
                {statusFilter === 'all' 
                  ? t('msg.noBookingsAll')
                  : `${t('booking.' + statusFilter)} ${t('msg.noBookingsFilter')}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('modal.approveTitle')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('modal.approveMessage')} {selectedBooking.user?.firstName}?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('modal.messageToGuest')}
              </label>
              <textarea
                value={approvalMessage}
                onChange={(e) => setApprovalMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows="3"
                placeholder={t('modal.messagePlaceholder')}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleApproveBooking}
                disabled={processingAction}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {processingAction ? t('btn.processing') : t('btn.approve')}
              </button>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalMessage('');
                  setSelectedBooking(null);
                }}
                disabled={processingAction}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                {t('btn.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('modal.rejectTitle')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('modal.rejectMessage')}
            </p>
            <div className="mb-4">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows="4"
                placeholder={t('modal.rejectPlaceholder')}
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRejectBooking}
                disabled={processingAction || !rejectionReason.trim()}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {processingAction ? t('btn.processing') : t('btn.reject')}
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedBooking(null);
                }}
                disabled={processingAction}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                {t('btn.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('modal.reviewTitle')}{selectedBooking._id?.slice(-6)}
              </h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            
            <EnhancedReviewSystem 
              bookingId={selectedBooking._id} 
              userType="host" 
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HostBookingManagement;