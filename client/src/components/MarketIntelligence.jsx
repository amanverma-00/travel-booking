import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const MarketIntelligence = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketIntelligence();
  }, [selectedCity, selectedTimeframe]);

  const fetchMarketIntelligence = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeframe: selectedTimeframe,
        ...(selectedCity && { city: selectedCity })
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analytics/market-intelligence?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market intelligence');
      }

      const data = await response.json();
      setMarketData(data.data);
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
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

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <ChartBarIcon className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Market Intelligence</h1>
              <p className="text-gray-600 mt-2">Competitive analysis and market trends</p>
            </div>
            
            {/* Controls */}
            <div className="flex space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              >
                <option value="">All Cities</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="pune">Pune</option>
                <option value="lucknow">Lucknow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={fetchMarketIntelligence}
              className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Daily Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(marketData?.overview?.avgDailyRate || 0)}
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(marketData?.overview?.adrTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(marketData?.overview?.adrTrend || 0)}`}>
                    {marketData?.overview?.adrTrend > 0 ? '+' : ''}{(marketData?.overview?.adrTrend * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market Occupancy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(marketData?.overview?.avgOccupancy || 0)}
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(marketData?.overview?.occupancyTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(marketData?.overview?.occupancyTrend || 0)}`}>
                    {marketData?.overview?.occupancyTrend > 0 ? '+' : ''}{(marketData?.overview?.occupancyTrend * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Supply Growth</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(marketData?.overview?.supplyGrowth || 0)}
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(marketData?.overview?.supplyGrowthTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(marketData?.overview?.supplyGrowthTrend || 0)}`}>
                    vs last period
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demand Index</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marketData?.overview?.demandIndex || 0}
                </p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(marketData?.overview?.demandTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(marketData?.overview?.demandTrend || 0)}`}>
                    Strong demand
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Cities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Cities</h3>
            <div className="space-y-4">
              {marketData?.topCities?.map((city, index) => (
                <div key={city.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {city.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {city.totalListings} listings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(city.avgPrice)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatPercentage(city.occupancyRate)} occupancy
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No city data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Competition Analysis */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Competition Analysis</h3>
            
            {marketData?.competitionAnalysis ? (
              <div className="space-y-6">
                {/* Your Position */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900">Your Market Position</h4>
                    <span className="text-sm text-blue-700 font-medium">
                      {marketData.competitionAnalysis.yourPosition || 'Average'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Avg Price Ranking:</p>
                      <p className="font-medium">
                        #{marketData.competitionAnalysis.priceRanking || 'N/A'} of {marketData.competitionAnalysis.totalCompetitors || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700">Performance Score:</p>
                      <p className="font-medium">
                        {marketData.competitionAnalysis.performanceScore || 0}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Competitive Insights */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Key Insights</h4>
                  {marketData.competitionAnalysis.insights?.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-1 bg-gray-200 rounded">
                        <InformationCircleIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">{insight.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-600">No competitive insights available yet.</p>
                  )}
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recommendations</h4>
                  {marketData.competitionAnalysis.recommendations?.map((rec, index) => (
                    <div key={index} className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                      <p className="text-sm text-yellow-800 font-medium">{rec.action}</p>
                      <p className="text-xs text-yellow-700 mt-1">{rec.reason}</p>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-600">No recommendations available yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Competition analysis unavailable</p>
                <p className="text-sm mt-2">More market data needed for analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Seasonal Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Seasonal Trends</h3>
          
          {marketData?.seasonalTrends?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {marketData.seasonalTrends.map((trend) => (
                <div key={trend.month} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">{trend.month}</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Demand</p>
                      <div className={`text-sm font-medium ${getTrendColor(trend.demandChange)}`}>
                        {trend.demandIndex}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg Price</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(trend.avgPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Seasonal trend data not available</p>
            </div>
          )}
        </div>

        {/* Market Alerts */}
        {marketData?.alerts?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Alerts</h3>
            <div className="space-y-4">
              {marketData.alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'opportunity' ? 'border-green-400 bg-green-50' :
                  alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                  'border-red-400 bg-red-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className={`w-5 h-5 mt-0.5 ${
                      alert.type === 'opportunity' ? 'text-green-600' :
                      alert.type === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                    <div>
                      <h4 className={`font-medium ${
                        alert.type === 'opportunity' ? 'text-green-900' :
                        alert.type === 'warning' ? 'text-yellow-900' :
                        'text-red-900'
                      }`}>
                        {alert.title}
                      </h4>
                      <p className={`text-sm mt-1 ${
                        alert.type === 'opportunity' ? 'text-green-800' :
                        alert.type === 'warning' ? 'text-yellow-800' :
                        'text-red-800'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketIntelligence;