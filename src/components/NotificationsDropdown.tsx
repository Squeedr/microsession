import React from 'react';
import { MessageSquare, Calendar, Tag, CreditCard, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'message' | 'session' | 'offer' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onViewAll: () => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationsDropdown({ notifications, onClose, onViewAll, onMarkAsRead }: NotificationsDropdownProps) {
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

  const recentNotifications = notifications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="font-medium">Notifications</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {recentNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{notification.title}</div>
                <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(notification.timestamp), 'HH:mm')}
                </div>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500">
            No new notifications
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-200">
        <button
          onClick={onViewAll}
          className="w-full text-left text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-between"
        >
          <span>View all notifications</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}