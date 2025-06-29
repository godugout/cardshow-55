
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Gem, Star } from 'lucide-react';
import type { DesignTemplate } from '@/types/card';

interface TemplateSelectionStepProps {
  templates: DesignTemplate[];
  templatesLoading: boolean;
  selectedTemplate: string | null;
  imageAnalysis: any;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  templates,
  templatesLoading,
  selectedTemplate,
  imageAnalysis,
  onTemplateSelect
}) => {
  const getRarityIcon = (price: number = 0) => {
    if (price >= 20) return <Crown className="h-4 w-4 text-orange-400" />;
    if (price >= 5) return <Gem className="h-4 w-4 text-purple-400" />;
    return <Star className="h-4 w-4 text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-crd-white">Choose Your Frame</h4>
          <p className="text-crd-lightGray">Select a template that matches your card's style</p>
        </div>
        {imageAnalysis?.suggestedTemplate && (
          <Badge variant="outline" className="bg-crd-green/10 text-crd-green border-crd-green/30">
            AI Suggests: {imageAnalysis.suggestedTemplate}
          </Badge>
        )}
      </div>

      {templatesLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[5/7] bg-crd-mediumGray/20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {templates.slice(0, 6).map((template) => {
            const isSelected = selectedTemplate === template.id;
            
            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isSelected 
                    ? 'ring-2 ring-crd-green bg-crd-green/10' 
                    : 'bg-crd-mediumGray/20 hover:bg-crd-mediumGray/30'
                } border-crd-mediumGray/30`}
                onClick={() => onTemplateSelect(template.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[5/7] rounded-lg overflow-hidden mb-3 bg-crd-darkGray">
                    {template.preview_url ? (
                      <img 
                        src={template.preview_url} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-600 rounded mx-auto mb-2" />
                          <p className="text-xs text-crd-mediumGray">Preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-crd-white text-sm truncate">{template.name}</h5>
                      <div className="flex items-center">
                        {getRarityIcon()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-crd-green font-medium">
                        {template.is_premium ? 'Premium' : 'Free'}
                      </span>
                      <span className="text-crd-mediumGray">{template.usage_count || 0} uses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
