
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Download, 
  Share, 
  Edit, 
  Palette, 
  Sparkles,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

interface PreviewPhaseProps {
  cardEditor: {
    cardData: CardData;
  };
  onComplete: () => void;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export const PreviewPhase = ({ cardEditor, onComplete }: PreviewPhaseProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showDetails, setShowDetails] = useState(false);

  const handleContinue = () => {
    toast.success('Preview approved! Ready to publish.');
    onComplete();
  };

  const viewModes = [
    { id: 'desktop' as const, label: 'Desktop', icon: Monitor },
    { id: 'tablet' as const, label: 'Tablet', icon: Tablet },
    { id: 'mobile' as const, label: 'Mobile', icon: Smartphone }
  ];

  const getCardSize = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-48 h-64';
      case 'tablet':
        return 'w-64 h-80';
      default:
        return 'w-80 h-96';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Preview Your Creation</h2>
        <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          Review your card across different devices and make final adjustments before publishing
        </p>
      </div>

      {/* View Mode Selector */}
      <div className="flex justify-center">
        <div className="flex bg-crd-darker rounded-lg p-1">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === mode.id
                    ? 'bg-crd-green text-black'
                    : 'text-crd-lightGray hover:text-crd-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Preview */}
        <div className="lg:col-span-2">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview ({viewMode})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-8">
                <div className={`${getCardSize()} relative`}>
                  {/* Card Container */}
                  <div className="w-full h-full bg-crd-darkest rounded-lg border border-crd-mediumGray/30 overflow-hidden relative">
                    {cardEditor.cardData.image_url ? (
                      <img
                        src={cardEditor.cardData.image_url}
                        alt="Card Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Palette className="w-12 h-12 text-crd-mediumGray mx-auto mb-2" />
                          <p className="text-crd-mediumGray text-sm">No image uploaded</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Template Overlay */}
                    {cardEditor.cardData.template_id && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Template frame would be rendered here */}
                      </div>
                    )}
                    
                    {/* Effects Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Effects would be applied here */}
                    </div>
                  </div>
                  
                  {/* Device Frame */}
                  {viewMode !== 'desktop' && (
                    <div className="absolute -inset-4 border-2 border-crd-mediumGray/20 rounded-2xl bg-crd-mediumGray/5" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Details */}
        <div className="space-y-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Card Details
                </span>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-crd-lightGray hover:text-crd-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-crd-lightGray text-sm">Title</label>
                <p className="text-crd-white font-medium">
                  {cardEditor.cardData.title || 'Untitled Card'}
                </p>
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm">Description</label>
                <p className="text-crd-white text-sm">
                  {cardEditor.cardData.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <label className="text-crd-lightGray text-sm">Rarity</label>
                <Badge className="mt-1">
                  {cardEditor.cardData.rarity || 'Common'}
                </Badge>
              </div>
              
              {cardEditor.cardData.tags && cardEditor.cardData.tags.length > 0 && (
                <div>
                  <label className="text-crd-lightGray text-sm">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cardEditor.cardData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CRDButton
                variant="outline"
                className="w-full justify-start border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Preview
              </CRDButton>
              
              <CRDButton
                variant="outline"
                className="w-full justify-start border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Preview
              </CRDButton>
              
              <CRDButton
                variant="outline"
                className="w-full justify-start border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Make Changes
              </CRDButton>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-sm">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Dimensions</span>
                <span className="text-crd-white">2.5" × 3.5"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Resolution</span>
                <span className="text-crd-white">300 DPI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Format</span>
                <span className="text-crd-white">Digital</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Template</span>
                <span className="text-crd-white">
                  {cardEditor.cardData.template_id ? 'Custom' : 'Default'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <CRDButton
          onClick={handleContinue}
          className="bg-crd-green text-black hover:bg-crd-green/90 px-8 py-3"
        >
          Approve & Continue to Publish
          <Download className="w-4 h-4 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};
