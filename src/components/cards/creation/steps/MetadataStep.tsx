
import React, { useState, useEffect } from 'react';
import { Card } from '@/types/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { getRarityConfig } from '../../config/cardRarities';

interface MetadataStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const MetadataStep: React.FC<MetadataStepProps> = ({
  cardData,
  onUpdate,
  onValidationChange
}) => {
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const isValid = Boolean(cardData.title && cardData.title.trim().length > 0);
    onValidationChange(isValid);
  }, [cardData.title, onValidationChange]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const currentTags = cardData.tags || [];
      if (!currentTags.includes(newTag.trim())) {
        onUpdate({
          tags: [...currentTags, newTag.trim()]
        });
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = cardData.tags || [];
    onUpdate({
      tags: currentTags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Card Details</h2>
        <p className="text-crd-lightGray">
          Add title, description, and other metadata for your card
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Card Title *
            </label>
            <Input
              value={cardData.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter card title..."
              className="bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Description
            </label>
            <Textarea
              value={cardData.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe your card..."
              className="bg-crd-mediumGray border-crd-mediumGray text-white min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Card Type
            </label>
            <Select 
              value={cardData.card_type || ''} 
              onValueChange={(value) => onUpdate({ card_type: value as any })}
            >
              <SelectTrigger className="bg-crd-mediumGray border-crd-mediumGray text-white">
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent className="bg-crd-mediumGray border-crd-mediumGray">
                <SelectItem value="athlete">Athlete</SelectItem>
                <SelectItem value="character">Character</SelectItem>
                <SelectItem value="creature">Creature</SelectItem>
                <SelectItem value="spell">Spell</SelectItem>
                <SelectItem value="artifact">Artifact</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Rarity
            </label>
            <Select 
              value={cardData.rarity || 'common'} 
              onValueChange={(value: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic') => onUpdate({ rarity: value })}
            >
              <SelectTrigger className="bg-crd-mediumGray border-crd-mediumGray text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-crd-mediumGray border-crd-mediumGray">
                {(['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] as const).map((rarity) => {
                  const config = getRarityConfig(rarity);
                  return (
                    <SelectItem key={rarity} value={rarity}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        {config.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Edition Size
            </label>
            <Input
              type="number"
              value={cardData.edition_size || ''}
              onChange={(e) => onUpdate({ edition_size: parseInt(e.target.value) || undefined })}
              placeholder="Limited edition size..."
              className="bg-crd-mediumGray border-crd-mediumGray text-white"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Tags
            </label>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)..."
              className="bg-crd-mediumGray border-crd-mediumGray text-white"
            />
            {cardData.tags && cardData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {cardData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-crd-green/20 text-crd-green hover:bg-crd-green/30"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
