
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Download, Eye } from 'lucide-react';
import type { DetectedRegion } from '@/types/crdmkr';

interface HybridTemplateEditorProps {
  imageUrl: string;
  detectedRegions: DetectedRegion[];
  onTemplateGenerated: (templateData: any) => void;
}

export const HybridTemplateEditor: React.FC<HybridTemplateEditorProps> = ({
  imageUrl,
  detectedRegions,
  onTemplateGenerated
}) => {
  const [templateName, setTemplateName] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>(['#FF6B6B', '#4ECDC4', '#45B7D1']);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTemplate = async () => {
    setIsGenerating(true);
    
    // Simulate template generation
    setTimeout(() => {
      const templateData = {
        name: templateName || 'Generated Template',
        regions: detectedRegions,
        colors: selectedColors,
        generatedAt: new Date().toISOString()
      };
      
      onTemplateGenerated(templateData);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Preview */}
      <div className="flex-1">
        <Card className="bg-crd-darker border-crd-mediumGray/30 h-full">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Template Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-96">
            <img 
              src={imageUrl} 
              alt="Template preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </CardContent>
        </Card>
      </div>

      {/* Editor Panel */}
      <div className="w-80 space-y-4">
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white">Template Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-crd-lightGray mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-2 text-crd-white placeholder-crd-mediumGray"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-crd-lightGray mb-2">
                Color Palette
              </label>
              <div className="flex gap-2 flex-wrap">
                {selectedColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-crd-mediumGray/30 cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      // Color picker would go here
                    }}
                  />
                ))}
                <button className="w-8 h-8 rounded-full border-2 border-dashed border-crd-mediumGray/50 flex items-center justify-center text-crd-mediumGray hover:border-crd-green transition-colors">
                  +
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white">Detected Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {detectedRegions.map((region) => (
                <div key={region.id} className="flex items-center justify-between py-2 px-3 bg-crd-mediumGray/10 rounded">
                  <span className="text-crd-white text-sm capitalize">{region.type}</span>
                  <span className="text-crd-lightGray text-xs">
                    {Math.round(region.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <CRDButton
          onClick={handleGenerateTemplate}
          disabled={isGenerating}
          className="w-full"
          variant="primary"
        >
          {isGenerating ? (
            <>
              <Palette className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate Template
            </>
          )}
        </CRDButton>
      </div>
    </div>
  );
};
