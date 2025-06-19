
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Filter, Square, Maximize } from 'lucide-react';
import { EnhancedPhotoEditSection } from './EnhancedPhotoEditSection';
import { AdaptiveTemplatePreview } from './AdaptiveTemplatePreview';
import { ADAPTIVE_TEMPLATES, convertAdaptiveToDesignTemplate } from '@/data/adaptiveTemplates';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';

interface FrameSelectionSidebarProps {
  mode: WizardMode;
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onPhotoRemove: () => void;
  isAnalyzing: boolean;
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
}

export const FrameSelectionSidebar = ({
  mode,
  selectedPhoto,
  onPhotoSelect,
  onPhotoRemove,
  isAnalyzing,
  selectedTemplate,
  onTemplateSelect
}: FrameSelectionSidebarProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [imageFormat, setImageFormat] = useState<'square' | 'circle' | 'fullBleed'>('fullBleed');
  const [showAllFormats, setShowAllFormats] = useState(false);

  // Use adaptive templates for consistent rendering
  const getFilteredTemplates = () => {
    let filtered = ADAPTIVE_TEMPLATES;
    
    if (mode === 'quick') {
      // In quick mode, prioritize popular templates
      filtered = ADAPTIVE_TEMPLATES.filter(t => !t.is_premium || t.usage_count > 500);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();
  const categories = [...new Set(ADAPTIVE_TEMPLATES.map(t => t.category))].filter(Boolean);

  const handleTemplateSelect = (adaptiveTemplate: any) => {
    const convertedTemplate = convertAdaptiveToDesignTemplate(adaptiveTemplate);
    onTemplateSelect(convertedTemplate);
  };

  const formatIcons = {
    fullBleed: Maximize,
    square: Square,
    circle: Square // Using square icon for both since circle uses same crop
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Photo Upload/Edit Section */}
      <EnhancedPhotoEditSection
        selectedPhoto={selectedPhoto}
        selectedTemplate={selectedTemplate}
        imageFormat={imageFormat}
        onPhotoSelect={onPhotoSelect}
        onPhotoRemove={onPhotoRemove}
        onImageFormatChange={setImageFormat}
        isAnalyzing={isAnalyzing}
      />

      {/* Frame Selection */}
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Choose Frame</h3>
              <div className="flex items-center gap-2">
                {mode === 'advanced' && (
                  <Filter className="w-4 h-4 text-crd-lightGray" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllFormats(!showAllFormats)}
                  className="text-xs border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
                >
                  {showAllFormats ? 'Single View' : 'All Formats'}
                </Button>
              </div>
            </div>

            {/* AI Recommendation */}
            {mode === 'quick' && selectedTemplate && (
              <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-3">
                <div className="flex items-center gap-2 text-crd-green text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">AI Recommended</span>
                </div>
                <p className="text-xs text-crd-lightGray mt-1">
                  {selectedTemplate.name} works perfectly with your {imageFormat === 'fullBleed' ? 'full card' : 'cropped'} format
                </p>
              </div>
            )}

            {/* Category Filter (Advanced Mode) */}
            {mode === 'advanced' && categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('all')}
                  className={`text-xs ${categoryFilter === 'all' 
                    ? 'bg-crd-blue text-white hover:bg-crd-blue/90' 
                    : 'bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-white'
                  }`}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                    className={`text-xs ${categoryFilter === category 
                      ? 'bg-crd-blue text-white hover:bg-crd-blue/90' 
                      : 'bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-white'
                    }`}
                  >
                    {category?.charAt(0).toUpperCase() + category?.slice(1)}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Adaptive Frames Grid */}
            <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="space-y-2">
                  {/* Template Info */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium text-sm">{template.name}</h4>
                    {template.is_premium && mode === 'advanced' && (
                      <Badge className="bg-yellow-500 text-black text-xs px-1 py-0">
                        <Star className="w-2 h-2 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>

                  {/* Template Preview */}
                  <div
                    onClick={() => handleTemplateSelect(template)}
                    className={`relative cursor-pointer transition-all border rounded-lg overflow-hidden p-2 ${
                      selectedTemplate?.id === template.id
                        ? `ring-2 ${mode === 'quick' ? 'ring-crd-green border-crd-green bg-crd-green/10' : 'ring-crd-blue border-crd-blue bg-crd-blue/10'}`
                        : 'bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40 border-crd-mediumGray/50 hover:border-crd-mediumGray'
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <AdaptiveTemplatePreview 
                        template={template} 
                        selectedPhoto={selectedPhoto}
                        imageFormat={imageFormat}
                        className="aspect-[2.5/3.5]"
                      />
                      <div className="space-y-1 text-xs">
                        <p className="text-crd-lightGray">{template.description}</p>
                        <div className="flex flex-col gap-1">
                          <div className="text-crd-lightGray">
                            Supports: Full Card, Cropped
                          </div>
                          <div className="text-crd-green text-xs font-medium">
                            {imageFormat === 'fullBleed' ? 'Full Card' : 'Cropped'} format
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ready Status */}
            {selectedPhoto && selectedTemplate && (
              <div className="text-center p-3 bg-crd-green/10 border border-crd-green/20 rounded-lg">
                <p className="text-sm text-crd-lightGray">
                  ✓ Ready with <strong className="text-crd-green">{imageFormat === 'fullBleed' ? 'full card' : 'cropped'}</strong> format! Click <strong className="text-crd-green">Next</strong> to continue.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
