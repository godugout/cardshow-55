
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Minus, 
  Move, 
  Share2, 
  Edit, 
  Tag, 
  MessageSquare,
  UserPlus
} from 'lucide-react';
import type { CollectionActivityFeedItem } from '@/types/collection';

interface CollectionActivityFeedProps {
  activities: CollectionActivityFeedItem[];
  loading?: boolean;
}

export const CollectionActivityFeed: React.FC<CollectionActivityFeedProps> = ({
  activities,
  loading = false
}) => {
  const getActivityIcon = (activityType: string) => {
    const icons = {
      card_added: Plus,
      card_removed: Minus,
      card_moved: Move,
      collection_shared: Share2,
      collection_renamed: Edit,
      tag_added: Tag,
      note_added: MessageSquare,
      collaboration_invite: UserPlus
    };
    
    const Icon = icons[activityType as keyof typeof icons] || Plus;
    return <Icon className="w-4 h-4" />;
  };

  const getActivityColor = (activityType: string) => {
    const colors = {
      card_added: 'bg-green-500',
      card_removed: 'bg-red-500',
      card_moved: 'bg-blue-500',
      collection_shared: 'bg-purple-500',
      collection_renamed: 'bg-yellow-500',
      tag_added: 'bg-indigo-500',
      note_added: 'bg-pink-500',
      collaboration_invite: 'bg-cyan-500'
    };
    
    return colors[activityType as keyof typeof colors] || 'bg-gray-500';
  };

  const formatActivityMessage = (activity: CollectionActivityFeedItem) => {
    const { activity_type, activity_data, user_profile } = activity;
    const username = user_profile?.username || 'Someone';
    
    switch (activity_type) {
      case 'card_added':
        return `${username} added ${activity_data.card_name || 'a card'}`;
      case 'card_removed':
        return `${username} removed ${activity_data.card_name || 'a card'}`;
      case 'card_moved':
        return `${username} moved ${activity_data.card_name || 'a card'}`;
      case 'collection_shared':
        return `${username} shared the collection`;
      case 'collection_renamed':
        return `${username} renamed the collection`;
      case 'tag_added':
        return `${username} added tag "${activity_data.tag_name}"`;
      case 'note_added':
        return `${username} added a note`;
      case 'collaboration_invite':
        return `${username} invited ${activity_data.invited_username || 'someone'} to collaborate`;
      default:
        return `${username} performed an action`;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-1" />
                  <div className="w-1/2 h-3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white
                  ${getActivityColor(activity.activity_type)}
                `}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={activity.user_profile?.avatar_url} />
                      <AvatarFallback>
                        {activity.user_profile?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatActivityMessage(activity)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(activity.created_at)}
                    </span>
                    {activity.is_public && (
                      <Badge variant="outline" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
