import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { CalendarIcon, MapPinIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const MyBookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  useSelector(state => state.auth); // auth state available if needed

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view bookings');
        return;
      }

      const response = await fetch('/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : data.data || []);
      } else {
        console.error('Failed to fetch bookings:', response.status);
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBookings = selectedStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus);

  const canCancelBooking = (booking) => {
    return ['pending', 'approved'].includes(booking.status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('bookings.myBookings')}</h1>
        <p className="text-gray-600 mt-2">{t('bookings.description')}</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`bookings.status.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedStatus === 'all' ? t('bookings.noBookings') : t('bookings.noBookingsWithStatus')}
          </h3>
          <p className="text-gray-600">{t('bookings.startBooking')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.listing?.title || 'Property Title'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {t(`bookings.status.${booking.status}`)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Location */}
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">
                          {booking.listing?.location?.city}, {booking.listing?.location?.state}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </span>
                      </div>

                      {/* Guests */}
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">
                          {booking.guests?.adults || 1} {(booking.guests?.adults || 1) === 1 ? t('booking.adult') : t('booking.adults')}
                          {booking.guests?.children > 0 && `, ${booking.guests.children} ${booking.guests.children === 1 ? t('booking.child') : t('booking.children')}`}
                        </span>
                      </div>

                      {/* Total Price */}
                      <div className="flex items-center text-gray-600">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">
                          ₹{booking.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{t('bookings.specialRequests')}:</span> {booking.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Host Message */}
                    {booking.hostMessage && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">{t('bookings.hostMessage')}:</span> {booking.hostMessage}
                        </p>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {booking.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 rounded-md">
                        <p className="text-sm text-red-800">
                          <span className="font-medium">{t('bookings.rejectionReason')}:</span> {booking.rejectionReason}
                        </p>
                      </div>
                    )}

                    {/* Payment Information */}
                    {booking.payment && booking.payment.status && (
                      <div className="mb-4 p-3 bg-green-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {booking.payment.status === 'completed' && <FaCheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                            {booking.payment.status === 'pending' && <FaClock className="w-4 h-4 text-yellow-500 mr-2" />}
                            {booking.payment.status === 'failed' && <FaTimesCircle className="w-4 h-4 text-red-500 mr-2" />}
                            {booking.payment.status === 'refunded' && <FaTimesCircle className="w-4 h-4 text-orange-500 mr-2" />}
                            <span className="text-sm font-medium text-gray-700">
                              Payment: ${booking.payment.amount} - {booking.payment.status?.charAt(0)?.toUpperCase() + booking.payment.status?.slice(1)}
                            </span>
                          </div>
                          <Link 
                            to={`/payment/${booking.payment._id}`}
                            className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => {
                            if (window.confirm(t('bookings.confirmCancel'))) {
                              handleCancelBooking(booking._id);
                            }
                          }}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          {t('bookings.cancel')}
                        </button>
                      )}

                      {booking.status === 'completed' && (
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                          {t('bookings.writeReview')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Property Image */}
                  {booking.listing?.images && booking.listing.images.length > 0 && (
                    <div className="ml-6 flex-shrink-0">
                      <img
                        src={getImageUrl(booking.listing.images[0])}
                        alt={booking.listing.title}
                        onError={(e) => handleImageError(e)}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Timeline */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {t('bookings.bookedOn')}: {formatDate(booking.createdAt)}
                  {booking.approvedAt && (
                    <span className="ml-4">
                      {t('bookings.approvedOn')}: {formatDate(booking.approvedAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;