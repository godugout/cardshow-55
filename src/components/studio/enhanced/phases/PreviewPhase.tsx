import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Download, Share2, Edit3 } from 'lucide-react';

interface PreviewPhaseProps {
  cardData: any;
  onDataUpdated: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PreviewPhase: React.FC<PreviewPhaseProps> = ({
  cardData,
  onDataUpdated,
  onNext,
  onPrevious,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(cardData.cardData?.title || 'Untitled Card');
  const [description, setDescription] = useState(cardData.cardData?.description || '');
  const [rarity, setRarity] = useState(cardData.cardData?.rarity || 'common');
  const [tags, setTags] = useState(cardData.cardData?.tags || '');

  const handleSaveChanges = () => {
    onDataUpdated({
      cardData: {
        ...cardData.cardData,
        title,
        description,
        rarity,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      }
    });
    setIsEditing(false);
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log('Download card:', cardData);
  };

  const handleShare = () => {
    // Placeholder for share functionality
    console.log('Share card:', cardData);
  };

  const rarityColors = {
    common: 'bg-gray-500',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-orange-500',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Preview Your Card</h2>
        <p className="text-gray-400">
          Review your creation and make final adjustments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Card Preview</h3>
          
          <Card className="aspect-[3/4] bg-gradient-to-br from-crd-dark to-crd-darker border-crd-border overflow-hidden">
            <div className="w-full h-full p-4 flex flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg truncate">{title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${rarityColors[rarity]} text-white`}>
                      {rarity}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Card Image Area */}
              <div className="flex-1 bg-crd-border rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-crd-darker rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Preview</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {cardData.uploadedImages?.length || 0} image(s)
                  </p>
                </div>
              </div>

              {/* Card Description */}
              {description && (
                <div className="text-xs text-gray-300 line-clamp-3">
                  {description}
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-2 flex-1"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 flex-1"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Card Details</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </Button>
          </div>

          <Card className="p-4 bg-crd-dark border-crd-border space-y-4">
            {/* Title */}
            <div>
              <Label className="text-white">Card Title</Label>
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  placeholder="Enter card title"
                />
              ) : (
                <p className="text-gray-300 mt-1">{title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label className="text-white">Description</Label>
              {isEditing ? (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  placeholder="Enter card description"
                  rows={3}
                />
              ) : (
                <p className="text-gray-300 mt-1">{description || 'No description'}</p>
              )}
            </div>

            {/* Rarity */}
            <div>
              <Label className="text-white">Rarity</Label>
              {isEditing ? (
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-crd-darker border border-crd-border rounded-md text-white"
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              ) : (
                <div className="mt-1">
                  <Badge className={`${rarityColors[rarity]} text-white`}>
                    {rarity}
                  </Badge>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <Label className="text-white">Tags</Label>
              {isEditing ? (
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1"
                  placeholder="Enter tags separated by commas"
                />
              ) : (
                <p className="text-gray-300 mt-1">
                  {tags || 'No tags'}
                </p>
              )}
            </div>

            {isEditing && (
              <Button
                onClick={handleSaveChanges}
                className="w-full bg-crd-green text-black hover:bg-crd-green/90"
              >
                Save Changes
              </Button>
            )}
          </Card>

          {/* Creation Summary */}
          <Card className="p-4 bg-crd-dark border-crd-border">
            <h4 className="text-white font-medium mb-3">Creation Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Images:</span>
                <span className="text-white">{cardData.uploadedImages?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Frame:</span>
                <span className="text-white">{cardData.selectedFrame || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Effects:</span>
                <span className="text-white">
                  {Object.keys(cardData.appliedEffects || {}).length} applied
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Effects</span>
        </Button>
        
        <Button
          onClick={onNext}
          className="bg-crd-green text-black hover:bg-crd-green/90"
        >
          Continue to Publish
        </Button>
      </div>
    </div>
  );
};