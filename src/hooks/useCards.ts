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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'database' | 'local' | 'mixed'>('local');

  // Helper function to convert CardData to Card
  const convertCardDataToCard = useCallback((cardData: any): Card => {
    const now = new Date().toISOString();
    return {
      id: cardData.id || crypto.randomUUID(),
      title: cardData.title || 'Untitled Card',
      description: cardData.description || null,
      image_url: cardData.image_url || null,
      thumbnail_url: cardData.thumbnail_url || cardData.image_url || null,
      creator_id: cardData.creator_id || user?.id || '',
      rarity: cardData.rarity || 'common',
      tags: cardData.tags || [],
      design_metadata: cardData.design_metadata || {},
      visibility: cardData.visibility || 'private',
      is_public: cardData.is_public || false,
      created_at: cardData.created_at || now,
      updated_at: cardData.updated_at || now,
      template_id: cardData.template_id || null,
      collection_id: cardData.collection_id || null,
      team_id: cardData.team_id || null,
      price: cardData.price || null,
      edition_size: cardData.edition_size || null,
      marketplace_listing: cardData.marketplace_listing || false,
      crd_catalog_inclusion: cardData.crd_catalog_inclusion || null,
      print_available: cardData.print_available || null,
      verification_status: cardData.verification_status || null,
      print_metadata: cardData.print_metadata || null,
      series: cardData.series || null,
      edition_number: cardData.edition_number || null,
      total_supply: cardData.total_supply || null,
    };
  }, [user?.id]);

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
      
      // Fallback to local storage with proper type conversion
      const localCards = localCardStorage.getAllCards();
      const convertedCards = localCards.map(convertCardDataToCard);
      console.log(`💾 Fallback: Using ${convertedCards.length} local cards`);
      
      setCards(convertedCards);
      setFeaturedCards(convertedCards.slice(0, 8));
      setDataSource('local');
      setError('Using local data - database unavailable');
      
      return convertedCards;
    } finally {
      setLoading(false);
    }
  }, [convertCardDataToCard]);

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
    if (loading) return;
    
    console.log('🚀 Starting card fetch process...');
    
    try {
      // Add timeout to prevent hanging
      const fetchPromise = fetchAllCardsFromDatabase();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fetch timeout')), 8000) // 8 second timeout
      );
      
      await Promise.race([fetchPromise, timeoutPromise]);
      
      if (user?.id) {
        await fetchUserCards();
      }
    } catch (error) {
      console.error('💥 Error in fetchCards:', error);
      
      // Final fallback - use empty state with better error message
      const localCards = localCardStorage.getAllCards();
      if (localCards.length > 0) {
        const convertedCards = localCards.map(convertCardDataToCard);
        setCards(convertedCards);
        setFeaturedCards(convertedCards.slice(0, 8));
        setDataSource('local');
        setError('Using local cards - server unavailable');
      } else {
        setCards([]);
        setFeaturedCards([]);
        setUserCards([]);
        setError('Unable to load cards');
      }
    }
  }, [fetchAllCardsFromDatabase, fetchUserCards, user?.id, loading, convertCardDataToCard]);

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

  // Don't auto-fetch on mount to prevent loading loops
  useEffect(() => {
    console.log('🔄 useCards effect triggered, user:', user?.id);
    
    let subscription: any = null;
    
    // Only set up real-time if we have cards loaded and a user
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
              // Debounce real-time updates to prevent loops
              setTimeout(() => {
                if (!loading) {
                  fetchCards();
                }
              }, 2000); // Increased debounce time
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
  }, [user?.id, cards.length]); // Added cards.length dependency

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
    migrateLocalCardsToDatabase: async () => {
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
    }
  };
};
