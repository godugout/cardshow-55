
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  Settings, 
  MoreVertical,
  Lock,
  Globe,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import type { EnhancedCollection } from '@/types/collection';

interface CollectionHeaderProps {
  collection: EnhancedCollection;
  isOwner: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onInvite?: () => void;
  onLike?: () => void;
  onSettings?: () => void;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  collection,
  isOwner,
  onEdit,
  onShare,
  onInvite,
  onLike,
  onSettings
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const getVisibilityIcon = () => {
    switch (collection.visibility) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'shared':
        return <Users className="w-4 h-4" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = () => {
    switch (collection.visibility) {
      case 'public':
        return 'Public';
      case 'shared':
        return 'Shared';
      default:
        return 'Private';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {collection.title}
            </h1>
            <Badge variant="outline" className="flex items-center gap-1">
              {getVisibilityIcon()}
              {getVisibilityLabel()}
            </Badge>
            {collection.collaboration_enabled && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Collaborative
              </Badge>
            )}
          </div>
          
          {collection.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {collection.description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {collection.view_count.toLocaleString()} views
            </div>
            <div className="flex items-center gap-1">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {collection.like_count.toLocaleString()} likes
            </div>
            {collection.statistics && (
              <div className="flex items-center gap-1">
                <span>{collection.statistics.total_cards} cards</span>
              </div>
            )}
            {collection.memberships && collection.memberships.length > 1 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {collection.memberships.length} members
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOwner && (
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-1"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex items-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>

          {(isOwner || collection.collaboration_enabled) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onInvite}
              className="flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </Button>
          )}

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  Edit Collection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Delete Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};
