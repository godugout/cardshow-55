
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Sparkles, Filter, Zap, Settings } from 'lucide-react';
import { ModularTemplatePreview } from '../components/ModularTemplatePreview';
import { MODULAR_TEMPLATES, convertToDesignTemplate } from '@/data/modularTemplates';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';

interface UnifiedTemplateSelectionStepProps {
  mode: WizardMode;
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
  selectedPhoto?: string;
}

export const UnifiedTemplateSelectionStep = ({ 
  mode, 
  templates, 
  selectedTemplate, 
  onTemplateSelect,
  selectedPhoto
}: UnifiedTemplateSelectionStepProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-5 h-5 text-crd-green" />;
      case 'advanced': return <Settings className="w-5 h-5 text-crd-blue" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'quick': 
        return 'AI has suggested the best template for your photo. You can choose a different one if you prefer.';
      case 'advanced': 
        return 'Choose from our full collection of professional templates with complete customization options.';
      default: 
        return 'Select a template that fits your vision.';
    }
  };

  // Use modular templates instead of the passed templates for consistency
  const availableTemplates = MODULAR_TEMPLATES;
  
  const getFilteredTemplates = () => {
    let filtered = availableTemplates;
    
    if (mode === 'quick') {
      // In quick mode, prioritize popular and easy-to-use templates
      filtered = availableTemplates.filter(t => !t.is_premium || t.usage_count > 100);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();
  const categories = [...new Set(availableTemplates.map(t => t.category))].filter(Boolean);

  const handleTemplateSelect = (modularTemplate: any) => {
    const convertedTemplate = convertToDesignTemplate(modularTemplate);
    onTemplateSelect(convertedTemplate);
  };

  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getModeIcon()}
          <h2 className="text-2xl font-bold text-white">
            {mode === 'quick' ? 'AI Suggested Template' : 'Choose Your Template'}
          </h2>
        </div>
        <p className="text-crd-lightGray">{getModeDescription()}</p>
      </div>

      {/* AI suggestion highlight for quick mode */}
      {mode === 'quick' && selectedTemplate && (
        <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-crd-green mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI Recommendation</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Based on your photo, we recommend the <strong className="text-white">{selectedTemplate.name}</strong> template. 
            This template works great for {selectedTemplate.category} content.
          </p>
        </div>
      )}

      {/* Category filter - more prominent in advanced mode */}
      {mode === 'advanced' && categories.length > 0 && (
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-crd-lightGray" />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
              className={categoryFilter === 'all' 
                ? 'bg-crd-blue text-white' 
                : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
              }
            >
              All Templates
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className={categoryFilter === category 
                  ? 'bg-crd-blue text-white' 
                  : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
                }
              >
                {category?.charAt(0).toUpperCase() + category?.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Templates grid - using actual ModularTemplatePreview */}
      <div className={`grid gap-4 ${
        mode === 'quick' 
          ? 'grid-cols-2 lg:grid-cols-4' 
          : 'grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`p-3 rounded-xl cursor-pointer transition-all border ${
              selectedTemplate?.id === template.id
                ? `ring-2 ${mode === 'quick' ? 'ring-crd-green border-crd-green bg-crd-green/10' : 'ring-crd-blue border-crd-blue bg-crd-blue/10'}`
                : 'bg-editor-tool hover:bg-editor-border border-editor-border hover:border-crd-mediumGray'
            }`}
          >
            <ModularTemplatePreview 
              template={template} 
              selectedPhoto={selectedPhoto}
              className="mb-3"
            />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm truncate">{template.name}</h3>
                {template.is_premium && mode === 'advanced' && (
                  <Badge className="bg-yellow-500 text-black text-xs px-1 py-0">
                    <Star className="w-2 h-2 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
              
              {mode === 'advanced' && template.description && (
                <p className="text-crd-lightGray text-xs line-clamp-2">{template.description}</p>
              )}
              
              {mode === 'advanced' && (
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{template.usage_count} uses</span>
                  <span className="capitalize">{template.category}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick mode auto-advance hint */}
      {mode === 'quick' && selectedTemplate && (
        <div className="text-center p-4 bg-crd-green/5 border border-crd-green/20 rounded-lg">
          <p className="text-sm text-crd-lightGray">
            Perfect! Your template is selected. Click <strong className="text-crd-green">Next</strong> to continue with AI-generated card details.
          </p>
        </div>
      )}
    </div>
  );
};
