
import { useState, useCallback } from 'react';
import type { SpaceState, SpaceTemplate, SpaceCard, SpaceConfiguration } from '../types/spaces';
import type { CardData } from '@/hooks/useCardEditor';
import { SPACE_TEMPLATES } from '../constants/spaceTemplates';

export const useSpacesState = () => {
  const [spaceState, setSpaceState] = useState<SpaceState>({
    selectedTemplate: null,
    cards: [],
    selectedCardIds: [],
    cameraPosition: { x: 0, y: 0, z: 8 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    isEditMode: false
  });

  const setSelectedTemplate = useCallback((template: SpaceTemplate | null) => {
    setSpaceState(prev => ({
      ...prev,
      selectedTemplate: template,
      cameraPosition: template?.cameraPosition || { x: 0, y: 0, z: 8 },
      cameraTarget: template?.cameraTarget || { x: 0, y: 0, z: 0 },
      cards: template ? prev.cards.slice(0, template.maxCards) : []
    }));
  }, []);

  const addCard = useCallback((card: CardData) => {
    setSpaceState(prev => {
      if (!prev.selectedTemplate) return prev;
      
      const existingCardIndex = prev.cards.findIndex(c => c.card.id === card.id);
      if (existingCardIndex !== -1) return prev;

      const nextPosition = prev.selectedTemplate.defaultPositions[prev.cards.length];
      if (!nextPosition || prev.cards.length >= prev.selectedTemplate.maxCards) return prev;

      const spaceCard: SpaceCard = {
        id: `space-card-${card.id}-${Date.now()}`,
        card,
        position: nextPosition,
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
        isSelected: false
      };

      return {
        ...prev,
        cards: [...prev.cards, spaceCard]
      };
    });
  }, []);

  const removeCard = useCallback((spaceCardId: string) => {
    setSpaceState(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== spaceCardId),
      selectedCardIds: prev.selectedCardIds.filter(id => id !== spaceCardId)
    }));
  }, []);

  const updateCardPosition = useCallback((spaceCardId: string, position: { x: number; y: number; z: number }) => {
    setSpaceState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === spaceCardId ? { ...card, position } : card
      )
    }));
  }, []);

  const updateCardRotation = useCallback((spaceCardId: string, rotation: { x: number; y: number; z: number }) => {
    setSpaceState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === spaceCardId ? { ...card, rotation } : card
      )
    }));
  }, []);

  const toggleCardSelection = useCallback((spaceCardId: string, multiSelect = false) => {
    setSpaceState(prev => {
      const isSelected = prev.selectedCardIds.includes(spaceCardId);
      let newSelectedIds: string[];

      if (multiSelect) {
        newSelectedIds = isSelected 
          ? prev.selectedCardIds.filter(id => id !== spaceCardId)
          : [...prev.selectedCardIds, spaceCardId];
      } else {
        newSelectedIds = isSelected ? [] : [spaceCardId];
      }

      return {
        ...prev,
        selectedCardIds: newSelectedIds,
        cards: prev.cards.map(card => ({
          ...card,
          isSelected: newSelectedIds.includes(card.id)
        }))
      };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSpaceState(prev => ({
      ...prev,
      selectedCardIds: [],
      cards: prev.cards.map(card => ({ ...card, isSelected: false }))
    }));
  }, []);

  const setEditMode = useCallback((isEditMode: boolean) => {
    setSpaceState(prev => ({ ...prev, isEditMode }));
  }, []);

  const exportConfiguration = useCallback((): SpaceConfiguration | null => {
    if (!spaceState.selectedTemplate) return null;

    return {
      id: `space-config-${Date.now()}`,
      name: `${spaceState.selectedTemplate.name} Configuration`,
      template: spaceState.selectedTemplate,
      cards: spaceState.cards,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }, [spaceState]);

  const importConfiguration = useCallback((config: SpaceConfiguration) => {
    setSpaceState({
      selectedTemplate: config.template,
      cards: config.cards.map(card => ({ ...card, isSelected: false })),
      selectedCardIds: [],
      cameraPosition: config.template.cameraPosition,
      cameraTarget: config.template.cameraTarget,
      isEditMode: false
    });
  }, []);

  const resetSpace = useCallback(() => {
    setSpaceState(prev => ({
      ...prev,
      cards: [],
      selectedCardIds: [],
      isEditMode: false
    }));
  }, []);

  return {
    spaceState,
    setSelectedTemplate,
    addCard,
    removeCard,
    updateCardPosition,
    updateCardRotation,
    toggleCardSelection,
    clearSelection,
    setEditMode,
    exportConfiguration,
    importConfiguration,
    resetSpace,
    templates: SPACE_TEMPLATES
  };
};
