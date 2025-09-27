import Analytics from '../models/analytics.js';
import PricingOptimization from '../models/pricingOptimization.js';
import Recommendation from '../models/recommendation.js';
import Listing from '../models/listing.js';
import Booking from '../models/booking.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

// Get advanced analytics dashboard data
export const getAdvancedAnalytics = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    const hostId = req.user._id;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get host's listings
    const hostListings = await Listing.find({ host: hostId }).select('_id');
    const listingIds = hostListings.map(listing => listing._id);

    const filter = {
      listingId: { $in: listingIds },
      period,
      ...dateFilter
    };

    // Aggregate analytics data
    const analyticsData = await Analytics.getAggregatedData(filter);

    // Revenue trends
    const revenueTrends = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === 'daily' ? '%Y-%m-%d' : 
                     period === 'weekly' ? '%Y-%U' :
                     period === 'monthly' ? '%Y-%m' : '%Y',
              date: '$date'
            }
          },
          revenue: { $sum: '$metrics.revenue' },
          bookings: { $sum: '$metrics.bookings' },
          views: { $sum: '$metrics.views' },
          conversionRate: { $avg: '$metrics.conversionRate' }
        }
      },
      { $sort: { '_id': 1 } },
      { $limit: 12 }
    ]);

    // Performance metrics
    const performanceMetrics = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$metrics.revenue' },
          totalBookings: { $sum: '$metrics.bookings' },
          totalViews: { $sum: '$metrics.views' },
          avgRating: { $avg: '$metrics.averageRating' },
          avgOccupancy: { $avg: '$metrics.occupancyRate' },
          avgConversion: { $avg: '$metrics.conversionRate' }
        }
      }
    ]);

    // Demographic insights
    const demographicData = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          ageGroups: {
            $push: {
              $objectToArray: '$demographics.ageGroups'
            }
          },
          guestTypes: {
            $push: {
              $objectToArray: '$demographics.guestTypes'
            }
          }
        }
      }
    ]);

    // Competitive analysis
    const competitiveData = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          avgMarketPrice: { $avg: '$competitorAnalysis.averageMarketPrice' },
          marketShare: { $avg: '$competitorAnalysis.marketShare' },
          pricePosition: { $first: '$competitorAnalysis.pricePosition' }
        }
      }
    ]);

    // Seasonal patterns
    const seasonalData = await Analytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$seasonalData.season',
          avgRevenue: { $avg: '$metrics.revenue' },
          avgOccupancy: { $avg: '$metrics.occupancyRate' },
          avgPrice: { $avg: '$seasonalData.averagePricePerNight' },
          demandIndex: { $avg: '$seasonalData.demandIndex' }
        }
      }
    ]);

    // Calculate growth rates
    const growthRates = await calculateGrowthRates(filter);

    // Generate AI insights
    const aiInsights = await generateAIInsights(performanceMetrics[0], revenueTrends, competitiveData[0]);

    res.status(200).json({
      success: true,
      data: {
        overview: performanceMetrics[0] || {},
        trends: {
          revenue: revenueTrends,
          growth: growthRates
        },
        demographics: demographicData[0] || {},
        competitive: competitiveData[0] || {},
        seasonal: seasonalData,
        insights: aiInsights,
        period,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error fetching advanced analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data',
      details: error.message
    });
  }
};

// Get AI-powered pricing recommendations
export const getPricingRecommendations = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: req.user._id });
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found or access denied'
      });
    }

    const dateRange = [];
    const start = new Date(startDate || Date.now());
    const end = new Date(endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days

    // Generate recommendations for each date in range
    const recommendations = [];
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const recommendation = await PricingOptimization.getPricingRecommendation(listingId, new Date(date));
      recommendations.push({
        date: new Date(date),
        ...recommendation
      });
    }

    // Get current pricing strategy performance
    const currentStrategy = await PricingOptimization.findOne({ 
      listingId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    // Calculate potential revenue impact
    const revenueImpact = await calculateRevenueImpact(listingId, recommendations);

    res.status(200).json({
      success: true,
      data: {
        listingId,
        currentPrice: listing.pricing,
        recommendations,
        currentStrategy: currentStrategy || null,
        revenueImpact,
        summary: {
          averageOptimizedPrice: recommendations.reduce((sum, r) => sum + r.suggestedPrice, 0) / recommendations.length,
          averageConfidence: recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length,
          totalPotentialRevenue: revenueImpact.projected,
          estimatedIncrease: revenueImpact.increase
        },
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error generating pricing recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate pricing recommendations',
      details: error.message
    });
  }
};

// Apply AI pricing recommendations
export const applyPricingRecommendation = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { date, price, strategy = 'manual' } = req.body;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: req.user._id });
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found or access denied'
      });
    }

    // Create or update pricing optimization record
    const pricingData = await PricingOptimization.findOneAndUpdate(
      { listingId, date: new Date(date) },
      {
        $set: {
          appliedPrice: price,
          appliedAt: new Date(),
          'recommendations.priceAction': strategy
        }
      },
      { upsert: true, new: true }
    );

    // Update listing pricing if it's for today
    const today = new Date().toDateString();
    if (new Date(date).toDateString() === today) {
      await Listing.findByIdAndUpdate(listingId, { pricing: price });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing recommendation applied successfully',
      data: {
        listingId,
        appliedPrice: price,
        date: new Date(date),
        strategy,
        pricingData
      }
    });

  } catch (error) {
    console.error('Error applying pricing recommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to apply pricing recommendation',
      details: error.message
    });
  }
};

// Get personalized recommendations for users
export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = 'listing', limit = 10, refresh = false } = req.query;

    // Check for existing fresh recommendations
    if (!refresh) {
      const existingRecommendations = await Recommendation.findOne({
        userId,
        type,
        validUntil: { $gt: new Date() }
      }).sort({ createdAt: -1 });

      if (existingRecommendations) {
        return res.status(200).json({
          success: true,
          data: existingRecommendations,
          cached: true
        });
      }
    }

    // Generate new recommendations
    const recommendations = await Recommendation.generateRecommendations(userId, type, parseInt(limit));

    res.status(200).json({
      success: true,
      data: recommendations,
      cached: false
    });

  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate personalized recommendations',
      details: error.message
    });
  }
};

// Track user interaction with recommendations
export const trackRecommendationInteraction = async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { interaction, itemId } = req.body; // 'view', 'click', 'book'

    const recommendation = await Recommendation.findById(recommendationId);
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }

    // Update interaction metrics
    const updateField = `performance.interactions.${interaction}s`;
    await Recommendation.findByIdAndUpdate(recommendationId, {
      $inc: { [updateField]: 1 }
    });

    // If it's a booking, track conversion
    if (interaction === 'book') {
      const totalInteractions = recommendation.performance.interactions.views + 
                               recommendation.performance.interactions.clicks;
      const conversionRate = totalInteractions > 0 ? 1 / totalInteractions : 0;
      
      await Recommendation.findByIdAndUpdate(recommendationId, {
        $set: { 'performance.conversionRate': conversionRate }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interaction tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking recommendation interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track interaction',
      details: error.message
    });
  }
};

// Get market intelligence data
export const getMarketIntelligence = async (req, res) => {
  try {
    console.log('=== Market Intelligence Request ===');
    console.log('Query params:', req.query);
    console.log('User:', req.user?._id);
    
    const { location, propertyType, radius = 10 } = req.query;

    console.log('Starting market data aggregation...');
    
    // Aggregate market data
    const marketData = await Analytics.aggregate([
      {
        $match: {
          'competitorAnalysis.averageMarketPrice': { $exists: true },
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: null,
          averagePrice: { $avg: '$competitorAnalysis.averageMarketPrice' },
          totalSupply: { $sum: '$competitorAnalysis.competitorCount' },
          averageOccupancy: { $avg: '$metrics.occupancyRate' },
          averageRevenue: { $avg: '$metrics.revenue' },
          demandTrend: { $avg: '$seasonalData.demandIndex' }
        }
      }
    ]);
    
    console.log('Market data result:', marketData);

    // Get price distribution
    console.log('Starting price distribution aggregation...');
    const priceDistribution = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $bucket: {
          groupBy: '$competitorAnalysis.averageMarketPrice',
          boundaries: [0, 2000, 4000, 6000, 8000, 10000, 20000],
          default: 'other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    
    console.log('Price distribution result:', priceDistribution);

    // Seasonal trends
    console.log('Starting seasonal trends aggregation...');
    const seasonalTrends = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$seasonalData.season',
          avgPrice: { $avg: '$competitorAnalysis.averageMarketPrice' },
          avgOccupancy: { $avg: '$metrics.occupancyRate' },
          avgDemand: { $avg: '$seasonalData.demandIndex' }
        }
      }
    ]);
    
    console.log('Seasonal trends result:', seasonalTrends);

    // Generate market insights
    console.log('Generating market insights...');
    const insights = generateMarketInsights(marketData[0], seasonalTrends);
    console.log('Market insights generated successfully');

    console.log('=== Market Intelligence Response ===');
    const responseData = {
      success: true,
      data: {
        market: marketData[0] || {},
        priceDistribution,
        seasonalTrends,
        insights,
        location,
        radius,
        generatedAt: new Date()
      }
    };
    
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    res.status(200).json(responseData);

  } catch (error) {
    console.error('=== Market Intelligence Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market intelligence',
      details: error.message
    });
  }
};

// Helper function to calculate growth rates
const calculateGrowthRates = async (filter) => {
  const currentPeriod = await Analytics.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$metrics.revenue' },
        bookings: { $sum: '$metrics.bookings' }
      }
    }
  ]);

  // Previous period (for comparison)
  const previousFilter = { ...filter };
  if (filter.date) {
    const periodLength = filter.date.$lte.getTime() - filter.date.$gte.getTime();
    previousFilter.date = {
      $gte: new Date(filter.date.$gte.getTime() - periodLength),
      $lte: filter.date.$gte
    };
  }

  const previousPeriod = await Analytics.aggregate([
    { $match: previousFilter },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$metrics.revenue' },
        bookings: { $sum: '$metrics.bookings' }
      }
    }
  ]);

  const current = currentPeriod[0] || { revenue: 0, bookings: 0 };
  const previous = previousPeriod[0] || { revenue: 0, bookings: 0 };

  return {
    revenue: previous.revenue ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0,
    bookings: previous.bookings ? ((current.bookings - previous.bookings) / previous.bookings) * 100 : 0
  };
};

// Generate AI insights
const generateAIInsights = async (metrics, trends, competitive) => {
  const insights = [];

  // Revenue insights
  if (metrics?.totalRevenue) {
    if (trends?.length >= 2) {
      const recentRevenue = trends.slice(-2).reduce((sum, t) => sum + t.revenue, 0);
      const olderRevenue = trends.slice(0, 2).reduce((sum, t) => sum + t.revenue, 0);
      
      if (recentRevenue > olderRevenue) {
        insights.push({
          type: 'positive',
          title: 'Revenue Growth Trend',
          description: 'Your revenue is trending upward based on recent performance.',
          actionable: 'Consider optimizing pricing during peak demand periods.'
        });
      }
    }
  }

  // Occupancy insights
  if (metrics?.avgOccupancy < 0.6) {
    insights.push({
      type: 'warning',
      title: 'Low Occupancy Rate',
      description: `Your occupancy rate is ${(metrics.avgOccupancy * 100).toFixed(1)}%, which is below optimal.`,
      actionable: 'Consider adjusting pricing or improving listing visibility.'
    });
  }

  // Competitive insights
  if (competitive?.pricePosition === 'above') {
    insights.push({
      type: 'info',
      title: 'Premium Pricing Position',
      description: 'Your pricing is above market average.',
      actionable: 'Ensure your amenities and service justify the premium pricing.'
    });
  }

  return insights;
};

// Generate market insights
const generateMarketInsights = (marketData, seasonalTrends) => {
  const insights = [];

  // Check if marketData exists and has valid demandTrend
  if (marketData?.demandTrend && marketData.demandTrend > 80) {
    insights.push({
      type: 'opportunity',
      title: 'High Market Demand',
      description: 'Current demand in your market is high.',
      recommendation: 'Consider increasing prices to maximize revenue.'
    });
  }

  // Check if we have valid seasonal trends data
  if (seasonalTrends?.length > 0) {
    // Filter out trends with null values
    const validSeasonalTrends = seasonalTrends.filter(season => 
      season._id !== null && 
      season.avgDemand !== null && 
      season.avgDemand !== undefined &&
      !isNaN(season.avgDemand)
    );
    
    if (validSeasonalTrends.length > 0) {
      const peakSeason = validSeasonalTrends.reduce((max, season) => 
        season.avgDemand > max.avgDemand ? season : max
      );
      
      insights.push({
        type: 'seasonal',
        title: `Peak Season: ${peakSeason._id}`,
        description: `${peakSeason._id} shows highest demand with ${peakSeason.avgDemand.toFixed(1)}% demand index.`,
        recommendation: 'Prepare inventory and optimize pricing for peak season.'
      });
    }
  }

  // Add default insights if no data is available
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Getting Started',
      description: 'We\'re still collecting market data for your area.',
      recommendation: 'More insights will become available as we gather more market information.'
    });
  }

  return insights;
};

// Calculate revenue impact
const calculateRevenueImpact = async (listingId, recommendations) => {
  const historical = await Booking.aggregate([
    { $match: { listing: mongoose.Types.ObjectId(listingId) } },
    {
      $group: {
        _id: null,
        avgRevenue: { $avg: '$totalPrice' },
        avgBookingsPerMonth: { $sum: 1 }
      }
    }
  ]);

  const currentRevenue = historical[0]?.avgRevenue || 0;
  const projectedRevenue = recommendations.reduce((sum, r) => sum + r.suggestedPrice, 0) / recommendations.length;

  return {
    current: currentRevenue,
    projected: projectedRevenue,
    increase: ((projectedRevenue - currentRevenue) / currentRevenue) * 100
  };
};

export default {
  getAdvancedAnalytics,
  getPricingRecommendations,
  applyPricingRecommendation,
  getPersonalizedRecommendations,
  trackRecommendationInteraction,
  getMarketIntelligence
};