import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaChild, FaSearch, FaMinus, FaPlus } from 'react-icons/fa';

const SearchCard = () => {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState({
    location: '',
    checkin: null,
    checkout: null,
    adults: 2,
    children: 0
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(''); // 'adults', 'children', or ''
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuestDropdown('');
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

  const handleGuestCountChange = (type, increment) => {
    setSearchData(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  const handleSearch = () => {
    console.log('Search data:', searchData);
    // TODO: Implement search functionality
  };

  const getTotalGuests = () => {
    return searchData.adults + searchData.children;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg mx-auto">
      {/* Header Text */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {t('home.findPlacesToStay')}
        </h2>
        <p className="text-base text-gray-600">
          {t('home.discoverEntireHomes')}
        </p>
      </div>

      {/* Search Form */}
      <div className="space-y-3">
        {/* Location - Full Width */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-black">{t('home.location')}</label>
          <input
            type="text"
            placeholder={t('search.anywhere')}
            value={searchData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full h-12 px-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-[#ff385c] placeholder-gray-400 text-black transition-all bg-white"
          />
        </div>

        {/* Check-in and Check-out Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-black">{t('booking.checkIn')}</label>
            <DatePicker
              selected={searchData.checkin}
              onChange={(date) => handleInputChange('checkin', date)}
              placeholderText={t('search.selectDate')}
              className="w-full h-12 px-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-[#ff385c] text-black placeholder-gray-400 font-medium transition-all cursor-pointer"
              dateFormat="MMM dd"
              minDate={new Date()}
              selectsStart
              startDate={searchData.checkin}
              endDate={searchData.checkout}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-semibold text-black">{t('booking.checkOut')}</label>
            <DatePicker
              selected={searchData.checkout}
              onChange={(date) => handleInputChange('checkout', date)}
              placeholderText={t('search.selectDate')}
              className="w-full h-12 px-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-[#ff385c] text-black placeholder-gray-400 font-medium transition-all cursor-pointer"
              dateFormat="MMM dd"
              minDate={searchData.checkin || new Date()}
              selectsEnd
              startDate={searchData.checkin}
              endDate={searchData.checkout}
            />
          </div>
        </div>

        {/* Adults and Children Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 relative">
            <label className="text-sm font-semibold text-black">{t('booking.adults')}</label>
            <button
              type="button"
              onClick={() => setShowGuestDropdown(showGuestDropdown === 'adults' ? '' : 'adults')}
              className="w-full h-12 px-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-[#ff385c] text-black font-medium transition-all text-left bg-white hover:border-[#ff385c]"
            >
              {searchData.adults} {searchData.adults === 1 ? t('booking.adult') : t('booking.adults')}
            </button>
            
            {/* Adults Dropdown */}
            {showGuestDropdown === 'adults' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">{t('booking.adults')}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange('adults', false)}
                      disabled={searchData.adults <= 1}
                      className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#ff385c] transition-colors"
                    >
                      <FaMinus className="text-xs text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-semibold text-black">{searchData.adults}</span>
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange('adults', true)}
                      className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#ff385c] transition-colors"
                    >
                      <FaPlus className="text-xs text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-1 relative">
            <label className="text-sm font-semibold text-black">{t('booking.children')}</label>
            <button
              type="button"
              onClick={() => setShowGuestDropdown(showGuestDropdown === 'children' ? '' : 'children')}
              className="w-full h-12 px-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff385c] focus:border-[#ff385c] text-black font-medium transition-all text-left bg-white hover:border-[#ff385c]"
            >
              {searchData.children} {searchData.children === 1 ? t('booking.child') : t('booking.children')}
            </button>
            
            {/* Children Dropdown */}
            {showGuestDropdown === 'children' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">{t('booking.children')}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange('children', false)}
                      disabled={searchData.children <= 0}
                      className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#ff385c] transition-colors"
                    >
                      <FaMinus className="text-xs text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-semibold text-black">{searchData.children}</span>
                    <button
                      type="button"
                      onClick={() => handleGuestCountChange('children', true)}
                      className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#ff385c] transition-colors"
                    >
                      <FaPlus className="text-xs text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Button - Full Width */}
        <div className="pt-3">
          <button
            onClick={handleSearch}
            className="w-full h-14 bg-gradient-to-r from-[#ff385c] to-[#ff385c] hover:from-[#e0314f] hover:to-[#cc2a46] text-white rounded-lg font-bold text-base flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"

          >
            <FaSearch className="text-lg" />
            <span>{t('search.searchButton')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
