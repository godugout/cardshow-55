
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AIAnalysisData {
  dominantColors: string[];
  suggestedRarity: string;
  contentType: string;
  tags: string[];
  quality: number;
  detectedText: string | null;
  suggestedTemplate: string;
}

interface AIToolsPanelProps {
  analysisData: AIAnalysisData | null;
  onEnhance: () => void;
  onCreateFromPSD: () => void;
}

export const AIToolsPanel: React.FC<AIToolsPanelProps> = ({
  analysisData,
  onEnhance,
  onCreateFromPSD
}) => {
  const handleAIEnhance = () => {
    onEnhance();
  };

  const handleCreateFromPSD = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.psd,.ai,.eps';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        toast.info('PSD processing will be available soon!');
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
    onCreateFromPSD();
  };

  return (
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
            <Sparkles className="w-4 h-4 mr-2" />
            From PSD
          </CRDButton>
        </div>

        {analysisData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-crd-lightGray">Suggested Rarity:</span>
              <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                {analysisData.suggestedRarity}
              </Badge>
            </div>
            
            <div>
              <span className="text-sm text-crd-lightGray mb-2 block">Colors:</span>
              <div className="flex gap-2">
                {analysisData.dominantColors.slice(0, 3).map((color: string, index: number) => (
                  <div 
                    key={index}
                    className="w-6 h-6 rounded-full border border-crd-mediumGray/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {analysisData.detectedText && (
              <div className="text-xs text-crd-green">
                ✓ {analysisData.detectedText}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
