
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Zap, Settings, Sparkles, User, FileText, Crown, Eye } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';
import type { PublishingOptions } from '@/types/card';
import type { WizardMode } from '../UnifiedCardWizard';

interface UnifiedCardDetailsStepProps {
  mode: WizardMode;
  cardData: CardData;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  onCreatorAttributionUpdate: (updates: any) => void;
  onPublishingUpdate: (updates: Partial<PublishingOptions>) => void;
  aiAnalysisComplete?: boolean;
}

export const UnifiedCardDetailsStep = ({ 
  mode,
  cardData, 
  onFieldUpdate, 
  onCreatorAttributionUpdate,
  onPublishingUpdate,
  aiAnalysisComplete = false
}: UnifiedCardDetailsStepProps) => {
  
  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-5 h-5 text-crd-green" />;
      case 'advanced': return <Settings className="w-5 h-5 text-crd-blue" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'quick': 
        return 'Review AI-generated details and publish your card with recommended settings.';
      case 'advanced': 
        return 'Fine-tune every detail of your card and configure advanced publishing options.';
      default: 
        return 'Complete your card details and choose how to share it.';
    }
  };

  // Quick mode: simplified form with AI-generated content
  const quickModeContent = (
    <div className="space-y-6">
      {/* AI-generated content preview */}
      {aiAnalysisComplete && (
        <Card className="bg-crd-green/10 border-crd-green/30">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-crd-green" />
              AI-Generated Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Card Title</Label>
              <Input
                value={cardData.title || ''}
                onChange={(e) => onFieldUpdate('title', e.target.value)}
                className="bg-crd-darkGray border-crd-mediumGray text-white mt-1"
                placeholder="AI-generated title"
              />
            </div>
            
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={cardData.description || ''}
                onChange={(e) => onFieldUpdate('description', e.target.value)}
                className="bg-crd-darkGray border-crd-mediumGray text-white mt-1"
                rows={3}
                placeholder="AI-generated description"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick publishing options */}
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Sharing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Public Gallery</div>
              <p className="text-xs text-crd-lightGray">Share your card in the CRD community gallery</p>
            </div>
            <Switch
              checked={cardData.publishing_options?.crd_catalog_inclusion || false}
              onCheckedChange={(checked) => onPublishingUpdate({ crd_catalog_inclusion: checked })}
            />
          </div>

          <div className="p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <div className="flex items-center gap-2 text-crd-green mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">Ready to Publish!</span>
            </div>
            <p className="text-xs text-crd-lightGray">
              Your card will be created with AI-optimized settings. You can adjust more options after publishing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Advanced mode: full form with all options
  const advancedModeContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card Details */}
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Card Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Title *</Label>
            <Input
              value={cardData.title || ''}
              onChange={(e) => onFieldUpdate('title', e.target.value)}
              className="bg-crd-darkGray border-crd-mediumGray text-white mt-1"
              placeholder="Enter card title"
            />
          </div>
          
          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              value={cardData.description || ''}
              onChange={(e) => onFieldUpdate('description', e.target.value)}
              className="bg-crd-darkGray border-crd-mediumGray text-white mt-1"
              rows={3}
              placeholder="Describe your card"
            />
          </div>

          <div>
            <Label className="text-white">Series (Optional)</Label>
            <Input
              value={cardData.series || ''}
              onChange={(e) => onFieldUpdate('series', e.target.value)}
              className="bg-crd-darkGray border-crd-mediumGray text-white mt-1"
              placeholder="Card series name"
            />
          </div>

          <div>
            <Label className="text-white">Rarity</Label>
            <select 
              value={cardData.rarity || 'common'}
              onChange={(e) => onFieldUpdate('rarity', e.target.value as any)}
              className="w-full mt-1 bg-crd-darkGray border border-crd-mediumGray rounded text-white p-2"
            >
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="ultra-rare">Ultra Rare</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Publishing & Distribution */}
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Publishing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Marketplace Listing</div>
              <p className="text-xs text-crd-lightGray">List on CRD marketplace for trading</p>
            </div>
            <Switch
              checked={cardData.publishing_options?.marketplace_listing || false}
              onCheckedChange={(checked) => onPublishingUpdate({ marketplace_listing: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Public Gallery</div>
              <p className="text-xs text-crd-lightGray">Include in main catalog</p>
            </div>
            <Switch
              checked={cardData.publishing_options?.crd_catalog_inclusion || false}
              onCheckedChange={(checked) => onPublishingUpdate({ crd_catalog_inclusion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Print Available</div>
              <p className="text-xs text-crd-lightGray">Allow physical printing</p>
            </div>
            <Switch
              checked={cardData.publishing_options?.print_available || false}
              onCheckedChange={(checked) => onPublishingUpdate({ print_available: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Limited Edition</div>
              <p className="text-xs text-crd-lightGray">Restrict number of copies</p>
            </div>
            <Switch
              checked={cardData.publishing_options?.distribution?.limited_edition || false}
              onCheckedChange={(checked) => onPublishingUpdate({ 
                distribution: {
                  ...cardData.publishing_options?.distribution,
                  limited_edition: checked
                }
              })}
            />
          </div>

          <div className="pt-4 border-t border-crd-mediumGray">
            <div className="text-sm text-crd-lightGray space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-crd-green">Ready to publish</span>
              </div>
              <div className="flex justify-between">
                <span>Verification:</span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-xs">
                  Auto-approved
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getModeIcon()}
          <h2 className="text-2xl font-bold text-white">
            {mode === 'quick' ? 'Finalize & Publish' : 'Complete Your Card'}
          </h2>
        </div>
        <p className="text-crd-lightGray">{getModeDescription()}</p>
      </div>

      {/* Mode-specific content */}
      {mode === 'quick' ? quickModeContent : advancedModeContent}

      {/* Privacy notice */}
      <div className="bg-crd-mediumGray/10 border border-crd-mediumGray/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-crd-lightGray mt-0.5" />
          <div>
            <p className="text-white font-medium mb-1">Privacy & Ownership</p>
            <p className="text-sm text-crd-lightGray">
              You retain full ownership of your card. You can change these settings anytime from your dashboard.
              {mode === 'quick' && ' Additional options are available in advanced mode.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
