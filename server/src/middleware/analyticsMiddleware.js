import Analytics from '../models/analytics.js';
import Recommendation from '../models/recommendation.js';

// Middleware to track listing views
export const trackListingView = async (req, res, next) => {
  try {
    // Extract listing ID from params or body
    const listingId = req.params.listingId || req.params.id;
    
    if (!listingId) {
      return next();
    }

    // Track the view asynchronously (don't block the response)
    setImmediate(async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update daily analytics
        await Analytics.findOneAndUpdate(
          { 
            listingId, 
            date: today,
            period: 'daily'
          },
          {
            $inc: { 
              'metrics.views': 1,
              'demographics.totalViews': 1
            },
            $set: {
              lastUpdated: new Date()
            }
          },
          { 
            upsert: true,
            new: true
          }
        );

        // Track user-specific view for recommendations if user is authenticated
        if (req.user && req.user._id) {
          await Recommendation.findOneAndUpdate(
            { userId: req.user._id },
            {
              $push: {
                'userBehavior.viewHistory': {
                  listingId,
                  timestamp: new Date(),
                  source: req.headers.referer || 'direct'
                }
              },
              $inc: {
                'userBehavior.totalViews': 1
              },
              $set: {
                lastActivity: new Date()
              }
            },
            { 
              upsert: true,
              new: true
            }
          );
        }

        // Track anonymous demographics if available
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        
        if (userAgent) {
          // Simple device detection (could be enhanced with a proper library)
          const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
          const deviceType = isMobile ? 'mobile' : 'desktop';

          await Analytics.findOneAndUpdate(
            { 
              listingId, 
              date: today,
              period: 'daily'
            },
            {
              $inc: { 
                [`demographics.devices.${deviceType}`]: 1
              }
            }
          );
        }

      } catch (error) {
        console.error('Error tracking listing view:', error);
      }
    });

    next();

  } catch (error) {
    console.error('Error in trackListingView middleware:', error);
    next(); // Don't block the request even if tracking fails
  }
};

// Middleware to track search queries
export const trackSearch = async (req, res, next) => {
  try {
    const { city, checkIn, checkOut, guests, propertyType } = req.query;

    if (!city) {
      return next();
    }

    // Track search asynchronously
    setImmediate(async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Create search analytics entry
        const searchData = {
          date: today,
          searchQuery: {
            city,
            checkIn: checkIn ? new Date(checkIn) : null,
            checkOut: checkOut ? new Date(checkOut) : null,
            guests: parseInt(guests) || 1,
            propertyType: propertyType || 'any'
          },
          userId: req.user?._id || null,
          timestamp: new Date(),
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        };

        // You might want to create a separate SearchAnalytics model for this
        // For now, we'll store it in a general way
        
        // Track user search behavior for recommendations
        if (req.user && req.user._id) {
          await Recommendation.findOneAndUpdate(
            { userId: req.user._id },
            {
              $push: {
                'userBehavior.searchHistory': searchData.searchQuery
              },
              $inc: {
                'userBehavior.totalSearches': 1
              },
              $set: {
                lastActivity: new Date()
              }
            },
            { 
              upsert: true,
              new: true
            }
          );

          // Update user preferences based on search patterns
          const preferences = {
            preferredDestinations: [city],
            preferredPropertyTypes: propertyType ? [propertyType] : [],
            avgGroupSize: parseInt(guests) || 1
          };

          await Recommendation.findOneAndUpdate(
            { userId: req.user._id },
            {
              $addToSet: {
                'userPreferences.preferredDestinations': city,
                ...(propertyType && { 'userPreferences.preferredPropertyTypes': propertyType })
              },
              $set: {
                'userPreferences.avgGroupSize': parseInt(guests) || 1,
                lastActivity: new Date()
              }
            }
          );
        }

      } catch (error) {
        console.error('Error tracking search:', error);
      }
    });

    next();

  } catch (error) {
    console.error('Error in trackSearch middleware:', error);
    next();
  }
};

// Middleware to track booking attempts
export const trackBookingAttempt = async (req, res, next) => {
  try {
    const listingId = req.params.listingId || req.body.listingId;
    
    if (!listingId) {
      return next();
    }

    // Track booking attempt asynchronously
    setImmediate(async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update daily analytics
        await Analytics.findOneAndUpdate(
          { 
            listingId, 
            date: today,
            period: 'daily'
          },
          {
            $inc: { 
              'metrics.bookingAttempts': 1
            },
            $set: {
              lastUpdated: new Date()
            }
          },
          { 
            upsert: true,
            new: true
          }
        );

        // Track user booking attempt for recommendations
        if (req.user && req.user._id) {
          await Recommendation.findOneAndUpdate(
            { userId: req.user._id },
            {
              $push: {
                'userBehavior.bookingAttempts': {
                  listingId,
                  timestamp: new Date(),
                  success: false // Will be updated if booking succeeds
                }
              },
              $set: {
                lastActivity: new Date()
              }
            },
            { 
              upsert: true,
              new: true
            }
          );
        }

      } catch (error) {
        console.error('Error tracking booking attempt:', error);
      }
    });

    next();

  } catch (error) {
    console.error('Error in trackBookingAttempt middleware:', error);
    next();
  }
};

// Middleware to track successful bookings
export const trackBookingSuccess = async (req, res, next) => {
  try {
    // This middleware should be called after a successful booking
    // You can add it to the booking success route or call it programmatically
    
    const listingId = req.booking?.listing || req.body.listingId;
    const bookingId = req.booking?._id || req.body.bookingId;
    
    if (!listingId) {
      return next();
    }

    // Track successful booking asynchronously
    setImmediate(async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update daily analytics
        await Analytics.findOneAndUpdate(
          { 
            listingId, 
            date: today,
            period: 'daily'
          },
          {
            $inc: { 
              'metrics.bookings': 1,
              'metrics.revenue': req.booking?.totalPrice || 0
            },
            $set: {
              lastUpdated: new Date()
            }
          },
          { 
            upsert: true,
            new: true
          }
        );

        // Update user recommendation data
        if (req.user && req.user._id) {
          await Recommendation.findOneAndUpdate(
            { userId: req.user._id },
            {
              $push: {
                'userBehavior.bookingHistory': {
                  listingId,
                  bookingId,
                  timestamp: new Date(),
                  amount: req.booking?.totalPrice || 0
                }
              },
              $inc: {
                'userBehavior.totalBookings': 1,
                'userBehavior.totalSpent': req.booking?.totalPrice || 0
              },
              // Mark the last booking attempt as successful
              $set: {
                lastActivity: new Date()
              }
            },
            { 
              upsert: true,
              new: true
            }
          );

          // Update the last booking attempt to mark as successful
          await Recommendation.updateOne(
            { 
              userId: req.user._id,
              'userBehavior.bookingAttempts.listingId': listingId,
              'userBehavior.bookingAttempts.success': false
            },
            {
              $set: {
                'userBehavior.bookingAttempts.$.success': true,
                'userBehavior.bookingAttempts.$.bookingId': bookingId
              }
            }
          );
        }

      } catch (error) {
        console.error('Error tracking booking success:', error);
      }
    });

    next();

  } catch (error) {
    console.error('Error in trackBookingSuccess middleware:', error);
    next();
  }
};

// Middleware to track pricing changes
export const trackPricingChange = async (listingId, oldPrice, newPrice, source = 'manual') => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Track pricing change in analytics
    await Analytics.findOneAndUpdate(
      { 
        listingId, 
        date: today,
        period: 'daily'
      },
      {
        $push: {
          'pricingHistory': {
            oldPrice,
            newPrice,
            change: newPrice - oldPrice,
            changePercent: oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0,
            source, // 'manual', 'ai_optimization', 'seasonal_adjustment'
            timestamp: new Date()
          }
        },
        $set: {
          lastUpdated: new Date()
        }
      },
      { 
        upsert: true,
        new: true
      }
    );

  } catch (error) {
    console.error('Error tracking pricing change:', error);
  }
};

export default {
  trackListingView,
  trackSearch,
  trackBookingAttempt,
  trackBookingSuccess,
  trackPricingChange
};