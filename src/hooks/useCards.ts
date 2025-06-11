
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';

interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  creator_id: string;
  is_public: boolean;
  rarity: string;
  tags: string[];
  design_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicCards = async () => {
    try {
      console.log('Fetching public cards...');
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public cards:', error);
        // Use fallback data instead of throwing
        setCards([]);
        setFeaturedCards([]);
        return;
      }
      
      console.log('Public cards fetched successfully:', data?.length || 0);
      setCards(data || []);
      setFeaturedCards(data?.slice(0, 8) || []);
    } catch (error) {
      console.error('Error fetching public cards:', error);
      // Graceful fallback
      setCards([]);
      setFeaturedCards([]);
    }
  };

  const fetchUserCards = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];
    
    try {
      console.log('Fetching user cards for:', targetUserId);
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('creator_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user cards:', error);
        return [];
      }
      
      console.log('User cards fetched successfully:', data?.length || 0);
      const userCardsData = data || [];
      if (!userId || userId === user?.id) {
        setUserCards(userCardsData);
      }
      return userCardsData;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      return [];
    }
  };

  const fetchCards = async () => {
    console.log('Starting card fetch process...');
    setLoading(true);
    
    try {
      await Promise.all([fetchPublicCards(), fetchUserCards()]);
    } catch (error) {
      console.error('Error in fetchCards:', error);
      // Don't crash, just set empty state
    } finally {
      setLoading(false);
      console.log('Card fetch process completed');
    }
  };

  useEffect(() => {
    console.log('useCards hook mounting...');
    fetchCards();

    // Set up real-time subscription with better error handling
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
            console.log('Real-time update received:', payload);
            fetchCards(); // Refresh cards when changes occur
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      // Continue without real-time updates
    }

    return () => {
      console.log('useCards hook unmounting...');
      if (subscription) {
        try {
          supabase.removeChannel(subscription);
        } catch (error) {
          console.error('Error removing subscription:', error);
        }
      }
    };
  }, [user]);

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
