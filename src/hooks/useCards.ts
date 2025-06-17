
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly instead of custom interface
type Card = Tables<'cards'>;

export const useCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicCards = async () => {
    try {
      console.log('🔍 Fetching public cards from database...');
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching public cards:', error);
        throw error;
      }
      
      console.log('✅ Fetched public cards:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('📋 Card titles:', data.map(c => c.title).join(', '));
      }
      
      setCards(data || []);
      setFeaturedCards(data?.slice(0, 8) || []);
    } catch (error) {
      console.error('💥 Error fetching public cards:', error);
      // Don't show error toast immediately, might be expected during app initialization
      setCards([]);
      setFeaturedCards([]);
    }
  };

  const fetchUserCards = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      console.log('⚠️ No user ID available for fetching user cards');
      return [];
    }
    
    try {
      console.log('👤 Fetching user cards for:', targetUserId);
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('creator_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user cards:', error);
        throw error;
      }
      
      console.log('✅ Fetched user cards:', data?.length || 0);
      const userCardsData = data || [];
      if (!userId || userId === user?.id) {
        setUserCards(userCardsData);
      }
      return userCardsData;
    } catch (error) {
      console.error('💥 Error fetching user cards:', error);
      return [];
    }
  };

  const fetchCards = async () => {
    console.log('🚀 Starting card fetch process...');
    setLoading(true);
    
    try {
      await Promise.all([
        fetchPublicCards(),
        fetchUserCards()
      ]);
    } catch (error) {
      console.error('💥 Error in fetchCards:', error);
    } finally {
      setLoading(false);
      console.log('✅ Card fetch process completed');
    }
  };

  useEffect(() => {
    console.log('🔄 useCards effect triggered, user:', user?.id);
    fetchCards();

    // Only set up real-time subscription if we have a user
    let subscription: any = null;
    
    try {
      subscription = supabase
        .channel('cards-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cards'
          },
          (payload) => {
            console.log('🔔 Real-time card change:', payload);
            fetchCards(); // Refresh cards when changes occur
          }
        )
        .subscribe();
        
      console.log('📡 Real-time subscription created');
    } catch (error) {
      console.error('❌ Error setting up real-time subscription:', error);
    }

    return () => {
      if (subscription) {
        console.log('🧹 Cleaning up real-time subscription');
        supabase.removeChannel(subscription);
      }
    };
  }, [user?.id]);

  return {
    cards,
    featuredCards,
    userCards,
    loading,
    fetchCards,
    fetchPublicCards,
    fetchUserCards
  };
};
