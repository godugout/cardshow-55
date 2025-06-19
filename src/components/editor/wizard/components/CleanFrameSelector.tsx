
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { AdaptiveTemplatePreview } from './AdaptiveTemplatePreview';
import { ADAPTIVE_TEMPLATES, convertAdaptiveToDesignTemplate } from '@/data/adaptiveTemplates';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';

interface CleanFrameSelectorProps {
  mode: WizardMode;
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
  imageFormat: 'square' | 'circle' | 'fullBleed';
  onImageFormatChange: (format: 'square' | 'circle' | 'fullBleed') => void;
}

export const CleanFrameSelector = ({
  mode,
  selectedPhoto,
  selectedTemplate,
  onTemplateSelect,
  imageFormat,
  onImageFormatChange
}: CleanFrameSelectorProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Use top templates for quick mode, all for advanced
  const getFilteredTemplates = () => {
    let filtered = ADAPTIVE_TEMPLATES;
    
    if (mode === 'quick') {
      // Show only popular templates in quick mode
      filtered = ADAPTIVE_TEMPLATES.filter(t => !t.is_premium || t.usage_count > 500).slice(0, 6);
    }
    
    if (categoryFilter !== 'all' && showAdvancedOptions) {
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

  return (
    <Card className="bg-crd-darkGray border-crd-mediumGray/30">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Choose Frame</h3>
            {mode === 'advanced' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
              >
                {showAdvancedOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showAdvancedOptions ? 'Less Options' : 'More Options'}
              </Button>
            )}
          </div>

          {/* Format Selection - Single Location */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">Photo Format</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fullBleed' as const, name: 'Full Card', icon: '🃏' },
                { id: 'square' as const, name: 'Square', icon: '⬜' },
                { id: 'circle' as const, name: 'Circle', icon: '⭕' }
              ].map((format) => (
                <Button
                  key={format.id}
                  onClick={() => onImageFormatChange(format.id)}
                  variant="outline"
                  size="sm"
                  className={`${
                    imageFormat === format.id
                      ? 'bg-crd-green/20 border-crd-green text-crd-green hover:bg-crd-green/30'
                      : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{format.icon}</span>
                  {format.name}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          {mode === 'quick' && selectedTemplate && (
            <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-crd-green text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">AI Recommended</span>
              </div>
              <p className="text-xs text-crd-lightGray">
                {selectedTemplate.name} works perfectly with your {imageFormat === 'fullBleed' ? 'full card' : 'cropped'} format
              </p>
            </div>
          )}

          {/* Advanced Category Filter */}
          {showAdvancedOptions && categories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium text-sm">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('all')}
                  className={`text-xs ${categoryFilter === 'all' 
                    ? 'bg-crd-blue text-white hover:bg-crd-blue/90' 
                    : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white'
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
                      : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white'
                    }`}
                  >
                    {category?.charAt(0).toUpperCase() + category?.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Clean Templates Grid */}
          <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`relative cursor-pointer transition-all border rounded-lg overflow-hidden p-3 ${
                  selectedTemplate?.id === template.id
                    ? `ring-2 ${mode === 'quick' ? 'ring-crd-green border-crd-green bg-crd-green/10' : 'ring-crd-blue border-crd-blue bg-crd-blue/10'}`
                    : 'bg-crd-mediumGray/20 hover:bg-crd-mediumGray/40 border-crd-mediumGray/50 hover:border-crd-mediumGray'
                }`}
              >
                <div className="flex gap-3">
                  {/* Template Preview */}
                  <div className="w-20 aspect-[2.5/3.5] flex-shrink-0">
                    <AdaptiveTemplatePreview 
                      template={template} 
                      selectedPhoto={selectedPhoto}
                      imageFormat={imageFormat}
                      className="w-full h-full"
                    />
                  </div>
                  
                  {/* Template Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium text-sm truncate">{template.name}</h4>
                      {template.is_premium && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 text-xs px-1 py-0 ml-2">
                          <Star className="w-2 h-2 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    <p className="text-crd-lightGray text-xs mb-2 line-clamp-2">{template.description}</p>
                    <div className="text-crd-green text-xs font-medium">
                      ✓ Supports {imageFormat === 'fullBleed' ? 'Full Card' : 'Cropped'} format
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ready Status */}
          {selectedPhoto && selectedTemplate && (
            <div className="text-center p-4 bg-crd-green/10 border border-crd-green/20 rounded-lg">
              <p className="text-sm text-crd-lightGray">
                ✓ Ready with <strong className="text-crd-green">{imageFormat === 'fullBleed' ? 'full card' : 'cropped'}</strong> format!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
