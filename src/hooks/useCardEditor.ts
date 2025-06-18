import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CardRepository } from '@/repositories/cardRepository';
import { localCardStorage } from '@/lib/localCardStorage';
import { toast } from 'sonner';
import type { CardData, CardRarity, CardVisibility } from '@/types/card';

export interface DesignTemplate {
  id: string;
  name: string;
  template_data: Record<string, any>;
  tags: string[];
  category?: string;
  description?: string;
  usage_count?: number;
  is_premium?: boolean;
  preview_url?: string;
}

interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const { user } = useAuth();
  const [cardData, setCardData] = useState<CardData>(() => {
    const defaultData: CardData = {
      title: '',
      description: '',
      rarity: 'common',
      tags: [],
      design_metadata: {},
      visibility: 'private',
      creator_attribution: {
        creator_name: user?.user_metadata?.full_name || user?.email || '',
        creator_id: user?.id || '',
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    };

    return options.initialData ? { ...defaultData, ...options.initialData } : defaultData;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateCardField = useCallback(<K extends keyof CardData>(field: K, value: CardData[K]) => {
    console.log(`🔄 Updating card field: ${String(field)} =`, value);
    setCardData(prev => {
      const updated = { ...prev, [field]: value };
      console.log('📝 Updated card data:', updated);
      return updated;
    });
    setIsDirty(true);
  }, []);

  const saveCard = useCallback(async (): Promise<boolean> => {
    if (!user?.id) {
      console.error('❌ Cannot save card: No user ID available');
      toast.error('Please sign in to save cards');
      return false;
    }

    if (!cardData.title?.trim()) {
      console.error('❌ Cannot save card: No title provided');
      toast.error('Please enter a card title');
      return false;
    }

    setIsSaving(true);
    console.log('💾 Starting card save process...', cardData);

    try {
      // Prepare card data for database
      const dbCardData = {
        title: cardData.title.trim(),
        description: cardData.description || 'No description provided',
        creator_id: user.id,
        image_url: cardData.image_url || '',
        thumbnail_url: cardData.thumbnail_url || cardData.image_url || '',
        rarity: mapRarityToDatabase(cardData.rarity),
        tags: cardData.tags || [],
        design_metadata: cardData.design_metadata || {},
        visibility: cardData.visibility || 'private',
        is_public: cardData.visibility === 'public',
        template_id: cardData.template_id || null,
        marketplace_listing: cardData.publishing_options?.marketplace_listing || false,
        crd_catalog_inclusion: cardData.publishing_options?.crd_catalog_inclusion || true,
        print_available: cardData.publishing_options?.print_available || false,
        price: cardData.price || null,
        edition_size: cardData.edition_size || null,
        series: cardData.series || null,
        edition_number: cardData.edition_number || null,
        total_supply: cardData.total_supply || null,
        print_metadata: cardData.print_metadata || {}
      };

      console.log('🎯 Prepared card data for database:', dbCardData);

      let savedCard;
      if (cardData.id) {
        // Update existing card
        console.log('🔄 Updating existing card:', cardData.id);
        const success = await CardRepository.updateCard(cardData.id, dbCardData);
        if (success) {
          savedCard = { ...cardData, ...dbCardData };
          console.log('✅ Card updated successfully');
          toast.success('Card updated successfully');
        } else {
          throw new Error('Failed to update card');
        }
      } else {
        // Create new card
        console.log('🆕 Creating new card...');
        savedCard = await CardRepository.createCard(dbCardData);
        if (savedCard) {
          console.log('✅ Card created successfully:', savedCard);
          setCardData(prev => ({ ...prev, id: savedCard.id }));
          toast.success('Card created successfully');
        } else {
          throw new Error('Failed to create card');
        }
      }

      setIsDirty(false);
      setLastSaved(new Date());
      
      // Remove from local storage if it exists there
      if (cardData.id) {
        localCardStorage.markAsSynced(cardData.id);
      }

      return true;
    } catch (error) {
      console.error('💥 Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
      
      // Fallback to local storage
      try {
        console.log('🔄 Falling back to local storage...');
        const localId = localCardStorage.saveCard(cardData);
        console.log('💾 Saved to local storage with ID:', localId);
        toast.info('Card saved locally. Will sync when online.');
        setCardData(prev => ({ ...prev, id: localId, needsSync: true }));
        setIsDirty(false);
        setLastSaved(new Date());
        return true;
      } catch (localError) {
        console.error('💥 Local storage fallback failed:', localError);
        return false;
      }
    } finally {
      setIsSaving(false);
    }
  }, [cardData, user?.id]);

  const publishCard = useCallback(async (): Promise<boolean> => {
    console.log('📢 Publishing card...');
    updateCardField('visibility', 'public');
    updateCardField('is_public', true);
    
    // Wait for state to update, then save
    setTimeout(async () => {
      const success = await saveCard();
      if (success) {
        toast.success('Card published successfully!');
      }
    }, 100);
    
    return true;
  }, [saveCard, updateCardField]);

  // Map UI rarity to database-compatible rarity
  const mapRarityToDatabase = (rarity: CardRarity): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' => {
    if (rarity === 'ultra-rare') return 'legendary';
    return rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  };

  // Auto-save functionality
  useEffect(() => {
    if (!options.autoSave || !isDirty || isSaving) return;

    const autoSaveTimer = setTimeout(() => {
      console.log('⏰ Auto-saving card...');
      saveCard();
    }, options.autoSaveInterval || 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [isDirty, isSaving, options.autoSave, options.autoSaveInterval, saveCard]);

  // Update creator attribution when user changes
  useEffect(() => {
    if (user?.id && cardData.creator_attribution.creator_id !== user.id) {
      console.log('👤 Updating creator attribution for user:', user.id);
      updateCardField('creator_attribution', {
        ...cardData.creator_attribution,
        creator_name: user.user_metadata?.full_name || user.email || '',
        creator_id: user.id
      });
    }
  }, [user, cardData.creator_attribution, updateCardField]);

  return {
    cardData,
    updateCardField,
    saveCard,
    publishCard,
    isDirty,
    isSaving,
    lastSaved
  };
};

export type { CardData, CardRarity, CardVisibility };
