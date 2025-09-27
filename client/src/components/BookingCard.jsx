import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaPlus, FaMinus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BookingCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Search with:', searchData);
    
    // Build search URL parameters
    const params = new URLSearchParams();
    
    if (searchData.destination) {
      params.append('location', searchData.destination);
    }
    
    if (searchData.checkIn) {
      params.append('checkIn', searchData.checkIn);
    }
    
    if (searchData.checkOut) {
      params.append('checkOut', searchData.checkOut);
    }
    
    if (searchData.adults) {
      params.append('adults', searchData.adults.toString());
    }
    
    if (searchData.children) {
      params.append('children', searchData.children.toString());
    }
    
    // Navigate to search results page
    navigate(`/search?${params.toString()}`);
    setActiveDropdown(null);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // In a real app, you'd reverse geocode these coordinates
        handleInputChange('destination', 'Current Location');
        setActiveDropdown(null);
      });
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isDateSelected = (day, type) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return searchData[type] === dateStr;
  };

  const selectDate = (day, type) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    handleInputChange(type, dateStr);
    
    // Auto-move to checkout when checkin is selected
    if (type === 'checkIn' && !searchData.checkOut) {
      setTimeout(() => setActiveDropdown('checkOut'), 300);
    } else {
      setActiveDropdown(null);
    }
  };

  const renderCalendar = (type) => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = new Date();
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isSelected = isDateSelected(day, type);
      
      days.push(
        <button
          key={day}
          onClick={() => !isPast && selectDate(day, type)}
          disabled={isPast}
          className={`h-10 w-10 text-sm rounded-full flex items-center justify-center transition-colors ${
            isPast 
              ? 'text-gray-300 cursor-not-allowed' 
              : isSelected
                ? 'bg-red-500 text-white'
                : isToday
                  ? 'bg-red-100 text-red-600 font-semibold'
                  : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-lg">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {[t('calendar.sun'), t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat')].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const renderGuestsSelector = () => (
    <div className="p-4 w-72">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">{t('booking.guests')}</div>
            <div className="text-sm text-gray-500">{t('booking.agesAbove')}</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleInputChange('adults', Math.max(1, searchData.adults - 1))}
              disabled={searchData.adults <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-medium">{searchData.adults}</span>
            <button
              onClick={() => handleInputChange('adults', Math.min(8, searchData.adults + 1))}
              disabled={searchData.adults >= 8}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">{t('booking.children')}</div>
            <div className="text-sm text-gray-500">{t('booking.ages2to12')}</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleInputChange('children', Math.max(0, searchData.children - 1))}
              disabled={searchData.children <= 0}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-medium">{searchData.children}</span>
            <button
              onClick={() => handleInputChange('children', Math.min(5, searchData.children + 1))}
              disabled={searchData.children >= 5}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationDropdown = () => (
    <div className="p-4 w-80">
      <div className="mb-3">
        <input
          type="text"
          value={searchData.destination}
          onChange={(e) => handleInputChange('destination', e.target.value)}
          placeholder={t('home.searchPlaceholder')}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          autoFocus
        />
      </div>
      
      <button
        onClick={handleCurrentLocation}
        className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">{t('booking.useCurrentLocation')}</div>
          <div className="text-sm text-gray-500">{t('booking.usingGPS')}</div>
        </div>
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto relative" ref={dropdownRef}>
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:divide-x lg:divide-gray-200">
          
          {/* Where */}
          <div 
            className={`flex-1 px-6 py-4 lg:py-3 rounded-full lg:rounded-none transition-colors duration-200 cursor-pointer ${
              activeDropdown === 'where' ? 'bg-gray-50 shadow-inner' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === 'where' ? null : 'where')}
          >
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-900 mb-1">
                {t('search.where')}
              </label>
              <div className="text-sm text-gray-600">
                {searchData.destination || t('search.searchDestinations')}
              </div>
            </div>
          </div>

          {/* Check in */}
          <div 
            className={`flex-1 px-6 py-4 lg:py-3 rounded-full lg:rounded-none transition-colors duration-200 cursor-pointer ${
              activeDropdown === 'checkIn' ? 'bg-gray-50 shadow-inner' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === 'checkIn' ? null : 'checkIn')}
          >
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-900 mb-1">
                {t('booking.checkIn')}
              </label>
              <div className="text-sm text-gray-600">
                {formatDate(searchData.checkIn) || t('search.addDates')}
              </div>
            </div>
          </div>

          {/* Check out */}
          <div 
            className={`flex-1 px-6 py-4 lg:py-3 rounded-full lg:rounded-none transition-colors duration-200 cursor-pointer ${
              activeDropdown === 'checkOut' ? 'bg-gray-50 shadow-inner' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === 'checkOut' ? null : 'checkOut')}
          >
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-900 mb-1">
                {t('booking.checkOut')}
              </label>
              <div className="text-sm text-gray-600">
                {formatDate(searchData.checkOut) || t('search.addDates')}
              </div>
            </div>
          </div>

          {/* Who */}
          <div 
            className={`flex-1 px-6 py-4 lg:py-3 rounded-full lg:rounded-none transition-colors duration-200 cursor-pointer ${
              activeDropdown === 'who' ? 'bg-gray-50 shadow-inner' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === 'who' ? null : 'who')}
          >
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-900 mb-1">
                {t('search.who')}
              </label>
              <div className="text-sm text-gray-600">
                {searchData.adults + searchData.children > 0 
                  ? `${searchData.adults} ${searchData.adults !== 1 ? t('booking.adults') : t('booking.adult')}${searchData.children > 0 ? `, ${searchData.children} ${searchData.children !== 1 ? t('booking.children') : t('booking.child')}` : ''}`
                  : t('search.addGuests')
                }
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex-shrink-0 px-2 py-2 lg:py-1">
            <button
              onClick={handleSearch}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Panels */}
      {activeDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
          {activeDropdown === 'where' && renderLocationDropdown()}
          {activeDropdown === 'checkIn' && renderCalendar('checkIn')}
          {activeDropdown === 'checkOut' && renderCalendar('checkOut')}
          {activeDropdown === 'who' && renderGuestsSelector()}
        </div>
      )}
    </div>
  );
};

export default BookingCard;