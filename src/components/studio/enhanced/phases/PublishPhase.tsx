import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Globe, Lock, Eye, Users, DollarSign, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface PublishPhaseProps {
  cardData: any;
  onPublish: (publishData: any) => void;
  onPrevious: () => void;
}

interface PublishSettings {
  visibility: 'public' | 'private' | 'unlisted';
  marketplaceListing: boolean;
  price: string;
  printAvailable: boolean;
  limitedEdition: boolean;
  editionSize: string;
  allowDownloads: boolean;
  allowComments: boolean;
  allowReactions: boolean;
}

export const PublishPhase: React.FC<PublishPhaseProps> = ({
  cardData,
  onPublish,
  onPrevious,
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [settings, setSettings] = useState<PublishSettings>({
    visibility: 'public',
    marketplaceListing: false,
    price: '0.00',
    printAvailable: false,
    limitedEdition: false,
    editionSize: '100',
    allowDownloads: true,
    allowComments: true,
    allowReactions: true,
  });

  const updateSetting = <K extends keyof PublishSettings>(
    key: K,
    value: PublishSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      const publishData = {
        ...cardData,
        publishSettings: settings,
        publishedAt: new Date().toISOString(),
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onPublish(publishData);
      toast.success('Card published successfully!');
    } catch (error) {
      toast.error('Failed to publish card');
    } finally {
      setIsPublishing(false);
    }
  };

  const visibilityOptions = [
    {
      id: 'public',
      label: 'Public',
      icon: <Globe className="w-4 h-4" />,
      description: 'Anyone can view and discover your card',
    },
    {
      id: 'unlisted',
      label: 'Unlisted',
      icon: <Eye className="w-4 h-4" />,
      description: 'Only people with the link can view',
    },
    {
      id: 'private',
      label: 'Private',
      icon: <Lock className="w-4 h-4" />,
      description: 'Only you can view this card',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Publish Your Card</h2>
        <p className="text-gray-400">
          Configure how your card will be shared and discovered
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publishing Settings */}
        <div className="space-y-6">
          {/* Visibility Settings */}
          <Card className="p-4 bg-crd-dark border-crd-border">
            <h3 className="text-white font-medium mb-4">Visibility</h3>
            <div className="space-y-3">
              {visibilityOptions.map(option => (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    settings.visibility === option.id
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-crd-border hover:border-crd-green/50'
                  }`}
                  onClick={() => updateSetting('visibility', option.id as any)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-crd-green">{option.icon}</div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      settings.visibility === option.id
                        ? 'border-crd-green bg-crd-green'
                        : 'border-gray-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Marketplace Settings */}
          <Card className="p-4 bg-crd-dark border-crd-border">
            <h3 className="text-white font-medium mb-4">Marketplace</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-4 h-4 text-crd-green" />
                  <div>
                    <Label className="text-white">List for sale</Label>
                    <p className="text-sm text-gray-400">Allow others to purchase your card</p>
                  </div>
                </div>
                <Switch
                  checked={settings.marketplaceListing}
                  onCheckedChange={(checked) => updateSetting('marketplaceListing', checked)}
                />
              </div>

              {settings.marketplaceListing && (
                <div className="space-y-3 pl-7">
                  <div>
                    <Label className="text-white">Price (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.price}
                      onChange={(e) => updateSetting('price', e.target.value)}
                      className="mt-1"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Limited Edition</Label>
                      <p className="text-sm text-gray-400">Limit the number of copies</p>
                    </div>
                    <Switch
                      checked={settings.limitedEdition}
                      onCheckedChange={(checked) => updateSetting('limitedEdition', checked)}
                    />
                  </div>

                  {settings.limitedEdition && (
                    <div>
                      <Label className="text-white">Edition Size</Label>
                      <Input
                        type="number"
                        min="1"
                        value={settings.editionSize}
                        onChange={(e) => updateSetting('editionSize', e.target.value)}
                        className="mt-1"
                        placeholder="100"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Additional Options */}
          <Card className="p-4 bg-crd-dark border-crd-border">
            <h3 className="text-white font-medium mb-4">Additional Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Gift className="w-4 h-4 text-crd-green" />
                  <div>
                    <Label className="text-white">Print Available</Label>
                    <p className="text-sm text-gray-400">Offer physical prints</p>
                  </div>
                </div>
                <Switch
                  checked={settings.printAvailable}
                  onCheckedChange={(checked) => updateSetting('printAvailable', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-crd-green" />
                  <div>
                    <Label className="text-white">Allow Comments</Label>
                    <p className="text-sm text-gray-400">Let others comment on your card</p>
                  </div>
                </div>
                <Switch
                  checked={settings.allowComments}
                  onCheckedChange={(checked) => updateSetting('allowComments', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="w-4 h-4 text-crd-green" />
                  <div>
                    <Label className="text-white">Allow Reactions</Label>
                    <p className="text-sm text-gray-400">Enable likes and reactions</p>
                  </div>
                </div>
                <Switch
                  checked={settings.allowReactions}
                  onCheckedChange={(checked) => updateSetting('allowReactions', checked)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Publishing Preview */}
        <div className="space-y-6">
          <Card className="p-4 bg-crd-dark border-crd-border">
            <h3 className="text-white font-medium mb-4">Publishing Preview</h3>
            
            {/* Card Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Title:</span>
                <span className="text-white">{cardData.cardData?.title || 'Untitled Card'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Visibility:</span>
                <span className="text-white capitalize">{settings.visibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Marketplace:</span>
                <span className="text-white">
                  {settings.marketplaceListing ? `$${settings.price}` : 'Not for sale'}
                </span>
              </div>
              {settings.limitedEdition && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Edition:</span>
                  <span className="text-white">Limited to {settings.editionSize}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-crd-dark border-crd-border">
            <h3 className="text-white font-medium mb-4">After Publishing</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Your card will be saved to your profile</p>
              <p>• You can edit settings anytime</p>
              <p>• Analytics will be available in your dashboard</p>
              {settings.marketplaceListing && (
                <p>• Buyers will be able to purchase your card</p>
              )}
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
          disabled={isPublishing}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Preview</span>
        </Button>
        
        <Button
          onClick={handlePublish}
          disabled={isPublishing}
          className="bg-crd-green text-black hover:bg-crd-green/90 min-w-[120px]"
        >
          {isPublishing ? 'Publishing...' : 'Publish Card'}
        </Button>
      </div>
    </div>
  );
};