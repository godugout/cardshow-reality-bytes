
import { useState } from 'react';
import { Bell, Check, X, Users, Star, Trophy, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/social/useCommunityFeatures';
import type { NotificationData } from '@/types/social';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isMarkingAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'feature':
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700" align="end">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  getIcon={getNotificationIcon}
                  formatTime={formatNotificationTime}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
  formatTime: (timestamp: string) => string;
}

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  getIcon, 
  formatTime 
}: NotificationItemProps) => {
  return (
    <div 
      className={`p-4 hover:bg-gray-800 cursor-pointer border-l-2 ${
        notification.read ? 'border-transparent' : 'border-blue-500 bg-gray-800/50'
      }`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {notification.title}
              </p>
              {notification.message && (
                <p className="text-sm text-gray-400 mt-1">
                  {notification.message}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {formatTime(notification.created_at)}
              </p>
            </div>

            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
            )}
          </div>

          {/* Show user avatar if notification data contains user info */}
          {notification.data?.user_avatar && (
            <div className="flex items-center space-x-2 mt-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={notification.data.user_avatar} />
                <AvatarFallback className="text-xs">
                  {notification.data.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-400">
                {notification.data.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
