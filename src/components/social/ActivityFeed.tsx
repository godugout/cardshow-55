
import React from 'react';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import { ActivityItem } from './ActivityItem';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter } from 'lucide-react';
import { LoadingState } from '@/components/common/LoadingState';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import type { ActivityFeedOptions } from '@/types/social';

interface ActivityFeedProps {
  options?: ActivityFeedOptions;
  showFilters?: boolean;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  options = {},
  showFilters = true,
  className = ''
}) => {
  const { isMobile } = useResponsiveLayout();
  const { activities, loading, error, hasMore, loadMore, refreshFeed } = useSocialFeed(options);

  if (loading && activities.length === 0) {
    return <LoadingState message="Loading activity feed..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={refreshFeed} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Feed Header */}
      {showFilters && (
        <div className="flex items-center justify-between p-4 bg-crd-darker rounded-lg border border-crd-mediumGray/20">
          <h2 className="text-xl font-bold text-white">Activity Feed</h2>
          <div className="flex gap-2">
            <Button onClick={refreshFeed} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
              {!isMobile && <span className="ml-2">Refresh</span>}
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              {!isMobile && <span className="ml-2">Filter</span>}
            </Button>
          </div>
        </div>
      )}

      {/* Activity List */}
      {activities.length === 0 ? (
        <div className="text-center py-12 bg-crd-darker rounded-lg border border-crd-mediumGray/20">
          <p className="text-crd-lightGray text-lg mb-4">No activities to show</p>
          <p className="text-crd-lightGray/70">Follow some users or create cards to see activities here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center py-4">
              <Button onClick={loadMore} variant="outline" disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
