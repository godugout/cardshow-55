import { useState, useEffect } from 'react';
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
  const [dataSource, setDataSource] = useState<'database' | 'local' | 'mixed'>('database');

  const fetchAllCardsFromDatabase = async () => {
    try {
      console.log('🔍 Comprehensive card investigation...');
      
      // Get all cards from database
      const allCards = await CardRepository.getAllCards();
      
      // Also check if there are cards stored locally
      const localCards = localCardStorage.getAllCards();
      console.log(`💾 Found ${localCards.length} cards in local storage`);
      
      // Check collections table for any linked cards
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select(`
          *,
          collection_cards (
            card_id,
            cards (*)
          )
        `);
      
      if (!collectionsError && collectionsData) {
        console.log(`📚 Found ${collectionsData.length} collections`);
        collectionsData.forEach(collection => {
          console.log(`Collection "${collection.title}": ${collection.collection_cards?.length || 0} cards`);
        });
      }
      
      // Check memories table (in case cards were stored there)
      const { data: memoriesData, error: memoriesError } = await supabase
        .from('memories')
        .select('*');
        
      if (!memoriesError && memoriesData) {
        console.log(`🧠 Found ${memoriesData.length} memories`);
      }
      
      // Determine data source and merge if needed
      let finalCards = allCards;
      let source: 'database' | 'local' | 'mixed' = 'database';
      
      if (allCards.length === 0 && localCards.length > 0) {
        console.log('⚠️ No database cards found, but local cards exist. Consider migrating local cards to database.');
        source = 'local';
        // Could potentially migrate local cards here if needed
      } else if (allCards.length > 0 && localCards.length > 0) {
        console.log('🔄 Both database and local cards found');
        source = 'mixed';
      }
      
      setDataSource(source);
      setCards(finalCards);
      // Keep featured cards as first 8 for other parts of the app
      setFeaturedCards(finalCards.slice(0, 8));
      
      console.log(`📊 Final result: ${finalCards.length} total cards, ${finalCards.slice(0, 8).length} featured from ${source} source(s)`);
      
      return finalCards;
    } catch (error) {
      console.error('💥 Error in comprehensive card investigation:', error);
      setCards([]);
      setFeaturedCards([]);
      return [];
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
  };

  const fetchCards = async () => {
    console.log('🚀 Starting comprehensive card fetch process...');
    setLoading(true);
    
    try {
      await Promise.all([
        fetchAllCardsFromDatabase(),
        fetchUserCards()
      ]);
    } catch (error) {
      console.error('💥 Error in fetchCards:', error);
    } finally {
      setLoading(false);
      console.log('✅ Card fetch process completed');
    }
  };

  // Method to migrate local cards to database (if needed)
  const migrateLocalCardsToDatabase = async () => {
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
        // Map rarity to database enum (handle all variants)
        let dbRarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' = 'common';
        if (localCard.rarity === 'legendary') {
          dbRarity = 'legendary';
        } else if (localCard.rarity === 'epic') {
          dbRarity = 'epic';
        } else if (localCard.rarity === 'mythic') {
          dbRarity = 'mythic';
        } else if (localCard.rarity === 'rare') {
          dbRarity = 'rare';
        } else if (localCard.rarity === 'uncommon') {
          dbRarity = 'uncommon';
        } else {
          dbRarity = 'common';
        }

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
          marketplace_listing: false // Required field - default to false
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
      // Refresh cards after migration
      await fetchCards();
    }
  };

  useEffect(() => {
    console.log('🔄 useCards effect triggered, user:', user?.id);
    fetchCards();

    // Set up real-time subscription
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
    cards, // All cards - now available for Studio
    featuredCards, // First 8 cards - for other parts of the app
    userCards,
    loading,
    dataSource,
    fetchCards,
    fetchAllCardsFromDatabase,
    fetchUserCards,
    migrateLocalCardsToDatabase
  };
};
