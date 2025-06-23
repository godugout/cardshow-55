
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseCollectionRealtimeProps {
  collectionId: string;
  onCollectionUpdate?: (payload: any) => void;
  onCardAdded?: (payload: any) => void;
  onCardRemoved?: (payload: any) => void;
  onActivityAdded?: (payload: any) => void;
  onMembershipChange?: (payload: any) => void;
}

export const useCollectionRealtime = ({
  collectionId,
  onCollectionUpdate,
  onCardAdded,
  onCardRemoved,
  onActivityAdded,
  onMembershipChange
}: UseCollectionRealtimeProps) => {
  useEffect(() => {
    if (!collectionId) return;

    const channels: RealtimeChannel[] = [];

    // Subscribe to collection changes
    const collectionChannel = supabase
      .channel(`collection-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'collections',
          filter: `id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Collection updated:', payload);
          onCollectionUpdate?.(payload);
        }
      )
      .subscribe();

    channels.push(collectionChannel);

    // Subscribe to collection cards changes
    const cardsChannel = supabase
      .channel(`collection-cards-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'collection_cards',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Card added:', payload);
          onCardAdded?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'collection_cards',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Card removed:', payload);
          onCardRemoved?.(payload);
        }
      )
      .subscribe();

    channels.push(cardsChannel);

    // Subscribe to activity feed
    const activityChannel = supabase
      .channel(`collection-activity-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'collection_activity_feed',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('New activity:', payload);
          onActivityAdded?.(payload);
        }
      )
      .subscribe();

    channels.push(activityChannel);

    // Subscribe to membership changes
    const membershipChannel = supabase
      .channel(`collection-memberships-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_memberships',
          filter: `collection_id=eq.${collectionId}`
        },
        (payload) => {
          console.log('Membership changed:', payload);
          onMembershipChange?.(payload);
        }
      )
      .subscribe();

    channels.push(membershipChannel);

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [collectionId, onCollectionUpdate, onCardAdded, onCardRemoved, onActivityAdded, onMembershipChange]);
};

export const useCollectionPresence = (collectionId: string) => {
  useEffect(() => {
    if (!collectionId) return;

    const channel = supabase.channel(`collection-presence-${collectionId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        console.log('Presence sync:', newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        const userStatus = {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          online_at: new Date().toISOString(),
          collection_id: collectionId
        };

        await channel.track(userStatus);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collectionId]);
};
