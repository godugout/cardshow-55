
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CollectionHeader } from './CollectionHeader';
import { CollectionStats } from './CollectionStats';
import { CollectionActivityFeed } from './CollectionActivityFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnhancedCollections, useCollectionActivityFeed, useCollectionStatistics } from '@/hooks/useEnhancedCollections';
import { useCollectionRealtime, useCollectionPresence } from '@/hooks/useCollectionRealtime';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const EnhancedCollectionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cards');
  
  const { collections, loading, refetch } = useEnhancedCollections(user?.id);
  const collection = collections.find(c => c.id === id);
  const isOwner = collection?.user_id === user?.id;

  const { statistics, loading: statsLoading } = useCollectionStatistics(id || '');
  const { activities, loading: activitiesLoading } = useCollectionActivityFeed(id || '');

  // Real-time subscriptions
  useCollectionRealtime({
    collectionId: id || '',
    onCollectionUpdate: () => {
      refetch();
      toast.info('Collection updated by another user');
    },
    onCardAdded: (payload) => {
      refetch();
      toast.success('New card added to collection');
    },
    onCardRemoved: (payload) => {
      refetch();
      toast.info('Card removed from collection');
    },
    onActivityAdded: () => {
      // Activity feed will update automatically
    },
    onMembershipChange: () => {
      refetch();
      toast.info('Collection membership changed');
    }
  });

  // Presence tracking
  useCollectionPresence(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Collection Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The collection you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CollectionHeader
          collection={collection}
          isOwner={isOwner}
          onEdit={() => console.log('Edit collection')}
          onShare={() => console.log('Share collection')}
          onInvite={() => console.log('Invite collaborators')}
          onLike={() => console.log('Like collection')}
          onSettings={() => console.log('Collection settings')}
        />

        <div className="mt-8">
          {statistics && !statsLoading && (
            <CollectionStats statistics={statistics} className="mb-8" />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="cards" className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Collection Cards</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Card grid and management interface will be implemented here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <CollectionActivityFeed 
                activities={activities} 
                loading={activitiesLoading}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Collection Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed analytics and insights will be implemented here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Collection Members</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Member management and collaboration tools will be implemented here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
