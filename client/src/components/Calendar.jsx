import { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const Calendar = ({ value, onChange, placeholder, minDate = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    onChange(selectedDate);
    setIsOpen(false);
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const getMinDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="relative" ref={calendarRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full border-none p-0 cursor-pointer hover:bg-gray-50 rounded"
      >
        <span className={value ? 'text-gray-900 text-sm' : 'text-gray-500 text-sm'}>
          {value ? formatDate(value) : placeholder}
        </span>
        <FaCalendarAlt className="text-gray-400 text-xs" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <input
            type="date"
            value={formatDateForInput(value)}
            onChange={handleDateChange}
            min={getMinDateString()}
            className="p-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;