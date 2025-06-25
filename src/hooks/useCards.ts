import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardRepository } from '@/repositories/cardRepository';
import { localCardStorage } from '@/lib/localCardStorage';
import { toast } from 'sonner';
import type { Card } from '@/types/card';

export const useCards = () => {
  const { user, loading: authLoading } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'database' | 'local' | 'mixed'>('database');

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
      edition_size: cardData.edition_size || cardData.price || null, // Ensure edition_size is included
      marketplace_listing: cardData.marketplace_listing || false,
      crd_catalog_inclusion: cardData.crd_catalog_inclusion || null,
      print_available: cardData.print_available || null,
      verification_status: cardData.verification_status || null,
      print_metadata: cardData.print_metadata || null,
      series: cardData.series || null,
      edition_number: cardData.edition_number || null,
      total_supply: cardData.total_supply || null,
      // Additional database fields - ensure they're all included
      abilities: cardData.abilities || [],
      base_price: cardData.base_price || null,
      card_type: cardData.card_type || null,
      current_market_value: cardData.current_market_value || null,
      favorite_count: cardData.favorite_count || 0,
      view_count: cardData.view_count || 0,
      royalty_percentage: cardData.royalty_percentage || null,
      serial_number: cardData.serial_number || null,
      set_id: cardData.set_id || null,
      mana_cost: cardData.mana_cost || null,
      toughness: cardData.toughness || null,
      power: cardData.power || null,
      // Additional optional fields for backward compatibility
      card_set_id: cardData.card_set_id || null,
      current_supply: cardData.current_supply || null,
      is_tradeable: cardData.is_tradeable || null,
      name: cardData.name || null,
    };
  }, [user?.id]);

  const fetchAllCardsFromDatabase = useCallback(async () => {
    if (authLoading) {
      console.log('🔄 Waiting for auth to complete before fetching cards');
      return [];
    }

    try {
      console.log('🔍 Fetching cards from database...');
      setLoading(true);
      setError(null);
      
      // First check if user is authenticated
      if (!user) {
        console.log('👤 No authenticated user - fetching public cards only');
        // Try to fetch public cards
        const { data: publicCards, error: publicError } = await supabase
          .from('cards')
          .select('*')
          .eq('is_public', true)
          .limit(20);
          
        if (publicError) {
          throw publicError;
        }
        
        console.log(`📊 Loaded ${publicCards?.length || 0} public cards`);
        const dbCards = publicCards || [];
        setCards(dbCards);
        setFeaturedCards(dbCards.slice(0, 8));
        setDataSource('database');
        return dbCards;
      }
      
      // User is authenticated - fetch all accessible cards
      const allCards = await CardRepository.getAllCards();
      console.log(`📊 Loaded ${allCards.length} cards from database for user ${user.id}`);
      
      setCards(allCards);
      setFeaturedCards(allCards.slice(0, 8));
      setDataSource('database');
      
      return allCards;
    } catch (error) {
      console.error('💥 Error fetching cards:', error);
      
      // More specific error handling
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      setError(errorMessage);
      
      // Fallback to local storage with proper type conversion
      const localCards = localCardStorage.getAllCards();
      const convertedCards = localCards.map(convertCardDataToCard);
      console.log(`💾 Fallback: Using ${convertedCards.length} local cards`);
      
      setCards(convertedCards);
      setFeaturedCards(convertedCards.slice(0, 8));
      setDataSource('local');
      
      return convertedCards;
    } finally {
      setLoading(false);
    }
  }, [convertCardDataToCard, authLoading, user]);

  const fetchUserCards = useCallback(async (userId?: string) => {
    if (authLoading || (!user?.id && !userId)) {
      return [];
    }
    
    try {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return [];
      
      console.log('👤 Fetching user cards for:', targetUserId);
      const userCardsData = await CardRepository.getUserCards(targetUserId);
      
      if (!userId || userId === user?.id) {
        setUserCards(userCardsData);
      }
      return userCardsData;
    } catch (error) {
      console.error('💥 Error fetching user cards:', error);
      return [];
    }
  }, [user?.id, authLoading]);

  const fetchCards = useCallback(async () => {
    if (loading || authLoading) {
      console.log('🔄 Already loading or auth in progress, skipping fetch');
      return;
    }
    
    console.log('🚀 Starting card fetch process...');
    
    try {
      await fetchAllCardsFromDatabase();
      
      if (user?.id) {
        await fetchUserCards();
      }
    } catch (error) {
      console.error('💥 Error in fetchCards:', error);
      
      // Final fallback - use local storage or empty state
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
        setError('No cards available');
      }
    }
  }, [fetchAllCardsFromDatabase, fetchUserCards, user?.id, loading, authLoading, convertCardDataToCard]);

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

  // Auto-fetch when auth completes but don't create loading loops
  useEffect(() => {
    if (!authLoading && !loading && cards.length === 0) {
      console.log('🔄 Auth completed, fetching initial cards');
      fetchCards();
    }
  }, [authLoading]); // Only trigger when auth loading state changes

  // Set up real-time subscriptions only after initial load
  useEffect(() => {
    if (loading || authLoading) {
      return;
    }

    console.log('📡 Setting up real-time subscription');
    
    const subscription = supabase
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

    return () => {
      console.log('🧹 Cleaning up real-time subscription');
      supabase.removeChannel(subscription);
    };
  }, [loading, authLoading]);

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
