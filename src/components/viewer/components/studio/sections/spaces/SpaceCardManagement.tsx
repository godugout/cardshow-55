
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit3 } from 'lucide-react';
import type { SpaceTemplate, SpaceCard } from '../../../../types/spaces';
import type { CardData } from '@/hooks/useCardEditor';

interface SpaceCardManagementProps {
  selectedTemplate: SpaceTemplate | null;
  spaceCards: SpaceCard[];
  selectedCardIds: string[];
  isEditMode: boolean;
  currentCard?: CardData;
  onAddCurrentCard: () => void;
  onSetEditMode: (isEditMode: boolean) => void;
  onRemoveSelectedCards: () => void;
}

export const SpaceCardManagement: React.FC<SpaceCardManagementProps> = ({
  selectedTemplate,
  spaceCards,
  selectedCardIds,
  isEditMode,
  currentCard,
  onAddCurrentCard,
  onSetEditMode,
  onRemoveSelectedCards
}) => {
  if (!selectedTemplate) return null;

  return (
    <div className="space-y-4">
      {/* Card Management Controls */}
      <div>
        <h4 className="text-white font-medium text-sm mb-3">Card Management</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onAddCurrentCard}
            disabled={!currentCard || spaceCards.length >= selectedTemplate.maxCards}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 text-xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add Current</span>
          </Button>
          
          <Button
            onClick={() => onSetEditMode(!isEditMode)}
            variant="outline"
            size="sm"
            className={`flex items-center space-x-1 text-xs ${
              isEditMode ? 'bg-crd-green/20 text-crd-green' : ''
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </Button>
        </div>
      </div>

      {/* Selected Cards Info */}
      {selectedCardIds.length > 0 && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-xs text-gray-400 mb-2">
            {selectedCardIds.length} card(s) selected
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onRemoveSelectedCards}
              variant="outline"
              size="sm"
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </Button>
            <Button
              onClick={() => {}}
              variant="outline"
              size="sm"
              className="text-xs"
              disabled
            >
              Group
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
