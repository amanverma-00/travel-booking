import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EyeIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const PerformanceTrackingDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    // Simulate loading performance data
    setTimeout(() => {
      setPerformanceData({
        kpis: {
          revenue: { current: 45000, previous: 38000, trend: 'up' },
          occupancyRate: { current: 78, previous: 82, trend: 'down' },
          averageRating: { current: 4.6, previous: 4.4, trend: 'up' },
          responseTime: { current: 2.3, previous: 3.1, trend: 'up' }
        },
        goals: [
          { id: 1, title: 'Monthly Revenue Target', target: 50000, current: 45000, status: 'on-track' },
          { id: 2, title: 'Occupancy Rate Goal', target: 85, current: 78, status: 'behind' },
          { id: 3, title: 'Guest Rating Target', target: 4.5, current: 4.6, status: 'achieved' },
          { id: 4, title: 'Response Time Goal', target: 2, current: 2.3, status: 'behind' }
        ],
        trends: [
          { period: 'Jan', revenue: 35000, bookings: 45, rating: 4.2 },
          { period: 'Feb', revenue: 38000, bookings: 52, rating: 4.3 },
          { period: 'Mar', revenue: 42000, bookings: 58, rating: 4.5 },
          { period: 'Apr', revenue: 45000, bookings: 62, rating: 4.6 },
          { period: 'May', revenue: 43000, bookings: 59, rating: 4.6 },
          { period: 'Jun', revenue: 47000, bookings: 65, rating: 4.7 }
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'achieved': return 'text-green-600 bg-green-100';
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'behind': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'achieved': return <CheckCircleIcon className="w-5 h-5" />;
      case 'on-track': return <ArrowTrendingUpIcon className="w-5 h-5" />;
      case 'behind': return <ExclamationTriangleIcon className="w-5 h-5" />;
      default: return <ChartBarIcon className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" /> : 
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ArrowTrendingUpIcon className="w-8 h-8 mr-3 text-green-600" />
            Performance Tracking
          </h1>
          <p className="text-gray-600 mt-2">Monitor your key performance indicators and goals</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
              {getTrendIcon(performanceData?.kpis.revenue.trend)}
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(performanceData?.kpis.revenue.current)}
              </p>
            </div>
            <p className="text-sm text-green-600 mt-2">
              +{((performanceData?.kpis.revenue.current - performanceData?.kpis.revenue.previous) / performanceData?.kpis.revenue.previous * 100).toFixed(1)}% from last period
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Occupancy Rate</h3>
              {getTrendIcon(performanceData?.kpis.occupancyRate.trend)}
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.kpis.occupancyRate.current}%
              </p>
            </div>
            <p className="text-sm text-red-600 mt-2">
              {performanceData?.kpis.occupancyRate.current - performanceData?.kpis.occupancyRate.previous}% from last period
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
              {getTrendIcon(performanceData?.kpis.averageRating.trend)}
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.kpis.averageRating.current}/5
              </p>
            </div>
            <p className="text-sm text-green-600 mt-2">
              +{(performanceData?.kpis.averageRating.current - performanceData?.kpis.averageRating.previous).toFixed(1)} from last period
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Response Time</h3>
              {getTrendIcon(performanceData?.kpis.responseTime.trend)}
            </div>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {performanceData?.kpis.responseTime.current}h
              </p>
            </div>
            <p className="text-sm text-green-600 mt-2">
              -{(performanceData?.kpis.responseTime.previous - performanceData?.kpis.responseTime.current).toFixed(1)}h improvement
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goals Tracking */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Goals</h3>
            <div className="space-y-6">
              {performanceData?.goals?.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                      {getStatusIcon(goal.status)}
                      <span className="text-sm font-medium capitalize">{goal.status}</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Current: {typeof goal.current === 'number' && goal.current > 1000 ? formatCurrency(goal.current) : goal.current}</span>
                      <span>Target: {typeof goal.target === 'number' && goal.target > 1000 ? formatCurrency(goal.target) : goal.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${goal.status === 'achieved' ? 'bg-green-500' : goal.status === 'on-track' ? 'bg-blue-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Performance trends chart would be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-medium text-green-900">Revenue Growth</h4>
              </div>
              <p className="text-sm text-green-800">
                Your revenue is trending upward with a 18% increase this period. Great work!
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-medium text-yellow-900">Occupancy Alert</h4>
              </div>
              <p className="text-sm text-yellow-800">
                Occupancy rate has decreased by 4%. Consider adjusting your pricing strategy.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <StarIcon className="w-5 h-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-900">Guest Satisfaction</h4>
              </div>
              <p className="text-sm text-blue-800">
                Your ratings have improved! Guests appreciate your recent service enhancements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrackingDashboard;