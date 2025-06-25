
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Sparkles, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useSocialActions } from '@/hooks/useSocialActions';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { SocialActivity } from '@/types/social';

interface ActivityItemProps {
  activity: SocialActivity;
}

const REACTION_ICONS = {
  like: Heart,
  love: Heart,
  wow: Sparkles,
  rare_find: Star,
  celebrate: Trophy
};

const REACTION_COLORS = {
  like: 'text-red-500',
  love: 'text-pink-500',
  wow: 'text-yellow-500',
  rare_find: 'text-purple-500',
  celebrate: 'text-green-500'
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const { user } = useAuth();
  const { addReaction, removeReaction, loading } = useSocialActions();
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = async (reactionType: any) => {
    if (!user) return;

    const existingReaction = activity.user_reaction;
    
    if (existingReaction) {
      if (existingReaction.reaction_type === reactionType) {
        // Remove reaction if same type
        await removeReaction(existingReaction.id);
      } else {
        // Remove old reaction and add new one
        await removeReaction(existingReaction.id);
        await addReaction(activity.id, 'activity', reactionType);
      }
    } else {
      // Add new reaction
      await addReaction(activity.id, 'activity', reactionType);
    }
    
    setShowReactions(false);
  };

  const getActivityIcon = () => {
    switch (activity.activity_type) {
      case 'card_created':
        return <Sparkles className="w-5 h-5 text-crd-green" />;
      case 'collection_created':
        return <Trophy className="w-5 h-5 text-blue-500" />;
      case 'achievement':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <Heart className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderActivityContent = () => {
    const metadata = activity.metadata || {};
    
    switch (activity.activity_type) {
      case 'card_created':
        return (
          <div className="space-y-3">
            <p className="text-white">{activity.content}</p>
            {metadata.card_image && (
              <div className="rounded-lg overflow-hidden bg-black/20 max-w-md">
                <img
                  src={metadata.card_image}
                  alt={metadata.card_title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        );
      default:
        return <p className="text-white">{activity.content}</p>;
    }
  };

  return (
    <Card className="bg-crd-darker border-crd-mediumGray/20">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={activity.user?.avatar_url} />
            <AvatarFallback className="bg-crd-green text-black">
              {activity.user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white">
                {activity.user?.username || 'Unknown User'}
              </span>
              {getActivityIcon()}
            </div>
            <p className="text-sm text-crd-lightGray">
              {formatDistanceToNow(new Date(activity.activity_timestamp), { addSuffix: true })}
            </p>
          </div>

          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          {renderActivityContent()}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-crd-mediumGray/20">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 hover:bg-crd-mediumGray/20 ${
                activity.user_reaction ? REACTION_COLORS[activity.user_reaction.reaction_type] : 'text-crd-lightGray'
              }`}
              onClick={() => setShowReactions(!showReactions)}
              disabled={loading}
            >
              <Heart className="w-4 h-4" fill={activity.user_reaction ? 'currentColor' : 'none'} />
              <span className="text-sm">{activity.reaction_count}</span>
            </Button>

            {/* Reaction Picker */}
            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 flex gap-1 p-2 bg-crd-darkest rounded-lg border border-crd-mediumGray/20 shadow-lg z-10">
                {Object.entries(REACTION_ICONS).map(([type, Icon]) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="sm"
                    className={`p-2 hover:bg-crd-mediumGray/20 ${REACTION_COLORS[type as keyof typeof REACTION_COLORS]}`}
                    onClick={() => handleReaction(type)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" className="gap-2 text-crd-lightGray hover:bg-crd-mediumGray/20">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{activity.comment_count}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 text-crd-lightGray hover:bg-crd-mediumGray/20">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">{activity.share_count}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
