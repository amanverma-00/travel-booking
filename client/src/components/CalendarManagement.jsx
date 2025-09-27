import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isAfter, isBefore } from 'date-fns';

const CalendarManagement = ({ listingId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [actionMode, setActionMode] = useState('block'); // 'block', 'unblock', 'price'
  const [customPrice, setCustomPrice] = useState('');
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth, listingId]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(addMonths(currentMonth, 2)); // Load 3 months

      const response = await fetch(
        `/api/calendar/listings/${listingId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          credentials: 'include'
        }
      );

      if (response.ok) {
        const result = await response.json();
        const dataMap = {};
        result.data.forEach(entry => {
          const dateKey = format(parseISO(entry.date), 'yyyy-MM-dd');
          dataMap[dateKey] = entry;
        });
        setCalendarData(dataMap);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isSelected = selectedDates.includes(dateStr);
    
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleBulkAction = async () => {
    if (selectedDates.length === 0) return;

    try {
      let endpoint = '';
      let body = {};

      const sortedDates = selectedDates.sort();
      const startDate = sortedDates[0];
      const endDate = sortedDates[sortedDates.length - 1];

      switch (actionMode) {
        case 'block':
          endpoint = `/api/calendar/listings/${listingId}/block`;
          body = { startDate, endDate, reason: blockReason };
          break;
        case 'unblock':
          endpoint = `/api/calendar/listings/${listingId}/unblock`;
          body = { startDate, endDate };
          break;
        case 'price':
          endpoint = `/api/calendar/listings/${listingId}/pricing`;
          body = { 
            dates: selectedDates.map(date => ({ 
              date, 
              price: parseFloat(customPrice) 
            }))
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: actionMode === 'price' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setSelectedDates([]);
        setCustomPrice('');
        setBlockReason('');
        fetchCalendarData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to perform action');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform action');
    }
  };

  const getDateStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = calendarData[dateStr];
    
    if (dayData) {
      return dayData.status || 'available';
    }
    return 'available';
  };

  const getDatePrice = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = calendarData[dateStr];
    return dayData?.price || 0;
  };

  const renderCalendarMonth = (monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div key={monthDate.getTime()} className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {format(monthDate, 'MMMM yyyy')}
        </h3>
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-12"></div>
          ))}
          
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const status = getDateStatus(day);
            const price = getDatePrice(day);
            const isSelected = selectedDates.includes(dateStr);
            const isPast = isBefore(day, new Date());

            let dayClasses = 'h-12 border border-gray-200 rounded cursor-pointer text-xs flex flex-col justify-center items-center relative transition-colors ';
            
            if (isPast) {
              dayClasses += 'bg-gray-100 text-gray-400 cursor-not-allowed ';
            } else if (isSelected) {
              dayClasses += 'bg-blue-500 text-white ';
            } else {
              switch (status) {
                case 'booked':
                  dayClasses += 'bg-red-100 text-red-800 border-red-300 ';
                  break;
                case 'blocked':
                  dayClasses += 'bg-gray-300 text-gray-700 ';
                  break;
                default:
                  dayClasses += 'bg-green-50 text-green-800 border-green-300 hover:bg-green-100 ';
              }
            }

            return (
              <div
                key={dateStr}
                className={dayClasses}
                onClick={() => !isPast && handleDateClick(day)}
              >
                <span className="font-medium">{format(day, 'd')}</span>
                {price > 0 && !isPast && (
                  <span className="text-xs">₹{price}</span>
                )}
                {status === 'booked' && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                {status === 'blocked' && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-gray-600 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Calendar Management</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="font-medium text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm text-gray-700">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-700">Blocked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-700">Selected</span>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDates.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-3">
            {selectedDates.length} dates selected
          </h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="action"
                value="block"
                checked={actionMode === 'block'}
                onChange={(e) => setActionMode(e.target.value)}
                className="mr-2"
              />
              Block Dates
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="action"
                value="unblock"
                checked={actionMode === 'unblock'}
                onChange={(e) => setActionMode(e.target.value)}
                className="mr-2"
              />
              Unblock Dates
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="action"
                value="price"
                checked={actionMode === 'price'}
                onChange={(e) => setActionMode(e.target.value)}
                className="mr-2"
              />
              Set Custom Price
            </label>
          </div>

          {actionMode === 'block' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Block Reason (Optional)
              </label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g., Maintenance, Personal use"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {actionMode === 'price' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Price (₹)
              </label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBulkAction}
              disabled={actionMode === 'price' && !customPrice}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Apply Action
            </button>
            <button
              onClick={() => setSelectedDates([])}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[currentMonth, addMonths(currentMonth, 1), addMonths(currentMonth, 2)].map(month =>
            renderCalendarMonth(month)
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarManagement;