import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ChartBarIcon,
  LightBulbIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const AdvancedAnalyticsDashboard = ({ onNavigateToTab }) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedListing, setSelectedListing] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'host') {
      fetchDashboardData();
    }
  }, [user, selectedPeriod, selectedListing]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period: selectedPeriod,
        ...(selectedListing !== 'all' && { listingId: selectedListing })
      });

      const response = await fetch(`/api/analytics/dashboard?${params}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceIcon = (score) => {
    if (score >= 80) return <ArrowTrendingUpIcon className="w-5 h-5" />;
    if (score >= 60) return <ChartBarIcon className="w-5 h-5" />;
    return <ArrowTrendingDownIcon className="w-5 h-5" />;
  };

  if (user?.role !== 'host') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only hosts can access the analytics dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
              <p className="text-gray-600 mt-2">AI-powered insights for your listings</p>
            </div>
            
            {/* Controls */}
            <div className="flex space-x-4">
              {/* Period Dropdown */}
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <option value="daily">📅 Daily</option>
                  <option value="weekly">📊 Weekly</option>
                  <option value="monthly">📈 Monthly</option>
                  <option value="yearly">🎯 Yearly</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChartBarIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Listing Dropdown */}
              {dashboardData?.listings && (
                <div className="relative">
                  <select
                    value={selectedListing}
                    onChange={(e) => setSelectedListing(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px]"
                  >
                    <option value="all">🏠 All Listings ({dashboardData.listings.length})</option>
                    {dashboardData.listings.map((listing) => (
                      <option key={listing.listing._id} value={listing.listing._id}>
                        🏡 {listing.listing.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <UserGroupIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData?.summary?.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.summary?.totalBookings || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Occupancy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(dashboardData?.summary?.avgOccupancy || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(dashboardData?.summary?.avgRating || 0).toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Listings Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Listing Performance Cards */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Listing Performance</h3>
            <div className="space-y-4">
              {dashboardData?.listings?.slice(0, 5).map((listing) => (
                <div key={listing.listing._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {listing.listing.image && (
                        <img
                          src={listing.listing.image}
                          alt={listing.listing.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{listing.listing.title}</h4>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(listing.listing.pricing?.basePrice || 0)}/night
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getPerformanceColor(listing.performance?.score || 0)}`}>
                      {getPerformanceIcon(listing.performance?.score || 0)}
                      <span className="text-sm font-medium">
                        {listing.performance?.score || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Views</p>
                      <p className="font-medium">{listing.metrics?.views || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Bookings</p>
                      <p className="font-medium">{listing.metrics?.bookings || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-medium">{formatCurrency(listing.metrics?.revenue || 0)}</p>
                    </div>
                  </div>

                  {listing.performance?.recommendations?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-start space-x-2">
                        <LightBulbIcon className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Top Recommendation:</p>
                          <p className="text-sm text-gray-800">
                            {listing.performance.recommendations[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Insights</h3>
            <div className="space-y-4">
              {dashboardData?.insights?.slice(0, 6).map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ChartBarIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    {insight.action && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium">
                        {insight.action}
                      </button>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No insights available yet. More data is needed to generate AI insights.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics Tools</h3>
            <p className="text-gray-600">Optimize your property performance with AI-powered tools</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('pricing')}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <CogIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Pricing Optimization</div>
                <div className="text-xs text-blue-100">AI-powered pricing recommendations</div>
              </div>
            </button>
            
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('market')}
              className="group bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <ArrowTrendingUpIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Market Intelligence</div>
                <div className="text-xs text-green-100">Competitive analysis & trends</div>
              </div>
            </button>
            
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('guests')}
              className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <EyeIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Guest Behavior</div>
                <div className="text-xs text-purple-100">Booking patterns & insights</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;