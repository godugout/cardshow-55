
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from '@/services/cardStorage';
import type { CardData } from '@/types/card';

export interface SaveResult {
  success: boolean;
  cardId?: string;
}

export const useCardSaveOperations = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveCard = async (cardData: CardData): Promise<SaveResult> => {
    if (!user) {
      toast.error('Please sign in to save cards');
      return { success: false };
    }

    const finalCardData = {
      ...cardData,
      title: cardData.title?.trim() || 'My New Card',
      creator_id: user.id,
    };

    setIsSaving(true);
    try {
      console.log('💾 Saving card with new storage system...');
      
      // 1. Save to localStorage using new storage service
      const localResult = CardStorageService.saveCard(finalCardData);
      if (!localResult.success) {
        throw new Error(`localStorage save failed: ${localResult.error}`);
      }
      
      // 2. Attempt database save
      let dbSuccess = false;
      try {
        // Map rarity for database compatibility
        const rarityMap: Record<string, string> = {
          'common': 'common',
          'uncommon': 'uncommon',
          'rare': 'rare',
          'epic': 'legendary',
          'legendary': 'legendary'
        };

        const dbCardData = {
          title: finalCardData.title,
          description: finalCardData.description,
          creator_id: user.id,
          image_url: finalCardData.image_url,
          thumbnail_url: finalCardData.thumbnail_url,
          rarity: rarityMap[finalCardData.rarity] || 'common',
          tags: finalCardData.tags,
          design_metadata: finalCardData.design_metadata,
          is_public: finalCardData.visibility === 'public',
          visibility: finalCardData.visibility,
          marketplace_listing: finalCardData.publishing_options?.marketplace_listing || false,
          print_available: finalCardData.publishing_options?.print_available || false
        };

        const dbResult = await CardRepository.createCard(dbCardData);
        if (dbResult) {
          console.log('✅ Database save successful');
          dbSuccess = true;
          return { success: true, cardId: dbResult.id };
        }
      } catch (dbError) {
        console.warn('⚠️ Database save failed, but localStorage succeeded:', dbError);
      }

      setLastSaved(new Date());
      
      if (dbSuccess) {
        toast.success('Card saved successfully');
      } else {
        toast.success('Card saved locally (will sync to database later)');
      }
      
      return { success: true, cardId: finalCardData.id };
    } catch (error) {
      console.error('💥 Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (cardData: CardData): Promise<boolean> => {
    const updatedCard = {
      ...cardData,
      is_public: true,
      visibility: 'public' as const
    };
    
    const result = await saveCard(updatedCard);
    if (!result.success) return false;

    try {
      toast.success('Card published successfully');
      return true;
    } catch (error) {
      console.error('Error publishing card:', error);
      toast.error('Failed to publish card');
      return false;
    }
  };

  return {
    saveCard,
    publishCard,
    isSaving,
    lastSaved
  };
};
