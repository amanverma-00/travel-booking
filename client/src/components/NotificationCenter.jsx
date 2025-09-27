import React, { useState, useEffect } from 'react';
import { 
  BellIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  CalendarIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    inApp: true
  });

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?filter=${filter}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences || preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, read: true } 
              : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        credentials: 'include'
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.filter(notif => notif._id !== notificationId)
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const updatePreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(preferences)
      });
      
      if (response.ok) {
        setShowSettings(false);
        alert('Preferences updated successfully!');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Error updating preferences');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_request':
      case 'booking_confirmed':
      case 'booking_completed':
        return <CalendarIcon className="h-5 w-5" />;
      case 'payment_received':
      case 'payout_processed':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'new_message':
        return <ChatBubbleLeftIcon className="h-5 w-5" />;
      case 'review_received':
        return <EyeIcon className="h-5 w-5" />;
      default:
        return <BellIcon className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_request':
        return 'bg-blue-100 text-blue-600';
      case 'booking_confirmed':
        return 'bg-green-100 text-green-600';
      case 'payment_received':
      case 'payout_processed':
        return 'bg-yellow-100 text-yellow-600';
      case 'new_message':
        return 'bg-purple-100 text-purple-600';
      case 'review_received':
        return 'bg-indigo-100 text-indigo-600';
      case 'booking_completed':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <BellIcon className="h-8 w-8 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            </div>
            
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-600 hover:text-gray-700"
              >
                Settings
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mb-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'bookings', label: 'Bookings' },
              { key: 'payments', label: 'Payments' },
              { key: 'messages', label: 'Messages' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.inApp}
                  onChange={(e) => setPreferences(prev => ({ ...prev, inApp: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">In-app notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(e) => setPreferences(prev => ({ ...prev, email: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={(e) => setPreferences(prev => ({ ...prev, sms: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
              </label>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={updatePreferences}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No notifications yet</p>
              <p className="text-sm text-gray-500">You'll see updates about your bookings and messages here</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Mark as read"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    
                    {notification.actionUrl && (
                      <button
                        onClick={() => window.location.href = notification.actionUrl}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {notification.actionText || 'View Details'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;