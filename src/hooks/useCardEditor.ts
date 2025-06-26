import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';
import { CardRepository } from '@/repositories/cardRepository';
import { localCardStorage } from '@/lib/localCardStorage';

// Import the unified CardData type and re-export it
import type { CardData } from '@/hooks/card-editor/types';
export type { CardData } from '@/hooks/card-editor/types';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
export type CardVisibility = 'private' | 'public' | 'shared';

export interface CreatorAttribution {
  creator_name?: string;
  creator_id?: string;
  collaboration_type?: 'solo' | 'collaboration' | 'commission';
  additional_credits?: Array<{
    name: string;
    role: string;
  }>;
}

export interface PublishingOptions {
  marketplace_listing: boolean;
  crd_catalog_inclusion: boolean;
  print_available: boolean;
  pricing?: {
    base_price?: number;
    print_price?: number;
    currency: string;
  };
  distribution?: {
    limited_edition: boolean;
    edition_size?: number;
  };
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  template_data: Record<string, any>;
  is_premium: boolean;
  usage_count: number;
  tags: string[];
}

export interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const { user } = useAuth();
  const { initialData = {}, autoSave = false, autoSaveInterval = 30000 } = options;
  
  const [cardData, setCardData] = useState<CardData>({
    id: initialData.id || uuidv4(),
    title: initialData.title || 'My New Card',
    description: initialData.description || '',
    image_url: initialData.image_url,
    thumbnail_url: initialData.thumbnail_url,
    rarity: initialData.rarity || 'common',
    tags: initialData.tags || [],
    design_metadata: initialData.design_metadata || {},
    visibility: initialData.visibility || 'private',
    is_public: initialData.is_public || false,
    template_id: initialData.template_id,
    type: initialData.type || 'Digital',
    series: initialData.series || '',
    creator_attribution: initialData.creator_attribution || {
      creator_name: user?.email || '',
      creator_id: user?.id || '',
      collaboration_type: 'solo'
    },
    publishing_options: initialData.publishing_options || {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    },
    creator_id: user?.id,
    needsSync: false,
    isLocal: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user?.id && !cardData.creator_id) {
      setCardData(prev => ({ ...prev, creator_id: user.id }));
    }
  }, [user?.id, cardData.creator_id]);

  const updateCardField = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const updateDesignMetadata = (key: string, value: any) => {
    setCardData(prev => ({
      ...prev,
      design_metadata: { ...prev.design_metadata, [key]: value }
    }));
    setIsDirty(true);
  };

  // Tag management
  const tags = cardData.tags;
  const hasMaxTags = tags.length >= 10;

  const addTag = (tag: string) => {
    if (!hasMaxTags && !tags.includes(tag)) {
      updateCardField('tags', [...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateCardField('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInput = (input: string) => {
    const newTags = input.split(',').map(tag => tag.trim()).filter(Boolean);
    const uniqueTags = [...new Set([...tags, ...newTags])].slice(0, 10);
    updateCardField('tags', uniqueTags);
  };

  const saveCard = async (): Promise<boolean> => {
    console.log('🎯 Starting enhanced dual card save (localStorage + Database)...', { cardData, user });
    
    if (!user) {
      toast.error('Please sign in to save cards');
      return false;
    }

    // Ensure minimum required data
    const finalCardData = {
      ...cardData,
      title: cardData.title?.trim() || 'My New Card',
      creator_id: user.id,
      needsSync: false // Mark as synced since we're saving to both places
    };

    setIsSaving(true);
    try {
      // 1. Save to consolidated localStorage using localCardStorage
      console.log('💾 Saving to consolidated localStorage...');
      const localCardId = localCardStorage.saveCard(finalCardData);
      
      // 2. Save to Supabase database (for persistence and sharing)
      console.log('🔄 Saving to Supabase database...');
      let dbSuccess = false;
      
      try {
        // Map rarity for database compatibility
        let dbRarity: 'common' | 'uncommon' | 'rare' | 'legendary' = 'common';
        if (finalCardData.rarity === 'legendary') {
          dbRarity = 'legendary';
        } else if (finalCardData.rarity === 'ultra-rare') {
          dbRarity = 'legendary'; // Map ultra-rare to legendary for DB
        } else if (finalCardData.rarity === 'rare') {
          dbRarity = 'rare';
        } else if (finalCardData.rarity === 'uncommon') {
          dbRarity = 'uncommon';
        }

        const dbCardData = {
          title: finalCardData.title,
          description: finalCardData.description,
          creator_id: user.id,
          image_url: finalCardData.image_url,
          thumbnail_url: finalCardData.thumbnail_url,
          rarity: dbRarity,
          tags: finalCardData.tags,
          design_metadata: finalCardData.design_metadata,
          is_public: finalCardData.visibility === 'public',
          visibility: finalCardData.visibility,
          marketplace_listing: finalCardData.publishing_options?.marketplace_listing || false,
          print_available: finalCardData.publishing_options?.print_available || false
        };

        const dbResult = await CardRepository.createCard(dbCardData);
        if (dbResult) {
          console.log('✅ Database save successful:', dbResult.id);
          dbSuccess = true;
          
          // Update the card data with the database ID if it's different
          if (dbResult.id !== finalCardData.id) {
            setCardData(prev => ({ ...prev, id: dbResult.id }));
          }
        } else {
          console.log('⚠️ Database save failed, but localStorage save succeeded');
        }
      } catch (dbError) {
        console.error('⚠️ Database save error (localStorage still works):', dbError);
        // Don't fail the entire operation if only DB save fails
      }

      console.log(`✅ Card saved - LocalStorage: ✓, Database: ${dbSuccess ? '✓' : '✗'}`);
      setLastSaved(new Date());
      setIsDirty(false);
      
      if (dbSuccess) {
        toast.success('Card saved successfully to both local storage and database');
      } else {
        toast.success('Card saved locally (database sync will retry later)');
      }
      
      return true;
    } catch (error) {
      console.error('💥 Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishCard = async (): Promise<boolean> => {
    const saved = await saveCard();
    if (!saved) return false;

    try {
      updateCardField('is_public', true);
      updateCardField('visibility', 'public');
      toast.success('Card published successfully');
      return true;
    } catch (error) {
      console.error('Error publishing card:', error);
      toast.error('Failed to publish card');
      return false;
    }
  };

  return {
    cardData,
    updateCardField,
    updateDesignMetadata,
    saveCard,
    publishCard,
    isSaving,
    lastSaved,
    isDirty,
    tags,
    addTag,
    removeTag,
    handleTagInput,
    hasMaxTags
  };
};
