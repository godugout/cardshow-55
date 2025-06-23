
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardRepository } from '@/repositories/cardRepository';
import { localCardStorage } from '@/lib/localCardStorage';
import { toast } from 'sonner';
import type { Card } from '@/types/card';

export const useCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false); // Start as false to prevent infinite loading
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'database' | 'local' | 'mixed'>('local');

  const fetchAllCardsFromDatabase = useCallback(async () => {
    try {
      console.log('🔍 Fetching cards from database...');
      setLoading(true);
      
      const allCards = await CardRepository.getAllCards();
      console.log(`📊 Loaded ${allCards.length} cards from database`);
      
      setCards(allCards);
      setFeaturedCards(allCards.slice(0, 8));
      setDataSource('database');
      setError(null);
      
      return allCards;
    } catch (error) {
      console.error('💥 Error fetching cards:', error);
      
      // Fallback to local storage
      const localCards = localCardStorage.getAllCards();
      console.log(`💾 Fallback: Using ${localCards.length} local cards`);
      
      setCards(localCards);
      setFeaturedCards(localCards.slice(0, 8));
      setDataSource('local');
      setError('Using local data - database unavailable');
      
      return localCards;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserCards = useCallback(async (userId?: string) => {
    if (!user?.id && !userId) {
      return [];
    }
    
    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return [];
      
      const userCardsData = await CardRepository.getUserCards(targetUserId);
      
      if (!userId || userId === user?.id) {
        setUserCards(userCardsData);
      }
      return userCardsData;
    } catch (error) {
      console.error('💥 Error fetching user cards:', error);
      return [];
    }
  }, [user?.id]);

  const fetchCards = useCallback(async () => {
    if (loading) return; // Prevent multiple concurrent calls
    
    console.log('🚀 Starting card fetch process...');
    
    try {
      await Promise.race([
        fetchAllCardsFromDatabase(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), 5000)
        )
      ]);
      
      // Only fetch user cards if we have a user
      if (user?.id) {
        await fetchUserCards();
      }
    } catch (error) {
      console.error('💥 Error in fetchCards:', error);
      
      // Final fallback - use empty state
      setCards([]);
      setFeaturedCards([]);
      setUserCards([]);
      setError('Failed to load cards');
    }
  }, [fetchAllCardsFromDatabase, fetchUserCards, user?.id, loading]);

  // Method to migrate local cards to database (if needed)
  const migrateLocalCardsToDatabase = useCallback(async () => {
    if (!user?.id) {
      toast.error('Please sign in to migrate cards');
      return;
    }
    
    const localCards = localCardStorage.getAllCards();
    if (localCards.length === 0) {
      toast.info('No local cards to migrate');
      return;
    }
    
    console.log(`🔄 Migrating ${localCards.length} local cards to database...`);
    let migratedCount = 0;
    
    for (const localCard of localCards) {
      try {
        // Map rarity to database enum
        let dbRarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' = 'common';
        if (localCard.rarity === 'legendary') dbRarity = 'legendary';
        else if (localCard.rarity === 'epic') dbRarity = 'epic';
        else if (localCard.rarity === 'mythic') dbRarity = 'mythic';
        else if (localCard.rarity === 'rare') dbRarity = 'rare';
        else if (localCard.rarity === 'uncommon') dbRarity = 'uncommon';

        const cardData = {
          title: localCard.title,
          description: localCard.description || 'No description provided',
          creator_id: user.id,
          image_url: localCard.image_url || '',
          thumbnail_url: localCard.thumbnail_url || localCard.image_url || '',
          rarity: dbRarity,
          tags: localCard.tags || [],
          design_metadata: localCard.design_metadata || {},
          is_public: localCard.visibility === 'public',
          visibility: localCard.visibility || 'private',
          marketplace_listing: false
        };
        
        const result = await CardRepository.createCard(cardData);
        if (result) {
          migratedCount++;
        }
      } catch (error) {
        console.error(`Failed to migrate card "${localCard.title}":`, error);
      }
    }
    
    if (migratedCount > 0) {
      toast.success(`Migrated ${migratedCount} cards to database`);
      await fetchCards();
    }
  }, [user?.id, fetchCards]);

  // Simplified useEffect - only run when user changes
  useEffect(() => {
    console.log('🔄 useCards effect triggered, user:', user?.id);
    
    // Don't auto-fetch on mount to prevent loading issues
    // Users can manually trigger fetch if needed
    
    let subscription: any = null;
    
    // Only set up real-time if we have a user and cards are loaded
    if (user?.id && cards.length > 0) {
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
              // Debounce real-time updates
              setTimeout(() => {
                if (!loading) {
                  fetchCards();
                }
              }, 1000);
            }
          )
          .subscribe();
          
        console.log('📡 Real-time subscription created');
      } catch (error) {
        console.error('❌ Error setting up real-time subscription:', error);
      }
    }

    return () => {
      if (subscription) {
        console.log('🧹 Cleaning up real-time subscription');
        supabase.removeChannel(subscription);
      }
    };
  }, [user?.id]); // Only depend on user ID

  return {
    cards,
    featuredCards,
    userCards,
    loading,
    error,
    dataSource,
    fetchCards,
    fetchAllCardsFromDatabase,
    fetchUserCards,
    migrateLocalCardsToDatabase
  };
};
