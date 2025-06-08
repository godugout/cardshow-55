
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit3, RotateCcw, Trash2 } from 'lucide-react';
import { SpaceTemplateSelector } from '../../spaces/SpaceTemplateSelector';
import type { SpaceState, SpaceTemplate } from '../../../types/spaces';
import type { CardData } from '@/hooks/useCardEditor';

interface SpacesTabProps {
  currentCard?: CardData;
  spaceState?: SpaceState;
  spacesTemplates?: SpaceTemplate[];
  onTemplateSelect?: (template: SpaceTemplate | null) => void;
  onAddCardToSpace?: () => void;
  onRemoveCardFromSpace?: (cardId: string) => void;
  onToggleEditMode?: () => void;
}

export const SpacesTab: React.FC<SpacesTabProps> = ({
  currentCard,
  spaceState,
  spacesTemplates = [],
  onTemplateSelect,
  onAddCardToSpace,
  onRemoveCardFromSpace,
  onToggleEditMode
}) => {
  const getStatusText = () => {
    if (!spaceState?.selectedTemplate) return 'Select a template to begin';
    const cardCount = spaceState.cards.length;
    const maxCards = spaceState.selectedTemplate.maxCards;
    return `${cardCount}/${maxCards} cards in space`;
  };

  const isSpaceMode = !!spaceState?.selectedTemplate;

  // Debug logging
  console.log('🎯 SpacesTab - spacesTemplates:', spacesTemplates);
  console.log('🎯 SpacesTab - spaceState:', spaceState);

  return (
    <div className="space-y-6">
      {/* 3D Environment Templates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">3D Environment Templates</h3>
          {isSpaceMode && (
            <Button
              onClick={() => onTemplateSelect?.(null)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Exit 3D
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          {isSpaceMode 
            ? 'You are in 3D space mode. The main viewer shows your 3D environment.'
            : 'Select a template to switch the main viewer to 3D space mode with your card.'
          }
        </p>

        <SpaceTemplateSelector
          templates={spacesTemplates}
          selectedTemplate={spaceState?.selectedTemplate || null}
          onTemplateSelect={onTemplateSelect || (() => {})}
        />
        
        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-xs text-gray-400">
            Status: {getStatusText()}
          </div>
        </div>
      </div>

      {/* Card Management - only show when in space mode */}
      {isSpaceMode && spaceState && (
        <>
          <div className="border-t border-white/10 pt-6">
            <h4 className="text-white font-medium text-sm mb-4">Card Management</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={onAddCardToSpace}
                  disabled={!currentCard || spaceState.cards.length >= spaceState.selectedTemplate.maxCards}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Current</span>
                </Button>
                
                <Button
                  onClick={onToggleEditMode}
                  variant="outline"
                  size="sm"
                  className={`flex items-center space-x-1 text-xs ${
                    spaceState.isEditMode ? 'bg-crd-green/20 text-crd-green' : ''
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{spaceState.isEditMode ? 'Exit Edit' : 'Edit'}</span>
                </Button>
              </div>

              {spaceState.isEditMode && (
                <div className="p-2 bg-crd-green/10 border border-crd-green/30 rounded text-xs text-crd-green">
                  Edit mode active: Click cards in the main viewer to select them
                </div>
              )}
            </div>
          </div>

          {/* Selected Cards Info */}
          {spaceState.selectedCardIds.length > 0 && (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-gray-400 mb-2">
                {spaceState.selectedCardIds.length} card(s) selected
              </div>
              <Button
                onClick={() => spaceState.selectedCardIds.forEach(cardId => onRemoveCardFromSpace?.(cardId))}
                variant="outline"
                size="sm"
                className="text-xs text-red-400 hover:text-red-300 w-full"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove Selected
              </Button>
            </div>
          )}

          {/* Template Info */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-sm font-medium text-white mb-2">{spaceState.selectedTemplate.name}</h4>
            <p className="text-xs text-gray-400 mb-2">{spaceState.selectedTemplate.description}</p>
            <div className="text-xs text-gray-500">
              Category: {spaceState.selectedTemplate.category} • Max Cards: {spaceState.selectedTemplate.maxCards}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
