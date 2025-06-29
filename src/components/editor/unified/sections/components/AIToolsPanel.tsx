
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { PSDUploadDialog } from './PSDUploadDialog';

interface AIAnalysisData {
  dominantColors?: string[];
  suggestedRarity?: string;
  contentType?: string;
  tags?: string[];
  quality?: number;
  detectedText?: string | null;
  suggestedTemplate?: string;
  // CRDMKR specific properties
  layers?: string[];
  regions?: string[];
  colorPalette?: string[];
  confidence?: number;
  templateType?: string;
}

interface AIToolsPanelProps {
  analysisData: AIAnalysisData | null;
  onEnhance: () => void;
  onCreateFromPSD: () => void;
  onFrameGenerated?: (frameData: any) => void;
  userImage?: string;
}

export const AIToolsPanel: React.FC<AIToolsPanelProps> = ({
  analysisData,
  onEnhance,
  onCreateFromPSD,
  onFrameGenerated,
  userImage
}) => {
  const [showPSDDialog, setShowPSDDialog] = useState(false);

  const handleAIEnhance = () => {
    onEnhance();
  };

  const handleCreateFromPSD = () => {
    setShowPSDDialog(true);
    onCreateFromPSD();
  };

  const handleFrameGenerated = (frameData: any) => {
    console.log('🎯 Frame generated in AI Tools Panel:', frameData);
    onFrameGenerated?.(frameData);
    toast.success(`Custom frame "${frameData.name}" created successfully!`);
  };

  const handleClosePSDDialog = () => {
    setShowPSDDialog(false);
  };

  // Safely get colors with fallback
  const getDisplayColors = () => {
    const colors = analysisData?.dominantColors || analysisData?.colorPalette || [];
    return colors.slice(0, 3);
  };

  return (
    <>
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-crd-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-crd-green" />
              AI Tools
            </h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <CRDButton variant="outline" onClick={handleAIEnhance} className="w-full text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Enhance
            </CRDButton>
            <CRDButton variant="outline" onClick={handleCreateFromPSD} className="w-full text-sm">
              <Layers className="w-4 h-4 mr-2" />
              From PSD
            </CRDButton>
          </div>

          {analysisData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-crd-lightGray">Suggested Rarity:</span>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                  {analysisData.suggestedRarity || 'Common'}
                </Badge>
              </div>
              
              <div>
                <span className="text-sm text-crd-lightGray mb-2 block">Colors:</span>
                <div className="flex gap-2">
                  {getDisplayColors().map((color: string, index: number) => (
                    <div 
                      key={index}
                      className="w-6 h-6 rounded-full border border-crd-mediumGray/30"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {getDisplayColors().length === 0 && (
                    <div className="text-xs text-crd-mediumGray">No colors detected</div>
                  )}
                </div>
              </div>
              
              {analysisData.detectedText && (
                <div className="text-xs text-crd-green">
                  ✓ {analysisData.detectedText}
                </div>
              )}

              {analysisData.confidence && (
                <div className="text-xs text-crd-lightGray">
                  Confidence: {analysisData.confidence}%
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PSD Upload Dialog */}
      <PSDUploadDialog
        isOpen={showPSDDialog}
        onClose={handleClosePSDDialog}
        onFrameGenerated={handleFrameGenerated}
        userImage={userImage}
      />
    </>
  );
};
