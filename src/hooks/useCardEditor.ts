
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { generateCardId } from '@/lib/utils';
import type { CardData, CardCreateParams, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions } from '@/types/card';

export interface DesignTemplate {
  id: string;
  name: string;
  template_data: Record<string, any>;
  tags: string[];
}

interface UseCardEditorOptions {
  initialData?: Partial<CardData>;
}

export const useCardEditor = ({ initialData = {} }: UseCardEditorOptions = {}) => {
  const [cardData, setCardData] = useState<CardData>({
    id: generateCardId(),
    title: '',
    description: '',
    rarity: 'common' as CardRarity,
    tags: [],
    design_metadata: {},
    visibility: 'private' as CardVisibility,
    is_public: false,
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

  const updateCardField = useCallback(<K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
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

  return {
    cardData,
    updateCardField,
    saveCard,
    isSaving
  };
};

export type { CardData, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions };
