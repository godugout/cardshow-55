import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { generateCardId } from '@/lib/utils';
import type { CardData, CardCreateParams, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions } from '@/types/card';

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

export const useCardEditor = ({ 
  initialData = {},
  autoSave = false,
  autoSaveInterval = 30000 
}: UseCardEditorOptions = {}) => {
  const [cardData, setCardData] = useState<CardData>({
    id: generateCardId(),
    title: '',
    description: '',
    rarity: 'common' as CardRarity,
    tags: [],
    design_metadata: {},
    visibility: 'private' as CardVisibility,
    is_public: false,
    type: '',
    series: '',
    creator_attribution: {
      creator_name: '',
      creator_id: '',
      collaboration_type: 'solo',
      additional_credits: []
    } as CreatorAttribution,
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: {
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    } as PublishingOptions,
    verification_status: 'pending',
    print_metadata: {},
    marketplace_listing: false,
    ...initialData
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    const timeout = setTimeout(() => {
      saveCard();
    }, autoSaveInterval);

    return () => clearTimeout(timeout);
  }, [cardData, isDirty, autoSave, autoSaveInterval]);

  const updateCardField = useCallback(<K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  }, []);

  const updateDesignMetadata = useCallback((updates: Record<string, any>) => {
    setCardData(prev => ({
      ...prev,
      design_metadata: {
        ...prev.design_metadata,
        ...updates
      }
    }));
    setIsDirty(true);
  }, []);

  // Tag management methods
  const tags = cardData.tags;
  const hasMaxTags = tags.length >= 10;

  const addTag = useCallback((tag: string) => {
    if (tags.length >= 10 || tags.includes(tag)) return;
    setCardData(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
    setIsDirty(true);
  }, [tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setCardData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setIsDirty(true);
  }, []);

  const saveCard = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!cardData.title.trim()) {
        throw new Error('Card title is required');
      }
      if (!cardData.image_url) {
        throw new Error('Card image is required');
      }

      const cardParams: CardCreateParams = {
        title: cardData.title,
        description: cardData.description || '',
        creator_id: cardData.creator_id || 'current-user',
        image_url: cardData.image_url,
        thumbnail_url: cardData.thumbnail_url || cardData.image_url,
        rarity: cardData.rarity,
        tags: cardData.tags,
        design_metadata: cardData.design_metadata,
        visibility: cardData.visibility,
        is_public: cardData.visibility === 'public',
        template_id: cardData.template_id || null,
        collection_id: cardData.collection_id || null,
        team_id: cardData.team_id || null,
        price: cardData.price || null,
        edition_size: cardData.edition_size || null,
        marketplace_listing: cardData.publishing_options.marketplace_listing,
        crd_catalog_inclusion: cardData.publishing_options.crd_catalog_inclusion || null,
        print_available: cardData.publishing_options.print_available || null,
        verification_status: cardData.verification_status || 'pending',
        print_metadata: cardData.print_metadata || {},
        series: cardData.series || null,
        edition_number: cardData.edition_number || null,
        total_supply: cardData.total_supply || null
      };

      // Here you would normally save to your backend
      console.log('Saving card:', cardParams);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsDirty(false);
      toast.success('Card saved successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [cardData]);

  const publishCard = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // First save the card if there are unsaved changes
      if (isDirty) {
        const saved = await saveCard();
        if (!saved) return false;
      }

      // Update publishing status
      updateCardField('visibility', 'public');
      updateCardField('is_public', true);
      updateCardField('publishing_options', {
        ...cardData.publishing_options,
        marketplace_listing: true
      });

      // Simulate API call for publishing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsDirty(false);
      toast.success('Card published successfully!');
      return true;
    } catch (error) {
      console.error('Failed to publish card:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to publish card');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [cardData, isDirty, saveCard]);

  return {
    cardData,
    updateCardField,
    updateDesignMetadata,
    saveCard,
    publishCard,
    isSaving,
    isDirty,
    tags,
    addTag,
    removeTag,
    hasMaxTags
  };
};

export type { CardData, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions };
