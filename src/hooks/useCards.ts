
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'database' | 'local' | 'mixed'>('database');

  const fetchAllCardsFromDatabase = useCallback(async () => {
    try {
      console.log('🔍 Starting card fetch...');
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ Card fetch timeout - using fallback data');
        setCards([]);
        setFeaturedCards([]);
        setLoading(false);
      }, 10000); // 10 second timeout
      
      // Get all cards from database
      const allCards = await CardRepository.getAllCards();
      clearTimeout(timeoutId);
      
      // Check local storage as fallback
      const localCards = localCardStorage.getAllCards();
      console.log(`💾 Found ${localCards.length} cards in local storage`);
      
      // Determine data source and merge if needed
      let finalCards = allCards;
      let source: 'database' | 'local' | 'mixed' = 'database';
      
      if (allCards.length === 0 && localCards.length > 0) {
        console.log('⚠️ No database cards found, using local cards');
        source = 'local';
      } else if (allCards.length > 0 && localCards.length > 0) {
        console.log('🔄 Both database and local cards found');
        source = 'mixed';
      }
      
      setDataSource(source);
      setCards(finalCards);
      setFeaturedCards(finalCards.slice(0, 8));
      setError(null);
      
      console.log(`📊 Loaded ${finalCards.length} cards from ${source}`);
      
      return finalCards;
    } catch (error) {
      console.error('💥 Error fetching cards:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch cards');
      setCards([]);
      setFeaturedCards([]);
      return [];
    }
  }, []);

  const fetchUserCards = useCallback(async (userId?: string) => {
    if (!user?.id && !userId) {
      console.log('⚠️ No user ID available');
      return [];
    }
    
    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return [];
      
      console.log('👤 Fetching user cards for:', targetUserId);
      const userCardsData = await CardRepository.getUserCards(targetUserId);
      
      console.log('✅ Fetched user cards:', userCardsData.length);
      
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
    console.log('🚀 Starting card fetch process...');
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchAllCardsFromDatabase(),
        fetchUserCards()
      ]);
    } catch (error) {
      console.error('💥 Error in fetchCards:', error);
      setError('Failed to load cards');
    } finally {
      setLoading(false);
      console.log('✅ Card fetch process completed');
    }
  }, [fetchAllCardsFromDatabase, fetchUserCards]);

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

  useEffect(() => {
    console.log('🔄 useCards effect triggered, user:', user?.id);
    
    // Set a loading timeout
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ useCards loading timeout - forcing completion');
        setLoading(false);
        setError('Loading timeout - please refresh the page');
      }
    }, 15000); // 15 second timeout
    
    fetchCards().finally(() => {
      clearTimeout(loadingTimeout);
    });

    // Set up real-time subscription with error handling
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
            // Debounce real-time updates to prevent excessive fetching
            setTimeout(() => fetchCards(), 1000);
          }
        )
        .subscribe();
        
      console.log('📡 Real-time subscription created');
    } catch (error) {
      console.error('❌ Error setting up real-time subscription:', error);
    }

    return () => {
      clearTimeout(loadingTimeout);
      if (subscription) {
        console.log('🧹 Cleaning up real-time subscription');
        supabase.removeChannel(subscription);
      }
    };
  }, [user?.id, fetchCards]);

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
