import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import AdvancedAnalyticsDashboard from '../../components/AdvancedAnalyticsDashboard';
import AIPricingOptimization from '../../components/AIPricingOptimization';
import MarketIntelligence from '../../components/MarketIntelligence';
import GuestAnalyticsDashboard from '../../components/GuestAnalyticsDashboard';
import PerformanceTrackingDashboard from '../../components/PerformanceTrackingDashboard';
import ListingSelector from '../../components/ListingSelector';

const HostAnalyticsDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedListing, setSelectedListing] = useState(null);

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

  const tabs = [
    {
      id: 'overview',
      name: 'Analytics Overview',
      icon: ChartBarIcon,
      description: 'Comprehensive performance metrics and insights'
    },
    {
      id: 'pricing',
      name: 'AI Pricing',
      icon: SparklesIcon,
      description: 'AI-powered pricing optimization recommendations'
    },
    {
      id: 'market',
      name: 'Market Intelligence',
      icon: GlobeAltIcon,
      description: 'Competitive analysis and market trends'
    },
    {
      id: 'guests',
      name: 'Guest Analytics',
      icon: UserGroupIcon,
      description: 'Guest behavior and booking patterns'
    },
    {
      id: 'performance',
      name: 'Performance Tracking',
      icon: ArrowTrendingUpIcon,
      description: 'Revenue trends and occupancy metrics'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdvancedAnalyticsDashboard onNavigateToTab={setActiveTab} />;
      case 'pricing':
        return (
          <div className="space-y-6">
            {selectedListing ? (
              <AIPricingOptimization
                listingId={selectedListing.id}
                currentPrice={selectedListing.price}
                onPriceUpdate={(newPrice) => {
                  console.log('Price updated to:', newPrice);
                  // Handle price update
                }}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Listing for AI Pricing
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose one of your listings to get AI-powered pricing recommendations
                </p>
                <ListingSelector onSelect={setSelectedListing} />
              </div>
            )}
          </div>
        );
      case 'market':
        return <MarketIntelligence />;
      case 'guests':
        return <GuestAnalyticsDashboard />;
      case 'performance':
        return <PerformanceTrackingDashboard />;
      default:
        return <AdvancedAnalyticsDashboard onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Host Analytics</h1>
                <p className="text-gray-600 mt-2">AI-powered insights for your property business</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Pro Analytics</span> • AI-Powered Insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{tab.name}</p>
                    <p className="text-xs opacity-75">{tab.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HostAnalyticsDashboard;