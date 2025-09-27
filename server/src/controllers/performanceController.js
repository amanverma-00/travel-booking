import Analytics from '../models/analytics.js';
import Listing from '../models/listing.js';
import Booking from '../models/booking.js';
import Review from '../models/review.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

// Generate and update analytics data for a listing
export const updateListingAnalytics = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { date = new Date(), period = 'daily' } = req.body;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: req.user._id });
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found or access denied'
      });
    }

    const targetDate = new Date(date);
    const analytics = await calculateListingMetrics(listingId, targetDate, period);

    // Create or update analytics record
    const analyticsRecord = await Analytics.findOneAndUpdate(
      { 
        listingId, 
        date: targetDate,
        period 
      },
      {
        $set: {
          hostId: req.user._id,
          ...analytics
        }
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Analytics updated successfully',
      data: analyticsRecord
    });

  } catch (error) {
    console.error('Error updating listing analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update analytics',
      details: error.message
    });
  }
};

// Get performance dashboard for host
export const getPerformanceDashboard = async (req, res) => {
  try {
    const hostId = req.user._id;
    const { period = 'monthly', listingId } = req.query;

    // Get host's listings
    const listingsQuery = { host: hostId };
    if (listingId) {
      listingsQuery._id = listingId;
    }
    
    const hostListings = await Listing.find(listingsQuery).select('_id title images pricing averageRating');
    const listingIds = hostListings.map(listing => listing._id);

    if (listingIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          listings: [],
          summary: {},
          trends: [],
          insights: []
        }
      });
    }

    // Get latest analytics for each listing
    const analyticsData = await Analytics.aggregate([
      {
        $match: {
          listingId: { $in: listingIds },
          period,
          date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Last 90 days
        }
      },
      {
        $sort: { date: -1 }
      },
      {
        $group: {
          _id: '$listingId',
          latestData: { $first: '$$ROOT' },
          historicalData: { $push: '$$ROOT' }
        }
      }
    ]);

    // Process listing performance data
    const listingPerformance = await Promise.all(
      hostListings.map(async (listing) => {
        const analytics = analyticsData.find(a => a._id.toString() === listing._id.toString());
        const performance = await calculateListingPerformance(listing, analytics);
        
        return {
          listing: {
            _id: listing._id,
            title: listing.title,
            image: listing.images?.[0] || '',
            pricing: listing.pricing,
            rating: listing.averageRating
          },
          metrics: analytics?.latestData?.metrics || {},
          performance,
          trends: analytics?.historicalData?.slice(0, 12) || [] // Last 12 data points
        };
      })
    );

    // Calculate overall summary
    const summary = calculateSummaryMetrics(analyticsData);

    // Generate performance insights
    const insights = await generatePerformanceInsights(listingPerformance, summary);

    // Calculate benchmarks
    const benchmarks = await calculateBenchmarks(hostListings, period);

    res.status(200).json({
      success: true,
      data: {
        listings: listingPerformance,
        summary,
        insights,
        benchmarks,
        period,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error fetching performance dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance dashboard',
      details: error.message
    });
  }
};

// Get detailed listing analytics
export const getListingAnalytics = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate, granularity = 'daily' } = req.query;

    // Verify listing ownership
    const listing = await Listing.findOne({ _id: listingId, host: req.user._id })
      .populate('host', 'name email');
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found or access denied'
      });
    }

    // Set date range
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get analytics data
    const analyticsData = await Analytics.find({
      listingId,
      date: { $gte: start, $lte: end },
      period: granularity
    }).sort({ date: 1 });

    // Get booking data for the period
    const bookingData = await Booking.aggregate([
      {
        $match: {
          listing: mongoose.Types.ObjectId(listingId),
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: granularity === 'daily' ? '%Y-%m-%d' : 
                     granularity === 'weekly' ? '%Y-%U' : '%Y-%m',
              date: '$createdAt'
            }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
          avgStayDuration: { $avg: { $subtract: ['$endDate', '$startDate'] } }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get review trends
    const reviewData = await Review.aggregate([
      {
        $match: {
          listingId: mongoose.Types.ObjectId(listingId),
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: granularity === 'daily' ? '%Y-%m-%d' : 
                     granularity === 'weekly' ? '%Y-%U' : '%Y-%m',
              date: '$createdAt'
            }
          },
          reviews: { $sum: 1 },
          avgRating: { $avg: '$ratings.overall' },
          avgCleanliness: { $avg: '$ratings.cleanliness' },
          avgAccuracy: { $avg: '$ratings.accuracy' },
          avgCommunication: { $avg: '$ratings.communication' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Calculate key performance indicators
    const kpis = calculateListingKPIs(analyticsData, bookingData, reviewData);

    // Generate recommendations
    const recommendations = await generateListingRecommendations(listing, kpis, analyticsData);

    res.status(200).json({
      success: true,
      data: {
        listing: {
          _id: listing._id,
          title: listing.title,
          description: listing.description,
          images: listing.images,
          pricing: listing.pricing,
          averageRating: listing.averageRating,
          totalReviews: listing.reviews?.length || 0,
          host: listing.host
        },
        analytics: {
          raw: analyticsData,
          bookings: bookingData,
          reviews: reviewData,
          kpis,
          recommendations
        },
        dateRange: { start, end },
        granularity
      }
    });

  } catch (error) {
    console.error('Error fetching listing analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listing analytics',
      details: error.message
    });
  }
};

// Get guest behavior analytics
export const getGuestBehaviorAnalytics = async (req, res) => {
  try {
    const hostId = req.user._id;
    const { period = 'monthly' } = req.query;

    // Get host's bookings
    const hostListings = await Listing.find({ host: hostId }).select('_id');
    const listingIds = hostListings.map(listing => listing._id);

    // Analyze guest behavior patterns
    const guestBehavior = await Booking.aggregate([
      {
        $match: {
          listing: { $in: listingIds },
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'guestId',
          foreignField: '_id',
          as: 'guest'
        }
      },
      {
        $unwind: '$guest'
      },
      {
        $group: {
          _id: null,
          totalGuests: { $sum: 1 },
          repeatGuests: {
            $sum: {
              $cond: [{ $gt: ['$guest.bookingHistory.length', 1] }, 1, 0]
            }
          },
          avgBookingValue: { $avg: '$totalPrice' },
          avgStayDuration: { $avg: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 86400000] } },
          guestTypes: {
            $push: '$guest.guestProfile.tripPurpose'
          },
          ageGroups: {
            $push: '$guest.ageRange'
          },
          bookingLeadTime: {
            $avg: { $divide: [{ $subtract: ['$startDate', '$createdAt'] }, 86400000] }
          }
        }
      }
    ]);

    // Analyze booking patterns by day of week
    const bookingPatterns = await Booking.aggregate([
      {
        $match: {
          listing: { $in: listingIds },
          createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$startDate' },
          bookings: { $sum: 1 },
          avgPrice: { $avg: '$totalPrice' }
        }
      },
      {
        $project: {
          dayName: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 1] }, then: 'Sunday' },
                { case: { $eq: ['$_id', 2] }, then: 'Monday' },
                { case: { $eq: ['$_id', 3] }, then: 'Tuesday' },
                { case: { $eq: ['$_id', 4] }, then: 'Wednesday' },
                { case: { $eq: ['$_id', 5] }, then: 'Thursday' },
                { case: { $eq: ['$_id', 6] }, then: 'Friday' },
                { case: { $eq: ['$_id', 7] }, then: 'Saturday' }
              ]
            }
          },
          bookings: 1,
          avgPrice: 1
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Analyze seasonal patterns
    const seasonalPatterns = await Booking.aggregate([
      {
        $match: {
          listing: { $in: listingIds },
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $month: '$startDate' },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
          avgOccupancy: { $avg: 1 } // Simplified calculation
        }
      },
      {
        $project: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 1] }, then: 'January' },
                { case: { $eq: ['$_id', 2] }, then: 'February' },
                { case: { $eq: ['$_id', 3] }, then: 'March' },
                { case: { $eq: ['$_id', 4] }, then: 'April' },
                { case: { $eq: ['$_id', 5] }, then: 'May' },
                { case: { $eq: ['$_id', 6] }, then: 'June' },
                { case: { $eq: ['$_id', 7] }, then: 'July' },
                { case: { $eq: ['$_id', 8] }, then: 'August' },
                { case: { $eq: ['$_id', 9] }, then: 'September' },
                { case: { $eq: ['$_id', 10] }, then: 'October' },
                { case: { $eq: ['$_id', 11] }, then: 'November' },
                { case: { $eq: ['$_id', 12] }, then: 'December' }
              ]
            }
          },
          bookings: 1,
          revenue: 1,
          avgOccupancy: 1
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        guestBehavior: guestBehavior[0] || {},
        bookingPatterns,
        seasonalPatterns,
        insights: generateGuestBehaviorInsights(guestBehavior[0], bookingPatterns, seasonalPatterns),
        period,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error fetching guest behavior analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch guest behavior analytics',
      details: error.message
    });
  }
};

// Helper function to calculate listing metrics
const calculateListingMetrics = async (listingId, date, period) => {
  const startDate = new Date(date);
  const endDate = new Date(date);

  // Adjust date range based on period
  switch (period) {
    case 'daily':
      endDate.setDate(endDate.getDate() + 1);
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - 6);
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'yearly':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  // Calculate metrics
  const [bookings, views, inquiries] = await Promise.all([
    Booking.countDocuments({
      listing: listingId,
      createdAt: { $gte: startDate, $lt: endDate }
    }),
    // Views would come from a tracking system (placeholder for now)
    Promise.resolve(Math.floor(Math.random() * 100) + 50),
    // Inquiries would come from message system (placeholder for now)
    Promise.resolve(Math.floor(Math.random() * 20) + 5)
  ]);

  const totalRevenue = await Booking.aggregate([
    {
      $match: {
        listing: mongoose.Types.ObjectId(listingId),
        status: 'completed',
        createdAt: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' }
      }
    }
  ]);

  const avgRating = await Review.aggregate([
    {
      $match: {
        listingId: mongoose.Types.ObjectId(listingId),
        createdAt: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        avg: { $avg: '$ratings.overall' }
      }
    }
  ]);

  return {
    metrics: {
      views,
      inquiries,
      bookings,
      revenue: totalRevenue[0]?.total || 0,
      averageRating: avgRating[0]?.avg || 0,
      conversionRate: views > 0 ? (bookings / views) * 100 : 0,
      occupancyRate: bookings > 0 ? Math.min(bookings * 0.1, 1) : 0 // Simplified calculation
    }
  };
};

// Helper function to calculate listing performance
const calculateListingPerformance = async (listing, analytics) => {
  if (!analytics?.latestData) {
    return {
      score: 0,
      status: 'insufficient_data',
      recommendations: []
    };
  }

  const metrics = analytics.latestData.metrics;
  let score = 0;
  const recommendations = [];

  // Revenue performance (30%)
  if (metrics.revenue > 0) {
    score += 30;
  } else {
    recommendations.push('Focus on getting your first booking');
  }

  // Occupancy rate (25%)
  if (metrics.occupancyRate > 0.7) {
    score += 25;
  } else if (metrics.occupancyRate > 0.4) {
    score += 15;
    recommendations.push('Improve occupancy by adjusting pricing or availability');
  } else {
    score += 5;
    recommendations.push('Low occupancy - consider price reduction or marketing');
  }

  // Rating performance (20%)
  if (metrics.averageRating >= 4.5) {
    score += 20;
  } else if (metrics.averageRating >= 4.0) {
    score += 15;
  } else if (metrics.averageRating >= 3.5) {
    score += 10;
    recommendations.push('Work on improving guest satisfaction');
  } else {
    score += 5;
    recommendations.push('Critical: Address guest concerns to improve ratings');
  }

  // Conversion rate (15%)
  if (metrics.conversionRate > 10) {
    score += 15;
  } else if (metrics.conversionRate > 5) {
    score += 10;
  } else {
    score += 5;
    recommendations.push('Optimize listing to improve view-to-booking conversion');
  }

  // Views/visibility (10%)
  if (metrics.views > 100) {
    score += 10;
  } else if (metrics.views > 50) {
    score += 7;
  } else {
    score += 3;
    recommendations.push('Improve listing visibility through better photos and description');
  }

  return {
    score,
    status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'needs_improvement',
    recommendations: recommendations.slice(0, 3) // Top 3 recommendations
  };
};

// Helper function to calculate summary metrics
const calculateSummaryMetrics = (analyticsData) => {
  if (!analyticsData.length) {
    return {
      totalRevenue: 0,
      totalBookings: 0,
      avgOccupancy: 0,
      avgRating: 0
    };
  }

  const totals = analyticsData.reduce((acc, item) => {
    const metrics = item.latestData?.metrics || {};
    return {
      revenue: acc.revenue + (metrics.revenue || 0),
      bookings: acc.bookings + (metrics.bookings || 0),
      occupancy: acc.occupancy + (metrics.occupancyRate || 0),
      rating: acc.rating + (metrics.averageRating || 0),
      count: acc.count + 1
    };
  }, { revenue: 0, bookings: 0, occupancy: 0, rating: 0, count: 0 });

  return {
    totalRevenue: totals.revenue,
    totalBookings: totals.bookings,
    avgOccupancy: totals.count > 0 ? totals.occupancy / totals.count : 0,
    avgRating: totals.count > 0 ? totals.rating / totals.count : 0
  };
};

// Generate performance insights for host dashboard
const generatePerformanceInsights = async (listingPerformance, summary) => {
  const insights = [];
  
  try {
    // Revenue insights
    if (summary.totalRevenue > 0) {
      const topEarner = listingPerformance.reduce((prev, current) => 
        (current.metrics.revenue || 0) > (prev.metrics.revenue || 0) ? current : prev
      );
      
      insights.push({
        type: 'revenue',
        title: 'Top Performing Property',
        message: `${topEarner.listing.title} generated the highest revenue this period`,
        value: topEarner.metrics.revenue || 0,
        trend: 'positive'
      });
    }

    // Occupancy insights
    if (listingPerformance.length > 0) {
      const avgOccupancy = listingPerformance.reduce((sum, listing) => 
        sum + (listing.metrics.occupancyRate || 0), 0) / listingPerformance.length;
      
      insights.push({
        type: 'occupancy',
        title: 'Average Occupancy Rate',
        message: `Your properties maintain a ${avgOccupancy.toFixed(1)}% occupancy rate`,
        value: avgOccupancy,
        trend: avgOccupancy > 60 ? 'positive' : 'neutral'
      });
    }

    // Booking insights
    if (summary.totalBookings > 0) {
      insights.push({
        type: 'bookings',
        title: 'Booking Activity',
        message: `You received ${summary.totalBookings} bookings this period`,
        value: summary.totalBookings,
        trend: 'positive'
      });
    }

    return insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
};

// Calculate performance benchmarks
const calculateBenchmarks = async (hostListings, period) => {
  try {
    // This is a simplified benchmark calculation
    // In a real app, you'd compare against market data
    const benchmarks = {
      averageRevenue: 0,
      averageOccupancy: 65, // Industry average
      averageRating: 4.2,    // Industry average
      marketPosition: 'average'
    };

    if (hostListings.length > 0) {
      const totalRevenue = hostListings.reduce((sum, listing) => 
        sum + (listing.pricing?.basePrice || 0), 0);
      benchmarks.averageRevenue = totalRevenue / hostListings.length;
      
      const avgRating = hostListings.reduce((sum, listing) => 
        sum + (listing.averageRating || 0), 0) / hostListings.length;
      benchmarks.averageRating = avgRating;
      
      // Determine market position
      if (avgRating >= 4.5) {
        benchmarks.marketPosition = 'excellent';
      } else if (avgRating >= 4.0) {
        benchmarks.marketPosition = 'good';
      } else {
        benchmarks.marketPosition = 'needs_improvement';
      }
    }

    return benchmarks;
  } catch (error) {
    console.error('Error calculating benchmarks:', error);
    return {
      averageRevenue: 0,
      averageOccupancy: 0,
      averageRating: 0,
      marketPosition: 'unknown'
    };
  }
};

// Additional helper functions would be implemented here...

export default {
  updateListingAnalytics,
  getPerformanceDashboard,
  getListingAnalytics,
  getGuestBehaviorAnalytics
};