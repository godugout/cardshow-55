
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocalAutoSave } from './card-editor/useLocalAutoSave';
import { useAutoSave } from './card-editor/useAutoSave';
import type { 
  CardData, 
  UseCardEditorOptions, 
  CardRarity, 
  CardVisibility, 
  CreatorAttribution, 
  PublishingOptions, 
  DesignTemplate 
} from './card-editor/types';

// Re-export types for convenience
export type { CardData, CardRarity, CardVisibility, CreatorAttribution, PublishingOptions, DesignTemplate, UseCardEditorOptions };

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
  const [cardData, setCardData] = useState<CardData>({
    title: '',
    rarity: 'common',
    tags: [],
    design_metadata: {},
    visibility: 'private',
    category: 'fantasy',
    effects: {
      holographic: false,
      foil: false,
      chrome: false
    },
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    },
    ...options.initialData
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateCardData = useCallback((updates: Partial<CardData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  const updateCardField = useCallback(<K extends keyof CardData>(field: K, value: CardData[K]) => {
    updateCardData({ [field]: value });
  }, [updateCardData]);

  const updateDesignMetadata = useCallback((key: string, value: any) => {
    setCardData(prev => ({
      ...prev,
      design_metadata: { ...prev.design_metadata, [key]: value }
    }));
    setIsDirty(true);
  }, []);

  const saveCard = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsDirty(false);
      toast.success('Card saved successfully');
      return true;
    } catch (error) {
      toast.error('Failed to save card');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const publishCard = useCallback(async (): Promise<boolean> => {
    const saved = await saveCard();
    if (saved) {
      updateCardField('is_public', true);
      toast.success('Card published successfully');
      return true;
    }
    return false;
  }, [saveCard, updateCardField]);

  // Tags management
  const tags = cardData.tags;
  const hasMaxTags = tags.length >= 10;

  const addTag = useCallback((tag: string) => {
    if (!hasMaxTags && !tags.includes(tag)) {
      updateCardField('tags', [...tags, tag]);
    }
  }, [tags, hasMaxTags, updateCardField]);

  const removeTag = useCallback((tag: string) => {
    updateCardField('tags', tags.filter(t => t !== tag));
  }, [tags, updateCardField]);

  // Auto-save functionality
  useAutoSave(cardData, isDirty, saveCard, options.autoSave || false, options.autoSaveInterval || 30000);
  useLocalAutoSave(cardData, isDirty, updateCardData);

  return {
    cardData,
    isDirty,
    isSaving,
    updateCardField,
    updateCardData,
    updateDesignMetadata,
    saveCard,
    publishCard,
    tags,
    hasMaxTags,
    addTag,
    removeTag
  };
};
