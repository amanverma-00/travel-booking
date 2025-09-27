import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const AIPricingOptimization = ({ listingId, currentPrice, onPriceUpdate }) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [applyingPrice, setApplyingPrice] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (listingId) {
      fetchPricingRecommendations();
    }
  }, [listingId]);

  const fetchPricingRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analytics/pricing-recommendations/${listingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pricing recommendations');
      }

      const data = await response.json();
      setRecommendations(data.data);
    } catch (error) {
      console.error('Error fetching pricing recommendations:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyPricingRecommendation = async (recommendation) => {
    try {
      setApplyingPrice(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analytics/apply-pricing/${listingId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          recommendationType: recommendation.type,
          newPrice: recommendation.suggestedPrice,
          reason: recommendation.reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to apply pricing recommendation');
      }

      const data = await response.json();
      setSuccess(`Pricing updated successfully to ₹${recommendation.suggestedPrice}`);
      
      // Notify parent component about price update
      if (onPriceUpdate) {
        onPriceUpdate(recommendation.suggestedPrice);
      }

      // Refresh recommendations
      setTimeout(() => {
        fetchPricingRecommendations();
        setSuccess(null);
      }, 2000);

    } catch (error) {
      console.error('Error applying pricing recommendation:', error);
      setError(error.message);
    } finally {
      setApplyingPrice(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'increase':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />;
      case 'decrease':
        return <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />;
      case 'maintain':
        return <ChartBarIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'increase':
        return 'border-green-200 bg-green-50';
      case 'decrease':
        return 'border-red-200 bg-red-50';
      case 'maintain':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getImpactColor = (impact) => {
    if (impact > 10) return 'text-green-600';
    if (impact > 0) return 'text-blue-600';
    if (impact > -10) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Pricing Optimization</h3>
            <p className="text-sm text-gray-600">Current Price: {formatCurrency(currentPrice)}</p>
          </div>
        </div>
        
        <button
          onClick={fetchPricingRecommendations}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Market Intelligence Summary */}
      {recommendations?.marketAnalysis && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <InformationCircleIcon className="w-5 h-5 mr-2" />
            Market Analysis
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Market Demand: 
                <span className="font-medium ml-1">
                  {recommendations.marketAnalysis.demand || 'Medium'}
                </span>
              </p>
              <p className="text-blue-700">Competition Level: 
                <span className="font-medium ml-1">
                  {recommendations.marketAnalysis.competition || 'Medium'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-blue-700">Seasonal Factor: 
                <span className="font-medium ml-1">
                  {recommendations.marketAnalysis.seasonalMultiplier?.toFixed(2) || '1.00'}x
                </span>
              </p>
              <p className="text-blue-700">Market Position: 
                <span className="font-medium ml-1">
                  {recommendations.marketAnalysis.position || 'Average'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Recommendations */}
      {recommendations?.recommendations?.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Recommended Actions</h4>
          
          {recommendations.recommendations.map((rec, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getRecommendationColor(rec.type)} 
                ${selectedRecommendation === index ? 'ring-2 ring-purple-500' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getRecommendationIcon(rec.type)}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="font-medium text-gray-900 capitalize">
                        {rec.type} Price
                      </h5>
                      <span className="text-sm text-gray-600">
                        Confidence: {(rec.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(currentPrice)} → {formatCurrency(rec.suggestedPrice)}
                      </p>
                      <p className={`text-sm font-medium ${getImpactColor(rec.expectedImpact)}`}>
                        Expected Impact: {rec.expectedImpact > 0 ? '+' : ''}{rec.expectedImpact.toFixed(1)}% revenue
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{rec.reason}</p>
                    
                    {rec.factors && rec.factors.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <p className="font-medium mb-1">Key Factors:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {rec.factors.map((factor, i) => (
                            <li key={i}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setSelectedRecommendation(
                      selectedRecommendation === index ? null : index
                    )}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    {selectedRecommendation === index ? 'Deselect' : 'Select'}
                  </button>
                  
                  {selectedRecommendation === index && (
                    <button
                      onClick={() => applyPricingRecommendation(rec)}
                      disabled={applyingPrice}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {applyingPrice ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No pricing recommendations available.</p>
          <p className="text-sm mt-2">More booking data is needed for AI analysis.</p>
        </div>
      )}

      {/* Historical Performance Preview */}
      {recommendations?.historicalPerformance && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Recent Performance</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Last 30 Days</p>
              <p className="font-medium">{recommendations.historicalPerformance.last30Days?.bookings || 0} bookings</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Avg Price</p>
              <p className="font-medium">{formatCurrency(recommendations.historicalPerformance.avgPrice || 0)}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Occupancy</p>
              <p className="font-medium">{(recommendations.historicalPerformance.occupancyRate * 100 || 0).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPricingOptimization;