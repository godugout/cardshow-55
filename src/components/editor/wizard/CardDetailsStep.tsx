import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Tag, Crown, X, Plus } from 'lucide-react';
import type { CardData, CardRarity, CreatorAttribution } from '@/hooks/useCardEditor';

interface CardDetailsStepProps {
  cardData: CardData;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  onCreatorAttributionUpdate: (attribution: CreatorAttribution) => void;
  aiAnalysisComplete: boolean;
}

export const CardDetailsStep = ({ 
  cardData, 
  onFieldUpdate, 
  onCreatorAttributionUpdate,
  aiAnalysisComplete 
}: CardDetailsStepProps) => {
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !cardData.tags.includes(newTag.trim()) && cardData.tags.length < 10) {
      onFieldUpdate('tags', [...cardData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onFieldUpdate('tags', cardData.tags.filter(tag => tag !== tagToRemove));
  };

  const rarityColors = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    'ultra-rare': 'bg-purple-500',
    legendary: 'bg-yellow-500'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Card Details</h2>
        <p className="text-crd-lightGray">
          {aiAnalysisComplete ? (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-crd-green" />
              AI has pre-filled these details - you can edit them as needed
            </span>
          ) : (
            'Fill in your card details to create your unique trading card'
          )}
        </p>
      </div>

      {/* AI Analysis Status */}
      {aiAnalysisComplete && (
        <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-crd-green mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI Analysis Complete</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Your card details have been automatically generated based on image analysis. 
            Feel free to customize any of the fields below.
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-crd-lightGray font-medium mb-2 block">
            Card Title *
          </Label>
          <Input
            id="title"
            value={cardData.title}
            onChange={(e) => onFieldUpdate('title', e.target.value)}
            className="bg-crd-darkGray border-crd-mediumGray text-white"
            placeholder="Enter your card title"
            maxLength={60}
          />
          <p className="text-xs text-crd-lightGray mt-1">
            {cardData.title.length}/60 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-crd-lightGray font-medium mb-2 block">
            Description
          </Label>
          <Textarea
            id="description"
            value={cardData.description}
            onChange={(e) => onFieldUpdate('description', e.target.value)}
            className="bg-crd-darkGray border-crd-mediumGray text-white min-h-[100px]"
            placeholder="Describe your card..."
            maxLength={500}
          />
          <p className="text-xs text-crd-lightGray mt-1">
            {cardData.description?.length || 0}/500 characters
          </p>
        </div>

        {/* Rarity */}
        <div>
          <Label className="text-crd-lightGray font-medium mb-2 block flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Rarity
          </Label>
          <Select 
            value={cardData.rarity} 
            onValueChange={(value: CardRarity) => onFieldUpdate('rarity', value)}
          >
            <SelectTrigger className="bg-crd-darkGray border-crd-mediumGray text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-crd-darkGray border-crd-mediumGray">
              {(['common', 'uncommon', 'rare', 'ultra-rare', 'legendary'] as CardRarity[]).map((rarity) => (
                <SelectItem key={rarity} value={rarity} className="text-white hover:bg-crd-mediumGray">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${rarityColors[rarity]}`}></div>
                    <span className="capitalize">{rarity.replace('-', ' ')}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-crd-lightGray font-medium mb-2 block flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </Label>
          
          {/* Existing Tags */}
          {cardData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {cardData.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-crd-mediumGray text-white hover:bg-crd-lightGray"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 hover:bg-transparent"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          
          {/* Add New Tag */}
          {cardData.tags.length < 10 && (
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="bg-crd-darkGray border-crd-mediumGray text-white flex-1"
                placeholder="Add a tag..."
                maxLength={20}
              />
              <Button
                onClick={handleAddTag}
                disabled={!newTag.trim() || cardData.tags.includes(newTag.trim())}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <p className="text-xs text-crd-lightGray mt-1">
            {cardData.tags.length}/10 tags • Tags help people find your card
          </p>
        </div>

        {/* Type & Series (if available from AI) */}
        {(cardData.type || cardData.series) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardData.type && (
              <div>
                <Label htmlFor="type" className="text-crd-lightGray font-medium mb-2 block">
                  Type
                </Label>
                <Input
                  id="type"
                  value={cardData.type}
                  onChange={(e) => onFieldUpdate('type', e.target.value)}
                  className="bg-crd-darkGray border-crd-mediumGray text-white"
                  placeholder="Card type"
                />
              </div>
            )}
            
            {cardData.series && (
              <div>
                <Label htmlFor="series" className="text-crd-lightGray font-medium mb-2 block">
                  Series
                </Label>
                <Input
                  id="series"
                  value={cardData.series}
                  onChange={(e) => onFieldUpdate('series', e.target.value)}
                  className="bg-crd-darkGray border-crd-mediumGray text-white"
                  placeholder="Card series"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
