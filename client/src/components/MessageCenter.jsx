import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  UserCircleIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

const MessageCenter = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.booking.id);
      markMessagesAsRead(selectedConversation.booking.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages/conversations', {
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setConversations(result.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (bookingId) => {
    try {
      const response = await fetch(`/api/messages/booking/${bookingId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(result.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      const response = await fetch(`/api/messages/booking/${selectedConversation.booking.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newMessage.trim(),
          messageType: 'text'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(prev => [...prev, result.data]);
        setNewMessage('');
        // Update conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const markMessagesAsRead = async (bookingId) => {
    try {
      await fetch(`/api/messages/booking/${bookingId}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMessageTime = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffInHours < 24 * 7) {
      return format(date, 'EEE HH:mm');
    } else {
      return format(date, 'MMM d, HH:mm');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Messages
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.booking.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.booking.id === conversation.booking.id
                          ? 'bg-blue-50 border-blue-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {conversation.participant.profilePicture ? (
                          <img
                            src={conversation.participant.profilePicture}
                            alt={conversation.participant.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.participant.name}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.booking.listing.title}
                          </p>
                          
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(conversation.booking.status)}`}>
                              {conversation.booking.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              ₹{conversation.booking.totalAmount}
                            </span>
                          </div>
                          
                          {conversation.latestMessage && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {conversation.latestMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {selectedConversation.participant.profilePicture ? (
                          <img
                            src={selectedConversation.participant.profilePicture}
                            alt={selectedConversation.participant.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {selectedConversation.participant.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedConversation.booking.listing.title}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {format(parseISO(selectedConversation.booking.startDate), 'MMM d')} - {format(parseISO(selectedConversation.booking.endDate), 'MMM d')}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(selectedConversation.booking.status)}`}>
                          {selectedConversation.booking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = message.sender && message.sender._id === user._id;
                      const isSystemMessage = message.isSystemMessage;

                      if (isSystemMessage) {
                        return (
                          <div key={message._id} className="flex justify-center">
                            <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                              {message.content}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={message._id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isCurrentUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;