
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from '@/services/cardStorage';
import { CardMigrationService } from '@/services/cardMigration';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly instead of custom interface
type Card = Tables<'cards'>;

// Generate unique channel names to prevent subscription conflicts
const generateChannelId = () => `cards-changes-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

export const useCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'database' | 'local' | 'mixed'>('database');
  
  // Track subscription state to prevent duplicates
  const subscriptionRef = useRef<any>(null);
  const channelIdRef = useRef<string | null>(null);
  const isSubscribedRef = useRef(false);

  const fetchAllCardsFromDatabase = async () => {
    try {
      console.log('🔍 Fetching all cards from database...');
      
      const allCards = await CardRepository.getAllCards();
      
      // Check local storage situation
      const storageReport = CardStorageService.getStorageReport();
      console.log(`💾 Local storage report:`, storageReport);
      
      // Determine data source
      let source: 'database' | 'local' | 'mixed' = 'database';
      
      if (allCards.length === 0 && storageReport.totalCards > 0) {
        console.log('⚠️ No database cards found, but local cards exist');
        source = 'local';
      } else if (allCards.length > 0 && storageReport.totalCards > 0) {
        console.log('🔄 Both database and local cards found');
        source = 'mixed';
      }
      
      setDataSource(source);
      setCards(allCards);
      setFeaturedCards(allCards.slice(0, 8));
      
      console.log(`📊 Final result: ${allCards.length} cards from ${source} source`);
      return allCards;
    } catch (error) {
      console.error('💥 Error fetching cards:', error);
      setCards([]);
      setFeaturedCards([]);
      return [];
    }
  };

  const fetchUserCards = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];
    
    try {
      const result = await CardRepository.getCards({
        creator_id: targetUserId,
        includePrivate: true,
        pageSize: 100
      });
      
      const userCardsData = result.cards;
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
    }
  };

  // Enhanced migration with detailed error reporting
  const migrateLocalCardsToDatabase = async () => {
    if (!user?.id) {
      toast.error('Please sign in to migrate cards');
      return;
    }

    try {
      console.log('🔄 Starting enhanced card migration...');
      
      // First, preview the migration
      const preview = await CardMigrationService.previewMigration(user.id);
      
      if (preview.report.totalCards === 0) {
        toast.info('No local cards found to migrate');
        return;
      }

      console.log('📋 Migration preview:', preview);
      
      // Show preview to user
      if (preview.invalidCards > 0) {
        toast.warning(`Found ${preview.invalidCards} cards with validation issues. Check console for details.`);
        console.warn('Validation issues:', preview.validationIssues);
      }

      // Execute migration
      toast.loading(`Migrating ${preview.report.totalCards} cards...`, { id: 'migration' });
      
      const result = await CardMigrationService.executeMigration(user.id);
      
      toast.dismiss('migration');
      
      if (result.success) {
        const message = `Successfully migrated ${result.migratedCount} cards${
          result.failedCount > 0 ? ` (${result.failedCount} failed)` : ''
        }`;
        toast.success(message);
        
        if (result.warnings.length > 0) {
          console.warn('Migration warnings:', result.warnings);
        }
        
        // Refresh cards after successful migration
        await fetchCards();
      } else {
        toast.error(`Migration failed: ${result.failedCount} cards could not be migrated`);
      }
      
      // Log detailed results
      if (result.errors.length > 0) {
        console.group('❌ Migration Errors');
        result.errors.forEach(error => {
          console.error(`${error.cardTitle} (${error.cardId}): ${error.error}`);
        });
        console.groupEnd();
      }
      
      console.log('🎯 Migration completed:', {
        total: result.totalCards,
        migrated: result.migratedCount,
        failed: result.failedCount,
        success: result.success
      });
      
    } catch (error) {
      console.error('💥 Migration system error:', error);
      toast.error('Migration system error. Check console for details.');
    }
  };

  // Cleanup function to properly remove subscription
  const cleanupSubscription = () => {
    if (subscriptionRef.current && channelIdRef.current) {
      console.log(`🧹 Cleaning up subscription: ${channelIdRef.current}`);
      try {
        supabase.removeChannel(subscriptionRef.current);
      } catch (error) {
        console.warn('Warning during subscription cleanup:', error);
      }
      subscriptionRef.current = null;
      channelIdRef.current = null;
      isSubscribedRef.current = false;
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCards();

    // Clean up any existing subscription before creating a new one
    cleanupSubscription();

    // Create unique channel name for this instance
    const channelName = generateChannelId();
    channelIdRef.current = channelName;
    
    console.log(`📡 Setting up subscription with channel: ${channelName}`);
    
    try {
      const channel = supabase.channel(channelName);
      
      subscriptionRef.current = channel
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'cards'
        }, (payload) => {
          console.log('🔔 Real-time card change:', payload);
          // Debounce rapid changes by using a timeout
          setTimeout(() => {
            fetchCards();
          }, 100);
        })
        .subscribe((status) => {
          console.log(`📡 Subscription status for ${channelName}:`, status);
          isSubscribedRef.current = status === 'SUBSCRIBED';
          
          if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Channel error for ${channelName}`);
            cleanupSubscription();
          }
        });
    } catch (error) {
      console.error('💥 Error setting up subscription:', error);
    }

    // Cleanup function
    return () => {
      cleanupSubscription();
    };
  }, [user?.id]);

  return {
    cards,
    featuredCards,
    userCards,
    loading,
    dataSource,
    fetchCards,
    fetchAllCardsFromDatabase,
    fetchUserCards,
    migrateLocalCardsToDatabase
  };
};
