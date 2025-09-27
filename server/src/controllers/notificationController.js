import Notification from "../models/notification.js";

// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // 'unread', 'read', 'archived'
    const types = req.query.types ? req.query.types.split(',') : null;
    const skip = (page - 1) * limit;

    const notifications = await Notification.getUserNotifications(userId, {
      status,
      types,
      limit,
      skip
    });

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      status: 'unread'
    });

    // Get counts by type
    const typeCounts = await Notification.aggregate([
      { $match: { recipient: userId, status: { $ne: 'archived' } } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalCount = await Notification.countDocuments({
      recipient: userId,
      ...(status && { status }),
      ...(types && { type: { $in: types } })
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        counts: {
          unread: unreadCount,
          byType: typeCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalNotifications: totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      {
        recipient: userId,
        status: 'unread'
      },
      {
        status: 'read',
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Archive notification
export const archiveNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.archive();

    res.status(200).json({
      success: true,
      message: 'Notification archived'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const result = await Notification.deleteOne({
      _id: notificationId,
      recipient: userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get notification preferences
export const getNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Default preferences if not set
    const defaultPreferences = {
      bookingRequests: { inApp: true, email: true, sms: false },
      bookingUpdates: { inApp: true, email: true, sms: false },
      payments: { inApp: true, email: true, sms: false },
      reviews: { inApp: true, email: true, sms: false },
      messages: { inApp: true, email: false, sms: false },
      promotions: { inApp: true, email: false, sms: false },
      reminders: { inApp: true, email: true, sms: false }
    };

    const preferences = user.notificationPreferences || defaultPreferences;

    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { preferences } = req.body;

    await User.findByIdAndUpdate(userId, {
      notificationPreferences: preferences
    });

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Send test notification (for development)
export const sendTestNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, title, message } = req.body;

    const notification = await Notification.create({
      recipient: userId,
      type: type || 'system_update',
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      priority: 'normal'
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Test notification sent'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get notification statistics (for admin dashboard)
export const getNotificationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [typeStats, statusStats, dailyStats] = await Promise.all([
      // Notifications by type
      Notification.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            unreadCount: {
              $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Notifications by status
      Notification.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),

      // Daily notification counts
      Notification.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    const totalNotifications = await Notification.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: {
        total: totalNotifications,
        byType: typeStats,
        byStatus: statusStats,
        dailyTrend: dailyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};