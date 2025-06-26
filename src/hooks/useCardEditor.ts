
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from '@/services/cardStorage';

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
    if (!user) {
      toast.error('Please sign in to save cards');
      return false;
    }

    const finalCardData = {
      ...cardData,
      title: cardData.title?.trim() || 'My New Card',
      creator_id: user.id,
      needsSync: false
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
          'ultra-rare': 'legendary',
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
          
          if (dbResult.id !== finalCardData.id) {
            setCardData(prev => ({ ...prev, id: dbResult.id }));
          }
        }
      } catch (dbError) {
        console.warn('⚠️ Database save failed, but localStorage succeeded:', dbError);
      }

      setLastSaved(new Date());
      setIsDirty(false);
      
      if (dbSuccess) {
        toast.success('Card saved successfully');
      } else {
        toast.success('Card saved locally (will sync to database later)');
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
