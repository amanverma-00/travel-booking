import Message from "../models/message.js";
import Booking from "../models/booking.js";
import User from "../models/user.js";

// Get messages for a booking (conversation thread)
export const getBookingMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Verify user is part of this booking
    const booking = await Booking.findById(bookingId)
      .populate('host', 'name profilePicture')
      .populate('user', 'name profilePicture');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const userId = req.user._id;
    const isAuthorized = booking.user._id.toString() === userId.toString() || 
                        booking.host._id.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get messages with pagination
    const messages = await Message.find({ booking: bookingId })
      .populate('sender', 'name profilePicture role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        booking: bookingId,
        sender: { $ne: userId },
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId },
        readAt: new Date()
      }
    );

    const totalMessages = await Message.countDocuments({ booking: bookingId });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Show oldest first
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasNext: page < Math.ceil(totalMessages / limit),
          hasPrev: page > 1
        },
        booking: {
          id: booking._id,
          status: booking.status,
          host: booking.host,
          guest: booking.user
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

// Send a message in booking conversation
export const sendMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { content, messageType = 'text' } = req.body;

    // Verify booking exists and user is authorized
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const userId = req.user._id;
    const isAuthorized = booking.user.toString() === userId.toString() || 
                        booking.host.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Create message
    const message = new Message({
      booking: bookingId,
      sender: userId,
      content,
      messageType,
      readBy: [userId] // Sender automatically reads their own message
    });

    await message.save();

    // Populate sender info for response
    await message.populate('sender', 'name profilePicture role');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all conversations for a user (list of bookings with messages)
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let bookingQuery;
    if (userRole === 'host' || userRole === 'admin') {
      // Get bookings where user is either guest or host
      bookingQuery = {
        $or: [
          { user: userId },
          { host: userId }
        ]
      };
    } else {
      // Regular user - only their bookings
      bookingQuery = { user: userId };
    }

    // Find bookings with messages
    const bookingsWithMessages = await Booking.find(bookingQuery)
      .populate('listing', 'title images location')
      .populate('user', 'name profilePicture')
      .populate('host', 'name profilePicture')
      .sort({ updatedAt: -1 });

    // Get latest message and unread count for each booking
    const conversations = await Promise.all(
      bookingsWithMessages.map(async (booking) => {
        const latestMessage = await Message.findOne({ booking: booking._id })
          .populate('sender', 'name')
          .sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          booking: booking._id,
          sender: { $ne: userId },
          readBy: { $ne: userId }
        });

        const otherParticipant = booking.user._id.toString() === userId.toString() 
          ? booking.host 
          : booking.user;

        return {
          booking: {
            id: booking._id,
            status: booking.status,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalAmount: booking.totalAmount,
            listing: booking.listing
          },
          participant: otherParticipant,
          latestMessage: latestMessage ? {
            content: latestMessage.content,
            messageType: latestMessage.messageType,
            sender: latestMessage.sender,
            createdAt: latestMessage.createdAt
          } : null,
          unreadCount,
          lastActivity: booking.updatedAt
        };
      })
    );

    // Filter out conversations with no messages and sort by latest activity
    const activeConversations = conversations
      .filter(conv => conv.latestMessage !== null)
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    res.status(200).json({
      success: true,
      data: activeConversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    // Verify user is part of this booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const isAuthorized = booking.user.toString() === userId.toString() || 
                        booking.host.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Mark all unread messages as read
    const result = await Message.updateMany(
      {
        booking: bookingId,
        sender: { $ne: userId },
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId },
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} messages as read`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Send system message (for booking updates)
export const sendSystemMessage = async (bookingId, messageType, content) => {
  try {
    const systemMessage = new Message({
      booking: bookingId,
      sender: null, // System message
      content,
      messageType,
      isSystemMessage: true
    });

    await systemMessage.save();
    return systemMessage;
  } catch (error) {
    console.error('Error sending system message:', error);
    throw error;
  }
};