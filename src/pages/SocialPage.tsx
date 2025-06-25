
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityFeed, SocialSidebar, CreatePostModal } from '@/components/social';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export const SocialPage: React.FC = () => {
  const { isMobile, isDesktop } = useResponsiveLayout();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Social Feed</h1>
          <Button
            onClick={() => setShowCreatePost(true)}
            className="bg-crd-green text-black hover:bg-crd-green/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            {!isMobile && 'Create Post'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isDesktop ? (
          // Desktop Layout: Two columns
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <ActivityFeed showFilters={false} />
            </div>
            <div className="col-span-4">
              <SocialSidebar />
            </div>
          </div>
        ) : (
          // Mobile Layout: Single column
          <div className="space-y-6">
            <ActivityFeed showFilters={true} />
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
      />
    </div>
  );
};
