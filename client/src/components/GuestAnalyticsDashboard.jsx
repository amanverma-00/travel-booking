import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const GuestAnalyticsDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [guestData, setGuestData] = useState(null);

  useEffect(() => {
    // Simulate loading guest analytics data
    setTimeout(() => {
      setGuestData({
        totalGuests: 247,
        returningGuests: 43,
        averageStayLength: 3.2,
        topCountries: ['India', 'USA', 'UK', 'Germany', 'France'],
        bookingPatterns: [
          { month: 'Jan', bookings: 12 },
          { month: 'Feb', bookings: 19 },
          { month: 'Mar', bookings: 25 },
          { month: 'Apr', bookings: 31 },
          { month: 'May', bookings: 28 },
          { month: 'Jun', bookings: 35 }
        ],
        guestPreferences: {
          familyFriendly: 65,
          petFriendly: 23,
          businessTravel: 45,
          leisure: 78
        }
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserGroupIcon className="w-8 h-8 mr-3 text-purple-600" />
            Guest Analytics
          </h1>
          <p className="text-gray-600 mt-2">Understanding your guest behavior and preferences</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{guestData?.totalGuests}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Returning Guests</p>
                <p className="text-2xl font-bold text-gray-900">{guestData?.returningGuests}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Stay Length</p>
                <p className="text-2xl font-bold text-gray-900">{guestData?.averageStayLength} days</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Guest Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Countries */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-600" />
              Top Guest Countries
            </h3>
            <div className="space-y-4">
              {guestData?.topCountries?.map((country, index) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900">{country}</span>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${90 - index * 15}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Preferences */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-purple-600" />
              Guest Preferences
            </h3>
            <div className="space-y-6">
              {Object.entries(guestData?.guestPreferences || {}).map(([preference, percentage]) => (
                <div key={preference}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {preference.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Patterns Chart Placeholder */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Booking Patterns</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Booking patterns chart would be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Integration with charting library needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestAnalyticsDashboard;