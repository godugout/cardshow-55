
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Zap, Settings, Crown, Globe, Eye, Printer } from 'lucide-react';
import type { PublishingOptions } from '@/types/card';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';

interface UnifiedPublishingOptionsStepProps {
  mode: WizardMode;
  publishingOptions: PublishingOptions;
  selectedTemplate: DesignTemplate | null;
  onPublishingUpdate: (updates: Partial<PublishingOptions>) => void;
}

export const UnifiedPublishingOptionsStep = ({ 
  mode,
  publishingOptions, 
  selectedTemplate, 
  onPublishingUpdate 
}: UnifiedPublishingOptionsStepProps) => {
  
  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-5 h-5 text-crd-green" />;
      case 'advanced': return <Settings className="w-5 h-5 text-crd-blue" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'quick': 
        return 'Your card is ready to publish! We\'ve set up recommended publishing options for you.';
      case 'advanced': 
        return 'Fine-tune how your card will be shared, distributed, and made available to others.';
      default: 
        return 'Configure how your card will be shared and distributed.';
    }
  };

  // Quick mode: simplified options with smart defaults
  const quickModeOptions = (
    <div className="space-y-4">
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Sharing Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Public Gallery</div>
              <p className="text-xs text-crd-lightGray">Share your card in the CRD community gallery</p>
            </div>
            <Switch
              checked={publishingOptions.crd_catalog_inclusion}
              onCheckedChange={(checked) => onPublishingUpdate({ crd_catalog_inclusion: checked })}
            />
          </div>

          <div className="p-3 bg-crd-green/10 border border-crd-green/30 rounded-lg">
            <div className="flex items-center gap-2 text-crd-green mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">Quick Publish Ready!</span>
            </div>
            <p className="text-xs text-crd-lightGray">
              Your card will be created and can be shared immediately. More options are available after publishing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Advanced mode: full options
  const advancedModeOptions = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Marketplace Listing</div>
              <p className="text-xs text-crd-lightGray">List on CRD marketplace for trading</p>
            </div>
            <Switch
              checked={publishingOptions.marketplace_listing}
              onCheckedChange={(checked) => onPublishingUpdate({ marketplace_listing: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Public Gallery</div>
              <p className="text-xs text-crd-lightGray">Include in main catalog</p>
            </div>
            <Switch
              checked={publishingOptions.crd_catalog_inclusion}
              onCheckedChange={(checked) => onPublishingUpdate({ crd_catalog_inclusion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Available
              </div>
              <p className="text-xs text-crd-lightGray">Allow physical printing and shipping</p>
            </div>
            <Switch
              checked={publishingOptions.print_available}
              onCheckedChange={(checked) => onPublishingUpdate({ print_available: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Edition Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Limited Edition</div>
              <p className="text-xs text-crd-lightGray">Restrict number of copies</p>
            </div>
            <Switch
              checked={publishingOptions.distribution?.limited_edition}
              onCheckedChange={(checked) => onPublishingUpdate({ 
                distribution: {
                  ...publishingOptions.distribution,
                  limited_edition: checked
                }
              })}
            />
          </div>

          {publishingOptions.distribution?.limited_edition && (
            <div className="p-3 bg-crd-mediumGray/20 rounded-lg">
              <p className="text-sm text-crd-lightGray">
                Limited edition settings can be configured after publishing in your card management dashboard.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-crd-mediumGray">
            <div className="text-sm text-crd-lightGray space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-crd-green">Ready to publish</span>
              </div>
              <div className="flex justify-between">
                <span>Template:</span>
                <span className="text-white">{selectedTemplate?.name}</span>
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
            {mode === 'quick' ? 'Ready to Publish!' : 'Publishing Options'}
          </h2>
        </div>
        <p className="text-crd-lightGray">{getModeDescription()}</p>
      </div>

      {/* Mode-specific content */}
      {mode === 'quick' ? quickModeOptions : advancedModeOptions}

      {/* Privacy notice */}
      <div className="bg-crd-mediumGray/10 border border-crd-mediumGray/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-crd-lightGray mt-0.5" />
          <div>
            <p className="text-white font-medium mb-1">Privacy & Ownership</p>
            <p className="text-sm text-crd-lightGray">
              You retain full ownership of your card. You can change these settings anytime from your dashboard.
              {mode === 'quick' && ' Additional privacy controls are available in advanced publishing options.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
