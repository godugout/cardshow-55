
import React, { useState, useEffect } from 'react';
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

  // Default to "Common CRD" template on mount
  useEffect(() => {
    if (!selectedTemplate) {
      // Find the default "Common CRD" template (renamed from "CRD Full Bleed")
      const defaultTemplate = ADAPTIVE_TEMPLATES.find(t => t.id === 'sports-classic') || ADAPTIVE_TEMPLATES[0];
      const convertedTemplate = convertAdaptiveToDesignTemplate(defaultTemplate);
      // Rename it to "Common CRD"
      convertedTemplate.name = "Common CRD";
      onTemplateSelect(convertedTemplate);
    }
  }, [selectedTemplate, onTemplateSelect]);

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
    // Rename the default template
    if (adaptiveTemplate.id === 'sports-classic') {
      convertedTemplate.name = "Common CRD";
    }
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

          {/* Format Selection - Better Color Pattern */}
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">Photo Format</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fullBleed' as const, name: 'Full Card', icon: '🃏', color: 'bg-gradient-to-r from-crd-blue to-crd-purple' },
                { id: 'square' as const, name: 'Square', icon: '⬜', color: 'bg-gradient-to-r from-crd-green to-crd-blue' },
                { id: 'circle' as const, name: 'Circle', icon: '⭕', color: 'bg-gradient-to-r from-crd-orange to-crd-green' }
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() => onImageFormatChange(format.id)}
                  className={`relative overflow-hidden rounded-lg p-3 transition-all ${
                    imageFormat === format.id
                      ? 'ring-2 ring-crd-green scale-105 shadow-lg'
                      : 'hover:scale-102 hover:shadow-md'
                  }`}
                >
                  <div className={`absolute inset-0 ${format.color} opacity-20`} />
                  <div className={`relative flex flex-col items-center space-y-1 ${
                    imageFormat === format.id ? 'text-crd-green' : 'text-crd-lightGray'
                  }`}>
                    <span className="text-lg">{format.icon}</span>
                    <span className="text-xs font-medium">{format.name}</span>
                  </div>
                  {imageFormat === format.id && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-crd-green rounded-full shadow-lg" />
                  )}
                </button>
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
          
          {/* Clean Templates Grid - Thumbnail Focus */}
          <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`relative cursor-pointer transition-all border rounded-lg overflow-hidden ${
                  selectedTemplate?.id === template.id
                    ? `ring-2 ${mode === 'quick' ? 'ring-crd-green border-crd-green' : 'ring-crd-blue border-crd-blue'} scale-105 shadow-lg`
                    : 'border-crd-mediumGray/50 hover:border-crd-mediumGray hover:scale-102 hover:shadow-md'
                }`}
              >
                {/* Template Thumbnail */}
                <div className="w-full aspect-[2.5/3.5]">
                  <AdaptiveTemplatePreview 
                    template={template} 
                    selectedPhoto={selectedPhoto}
                    imageFormat={imageFormat}
                    className="w-full h-full"
                  />
                </div>
                
                {/* Minimal overlay info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-xs font-medium truncate">
                      {template.id === 'sports-classic' ? 'Common CRD' : template.name}
                    </h4>
                    {template.is_premium && (
                      <Star className="w-3 h-3 text-yellow-400 flex-shrink-0 ml-1" />
                    )}
                  </div>
                </div>
                
                {/* Selection indicator */}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-crd-green rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
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
