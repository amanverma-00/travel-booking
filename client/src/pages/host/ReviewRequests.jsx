import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  UserIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  EyeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ReviewRequests = () => {
  const { t } = useLanguage();
  const { user } = useSelector(state => state.auth);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('/api/bookings/host/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter for pending requests only
        const pendingRequests = data.data?.filter(booking => booking.status === 'pending') || [];
        setBookingRequests(pendingRequests);
      } else {
        console.error('Failed to fetch booking requests:', response.status);
        toast.error('Failed to fetch booking requests');
      }
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    setProcessingId(bookingId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`/api/bookings/${bookingId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(t(`booking.${action}Success`));
        fetchBookingRequests(); // Refresh the list
      } else {
        toast.error(t(`booking.${action}Error`));
      }
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
      toast.error(t('common.error'));
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return nights;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 p-6 rounded-lg shadow h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('host.reviewRequests')}</h1>
            <p className="mt-2 text-gray-600">{t('host.reviewRequestsDesc')}</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {bookingRequests.length} {t('host.pendingRequests')}
            </div>
          </div>
        </div>
      </div>

      {bookingRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t('host.noPendingRequests')}</h3>
          <p className="mt-2 text-gray-500">{t('host.noPendingRequestsDesc')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookingRequests.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Guest Info */}
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        {booking.user?.profilePicture ? (
                          <img
                            className="h-12 w-12 rounded-full"
                            src={booking.user.profilePicture}
                            alt={booking.user.fullName}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.user?.fullName || t('common.guest')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.listing?.title}</p>
                          <p className="text-sm text-gray-500">{booking.listing?.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {calculateNights(booking.checkInDate, booking.checkOutDate)} {t('common.nights')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.guests} {t('common.guests')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.adults} {t('booking.adults')}, {booking.children} {t('booking.children')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <CurrencyRupeeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{booking.totalAmount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{t('booking.totalAmount')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{t('booking.specialRequests')}</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {booking.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Booking Date */}
                    <div className="text-sm text-gray-500 mb-4">
                      {t('booking.requestedOn')}: {formatDate(booking.createdAt)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 ml-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleBookingAction(booking._id, 'approve')}
                        disabled={processingId === booking._id}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        {processingId === booking._id ? t('common.processing') : t('booking.approve')}
                      </button>
                      
                      <button
                        onClick={() => handleBookingAction(booking._id, 'reject')}
                        disabled={processingId === booking._id}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {processingId === booking._id ? t('common.processing') : t('booking.reject')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewRequests;