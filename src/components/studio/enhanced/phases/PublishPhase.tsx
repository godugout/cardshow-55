
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Globe, 
  Lock, 
  Users, 
  DollarSign,
  Tag,
  Share,
  Check,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

interface PublishPhaseProps {
  cardEditor: {
    cardData: CardData;
    updateCardField: (field: keyof CardData, value: any) => void;
  };
  onPublish: () => void;
  isProcessing: boolean;
}

type VisibilityType = 'public' | 'private' | 'unlisted';

export const PublishPhase = ({ cardEditor, onPublish, isProcessing }: PublishPhaseProps) => {
  const [visibility, setVisibility] = useState<VisibilityType>('public');
  const [enablePrint, setEnablePrint] = useState(false);
  const [enableMarketplace, setEnableMarketplace] = useState(false);
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      cardEditor.updateCardField('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    cardEditor.updateCardField('tags', updatedTags);
  };

  const handlePublish = () => {
    // Update final card settings
    cardEditor.updateCardField('visibility', visibility);
    cardEditor.updateCardField('is_public', visibility === 'public');
    cardEditor.updateCardField('print_available', enablePrint);
    cardEditor.updateCardField('marketplace_listing', enableMarketplace);
    if (price) {
      cardEditor.updateCardField('price', parseFloat(price));
    }
    
    onPublish();
  };

  const visibilityOptions = [
    {
      id: 'public' as const,
      label: 'Public',
      description: 'Visible to everyone in the gallery',
      icon: Globe,
      color: 'text-green-400'
    },
    {
      id: 'unlisted' as const,
      label: 'Unlisted',
      description: 'Only accessible via direct link',
      icon: Users,
      color: 'text-yellow-400'
    },
    {
      id: 'private' as const,
      label: 'Private',
      description: 'Only you can see this card',
      icon: Lock,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Publish Your Card</h2>
        <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          Configure your card's visibility, pricing, and sharing options before publishing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publishing Settings */}
        <div className="space-y-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Visibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setVisibility(option.id)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      visibility === option.id
                        ? 'border-crd-green bg-crd-green/10'
                        : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${option.color}`} />
                      <div>
                        <h4 className="text-crd-white font-medium">{option.label}</h4>
                        <p className="text-crd-lightGray text-sm">{option.description}</p>
                      </div>
                      {visibility === option.id && (
                        <Check className="w-5 h-5 text-crd-green ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags & Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Card Title</label>
                <Input
                  value={cardEditor.cardData.title || ''}
                  onChange={(e) => cardEditor.updateCardField('title', e.target.value)}
                  placeholder="Enter card title..."
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
              </div>

              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Description</label>
                <Textarea
                  value={cardEditor.cardData.description || ''}
                  onChange={(e) => cardEditor.updateCardField('description', e.target.value)}
                  placeholder="Describe your card..."
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-crd-lightGray text-sm mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <CRDButton onClick={handleAddTag} size="sm">
                    Add
                  </CRDButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-red-500/20"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Options */}
        <div className="space-y-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Monetization Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-crd-white font-medium">Enable Print Orders</h4>
                  <p className="text-crd-lightGray text-sm">Allow users to order physical prints</p>
                </div>
                <Switch
                  checked={enablePrint}
                  onCheckedChange={setEnablePrint}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-crd-white font-medium">List on Marketplace</h4>
                  <p className="text-crd-lightGray text-sm">Make available for purchase/trade</p>
                </div>
                <Switch
                  checked={enableMarketplace}
                  onCheckedChange={setEnableMarketplace}
                />
              </div>

              {enableMarketplace && (
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Price (USD)</label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Share className="w-5 h-5" />
                Sharing Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Share className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
                <h4 className="text-crd-white font-medium mb-2">Social Sharing</h4>
                <p className="text-crd-lightGray text-sm mb-4">
                  Share your creation on social media platforms
                </p>
                <div className="flex gap-2 justify-center">
                  <CRDButton variant="outline" size="sm">Twitter</CRDButton>
                  <CRDButton variant="outline" size="sm">Instagram</CRDButton>
                  <CRDButton variant="outline" size="sm">Discord</CRDButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Summary */}
          <Card className="bg-gradient-to-r from-crd-green/10 to-crd-blue/10 border border-crd-green/30">
            <CardContent className="p-6">
              <h3 className="text-crd-white font-semibold mb-4">Publishing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Visibility</span>
                  <Badge variant="outline">{visibility}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Print Available</span>
                  <span className={enablePrint ? 'text-green-400' : 'text-red-400'}>
                    {enablePrint ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Marketplace</span>
                  <span className={enableMarketplace ? 'text-green-400' : 'text-red-400'}>
                    {enableMarketplace ? 'Yes' : 'No'}
                  </span>
                </div>
                {enableMarketplace && price && (
                  <div className="flex justify-between">
                    <span className="text-crd-lightGray">Price</span>
                    <span className="text-crd-white">${price}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Publish Button */}
      <div className="flex justify-center">
        <CRDButton
          onClick={handlePublish}
          disabled={isProcessing || !cardEditor.cardData.title}
          className="bg-crd-green text-black hover:bg-crd-green/90 px-12 py-4 text-lg"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Publish Card
            </>
          )}
        </CRDButton>
      </div>
    </div>
  );
};
