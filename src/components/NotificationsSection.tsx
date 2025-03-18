import React from 'react';
import { Bell, MessageSquare, Calendar, Tag, CreditCard, Trash2, Filter, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from './LoadingSpinner';

interface Notification {
  id: string;
  type: 'message' | 'session' | 'offer' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export function NotificationsSection() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      description: 'Sarah Wilson sent you a message',
      timestamp: '2025-03-16T10:00:00Z',
      read: false
    },
    {
      id: '2',
      type: 'session',
      title: 'Session Reminder',
      description: 'Your yoga session starts in 30 minutes',
      timestamp: '2025-03-16T09:30:00Z',
      read: false
    },
    {
      id: '3',
      type: 'offer',
      title: 'New Offer Available',
      description: 'Early Bird Special: 20% off morning sessions',
      timestamp: '2025-03-16T09:00:00Z',
      read: true
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      description: 'Payment for Business Strategy Session confirmed',
      timestamp: '2025-03-16T08:30:00Z',
      read: true
    }
  ]);

  const [filterType, setFilterType] = React.useState<'all' | 'message' | 'session' | 'offer' | 'payment'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'session':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'offer':
        return <Tag className="w-5 h-5 text-green-500" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-orange-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <option value="all">All Types</option>
          <option value="message">Messages</option>
          <option value="session">Sessions</option>
          <option value="offer">Offers</option>
          <option value="payment">Payments</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border ${
                notification.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
              } transition-colors duration-200`}
            >
              <div className="flex items-start">
                <div className="p-2 bg-white rounded-lg">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {format(new Date(notification.timestamp), 'HH:mm')}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 hover:bg-red-100 rounded-full text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No notifications found
            </div>
          )}
        </div>
      )}
    </div>
  );
}