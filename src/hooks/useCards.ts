
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardMigrationService } from '@/services/cardMigration';
import { CardFetchingService } from '@/services/cardFetching';
import { useCardsState } from './useCardsState';
import { useRealtimeCardSubscription } from './useRealtimeCardSubscription';
import { toast } from 'sonner';

export const useCards = () => {
  const { user } = useAuth();
  const {
    cards,
    featuredCards,
    userCards,
    loading,
    dataSource,
    setLoading,
    updateCards,
    updateUserCards,
    updateDataSource
  } = useCardsState();

  const fetchAllCardsFromDatabase = async () => {
    const { cards: fetchedCards, dataSource: source } = await CardFetchingService.fetchAllCardsFromDatabase();
    updateCards(fetchedCards);
    updateDataSource(source);
    return fetchedCards;
  };

  const fetchUserCards = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];
    
    const userCardsData = await CardFetchingService.fetchUserCards(targetUserId);
    if (!userId || userId === user?.id) {
      updateUserCards(userCardsData);
    }
    return userCardsData;
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

  // Set up real-time subscription
  useRealtimeCardSubscription(fetchCards, user?.id);

  useEffect(() => {
    // Initial fetch
    fetchCards();
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
