import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaUser, FaChild, FaMinus, FaPlus, FaCreditCard, FaStar } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const PropertyBookingCard = ({ listing }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    checkin: null,
    checkout: null,
    adults: 1,
    children: 0
  });

  const [pricing, setPricing] = useState({
    basePrice: 0,
    nights: 0,
    subtotal: 0,
    serviceFee: 0,
    taxes: 0,
    total: 0
  });

  // Calculate pricing when dates change
  useEffect(() => {
    if (bookingData.checkin && bookingData.checkout && listing) {
      const checkin = new Date(bookingData.checkin);
      const checkout = new Date(bookingData.checkout);
      const timeDiff = checkout.getTime() - checkin.getTime();
      const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
      
      const basePrice = listing.price || listing.pricing?.basePrice || 0;
      const subtotal = basePrice * nights;
      const serviceFee = Math.round(subtotal * 0.14); // 14% service fee
      const taxes = Math.round(subtotal * 0.12); // 12% taxes
      const total = subtotal + serviceFee + taxes;

      setPricing({
        basePrice,
        nights,
        subtotal,
        serviceFee,
        taxes,
        total
      });
    }
  }, [bookingData.checkin, bookingData.checkout, listing]);

  const handleDateChange = (field, date) => {
    setBookingData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleGuestChange = (type, increment) => {
    setBookingData(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + increment)
    }));
  };

  const validateBooking = () => {
    if (!bookingData.checkin || !bookingData.checkout) {
      toast.error('Please select check-in and check-out dates');
      return false;
    }

    if (bookingData.checkin >= bookingData.checkout) {
      toast.error('Check-out date must be after check-in date');
      return false;
    }

    const totalGuests = bookingData.adults + bookingData.children;
    const maxGuests = listing.capacity?.maxGuests || listing.maxGuests || 2;
    if (totalGuests > maxGuests) {
      toast.error(`Maximum ${maxGuests} guests allowed`);
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to make a booking');
      navigate('/login');
      return;
    }

    if (!validateBooking()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/bookings', {
        listingId: listing._id,
        startDate: bookingData.checkin,
        endDate: bookingData.checkout,
        guests: {
          adults: bookingData.adults,
          children: bookingData.children
        },
        specialRequests: bookingData.specialRequests || ''
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Booking request sent successfully! The host will review your request.');
        // Optionally navigate to a booking confirmation page
        // navigate(`/booking/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const isDateDisabled = (date) => {
    // Disable past dates
    return date < new Date();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹{pricing.basePrice.toLocaleString()}
          </span>
          <span className="text-gray-600">{t('property.night')}</span>
        </div>
        
        {listing.ratingsAverage && (
          <div className="flex items-center gap-1 text-sm">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span className="font-medium">{listing.ratingsAverage}</span>
            <span className="text-gray-600">
              ({listing.ratingsQuantity} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-2 border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-3 border-r border-gray-300">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('booking.checkIn').toUpperCase()}
            </label>
            <DatePicker
              selected={bookingData.checkin}
              onChange={(date) => handleDateChange('checkin', date)}
              selectsStart
              startDate={bookingData.checkin}
              endDate={bookingData.checkout}
              filterDate={(date) => !isDateDisabled(date)}
              placeholderText={t('booking.addDates')}
              className="w-full text-sm focus:outline-none"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('booking.checkOut').toUpperCase()}
            </label>
            <DatePicker
              selected={bookingData.checkout}
              onChange={(date) => handleDateChange('checkout', date)}
              selectsEnd
              startDate={bookingData.checkin}
              endDate={bookingData.checkout}
              minDate={bookingData.checkin}
              filterDate={(date) => !isDateDisabled(date)}
              placeholderText={t('booking.addDates')}
              className="w-full text-sm focus:outline-none"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      {/* Guests Selection */}
      <div className="mb-6">
        <div className="border border-gray-300 rounded-lg p-3">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            GUESTS
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-400" />
                <span className="text-sm">{t('booking.adults')}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleGuestChange('adults', -1)}
                  disabled={bookingData.adults <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center">{bookingData.adults}</span>
                <button
                  type="button"
                  onClick={() => handleGuestChange('adults', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaChild className="text-gray-400" />
                <span className="text-sm">{t('booking.children')}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleGuestChange('children', -1)}
                  disabled={bookingData.children <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center">{bookingData.children}</span>
                <button
                  type="button"
                  onClick={() => handleGuestChange('children', 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Button */}
      <button
        onClick={handleBooking}
        disabled={isLoading || !bookingData.checkin || !bookingData.checkout}
        className="w-full bg-[#ff385c] hover:bg-[#e31c5f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 mb-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {t('common.processing')}
          </div>
        ) : (
          t('booking.reserve')
        )}
      </button>

      {/* Pricing Breakdown */}
      {pricing.nights > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span>₹{pricing.basePrice.toLocaleString()} × {pricing.nights} {pricing.nights === 1 ? t('property.night') : t('property.nights')}</span>
            <span>₹{pricing.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('booking.serviceFee')}</span>
            <span>₹{pricing.serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('booking.taxes')}</span>
            <span>₹{pricing.taxes.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-200">
            <span>{t('booking.total')}</span>
            <span>₹{pricing.total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-gray-600 mt-4">
        {t('booking.noChargeYet')}
      </p>
    </div>
  );
};

export default PropertyBookingCard;