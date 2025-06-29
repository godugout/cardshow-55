
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDMKRErrorBoundary } from '@/components/common/CRDMKRErrorBoundary';
import { Upload, Sparkles, Palette, Crown, Star } from 'lucide-react';
import { useTemplates } from '@/hooks/useTemplates';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface TemplateSelectionStepProps {
  templates?: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
  onCreateFromPSD?: () => void;
}

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onCreateFromPSD
}) => {
  console.log('🎨 TemplateSelectionStep: Rendering');

  const [activeTab, setActiveTab] = useState('standard');
  const { templates, isLoading } = useTemplates();

  const renderTemplatePreview = (template: DesignTemplate) => {
    const templateData = template.template_data || {};
    const background = templateData.background || '#1a1a2e';
    const primaryColor = templateData.primaryColor || '#16a085';
    
    return (
      <div 
        key={template.id}
        className={`relative cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
          selectedTemplate?.id === template.id 
            ? 'border-crd-green shadow-lg' 
            : 'border-crd-mediumGray/30 hover:border-crd-lightGray/50'
        }`}
        onClick={() => onTemplateSelect(template)}
      >
        <div 
          className="aspect-[2/3] rounded-lg p-4 flex flex-col justify-between"
          style={{ 
            background: background,
            border: `2px solid ${primaryColor}`
          }}
        >
          <div className="text-center">
            <div 
              className="text-sm font-bold mb-2"
              style={{ color: primaryColor }}
            >
              {template.name}
            </div>
            <div className="w-full h-16 bg-white/10 rounded mb-2"></div>
          </div>
          
          <div className="text-xs text-white/70 text-center">
            {template.category}
          </div>
        </div>
        
        {template.is_premium && (
          <div className="absolute top-2 right-2 bg-crd-gold text-black text-xs px-2 py-1 rounded flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Pro
          </div>
        )}
      </div>
    );
  };

  // Filter templates by type - fix the infinite loop by using proper filtering
  const standardTemplates = templates.filter(t => 
    !t.template_data?.sourceType || !t.template_data.sourceType.includes('crdmkr')
  );

  const crdmkrTemplates = templates.filter(t => 
    t.template_data?.sourceType?.includes('crdmkr')
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2">Choose a Template</h3>
        <p className="text-crd-lightGray text-sm">
          Select from our collection of templates or create your own
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-crd-darker">
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Standard Templates
          </TabsTrigger>
          <TabsTrigger value="crdmkr" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Generated
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-crd-mediumGray/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : standardTemplates.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {standardTemplates.map(renderTemplatePreview)}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-crd-lightGray mb-4">No standard templates available</div>
              <div className="text-sm text-crd-lightGray">Check your connection and try again</div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="crdmkr" className="mt-6">
          <CRDMKRErrorBoundary>
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-crd-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-crd-white mb-2">
                AI Template Generation
              </h3>
              <p className="text-crd-lightGray mb-4">
                This feature is being integrated into the photo upload step for a better mobile experience
              </p>
              <div className="text-sm text-crd-mediumGray">
                Upload your photo first, then access AI features there
              </div>
            </div>
          </CRDMKRErrorBoundary>
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <div className="text-center mt-4">
          <div className="text-crd-green text-sm flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            ✓ Selected: {selectedTemplate.name}
          </div>
        </div>
      )}
    </div>
  );
};
