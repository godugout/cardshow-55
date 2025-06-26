
import React from 'react';
import { CRDInput } from '@/components/ui/design-system/Input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { CreationMode } from '../../types';
import type { CardData, CardRarity } from '@/hooks/useCardEditor';

interface DetailsStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const DetailsStep = ({ mode, cardData, onFieldUpdate }: DetailsStepProps) => {
  const isSimpleMode = mode === 'quick';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Card Details</h2>
        <p className="text-crd-lightGray">
          {isSimpleMode 
            ? 'Add basic information for your card'
            : 'Provide detailed information about your card'
          }
        </p>
      </div>

      <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8 space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-crd-white font-medium">Title *</Label>
          <CRDInput
            id="title"
            variant="crd"
            value={cardData.title}
            onChange={(e) => onFieldUpdate('title', e.target.value)}
            placeholder="Enter card title"
            className="mt-1"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-crd-white font-medium">Description</Label>
          <Textarea
            id="description"
            value={cardData.description || ''}
            onChange={(e) => onFieldUpdate('description', e.target.value)}
            placeholder="Enter card description"
            className="mt-1 bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray focus-visible:ring-crd-blue focus-visible:border-crd-blue"
            rows={isSimpleMode ? 2 : 4}
          />
        </div>

        {/* Rarity */}
        <div>
          <Label className="text-crd-white font-medium">Rarity</Label>
          <Select 
            value={cardData.rarity} 
            onValueChange={(value) => onFieldUpdate('rarity', value as CardRarity)}
          >
            <SelectTrigger className="mt-1 bg-crd-dark border-crd-mediumGray text-crd-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-crd-dark border-crd-mediumGray">
              <SelectItem value="common" className="text-crd-white hover:bg-crd-mediumGray">Common</SelectItem>
              <SelectItem value="uncommon" className="text-crd-white hover:bg-crd-mediumGray">Uncommon</SelectItem>
              <SelectItem value="rare" className="text-crd-white hover:bg-crd-mediumGray">Rare</SelectItem>
              <SelectItem value="legendary" className="text-crd-white hover:bg-crd-mediumGray">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags - only show in detailed modes */}
        {!isSimpleMode && (
          <div>
            <Label className="text-crd-white font-medium">Tags</Label>
            <CRDInput
              variant="crd"
              placeholder="Add tags (comma-separated)"
              className="mt-1"
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                onFieldUpdate('tags', tags);
              }}
            />
            <p className="text-crd-lightGray text-xs mt-1">
              Separate tags with commas (e.g., pokemon, rare, vintage)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
