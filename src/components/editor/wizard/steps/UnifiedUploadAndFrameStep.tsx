
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Settings, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { CompactPhotoUpload } from '../components/CompactPhotoUpload';
import { EnhancedCardPreview } from '../components/EnhancedCardPreview';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';
import { ESSENTIAL_FRAMES } from '@/data/cardTemplates';

interface UnifiedUploadAndFrameStepProps {
  mode: WizardMode;
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
}

export const UnifiedUploadAndFrameStep = ({ 
  mode,
  selectedPhoto, 
  onPhotoSelect, 
  onAnalysisComplete,
  templates,
  selectedTemplate,
  onTemplateSelect
}: UnifiedUploadAndFrameStepProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { isAnalyzing, handleFileUpload } = usePhotoUpload(
    onPhotoSelect, 
    onAnalysisComplete
  );

  const handlePhotoRemove = () => {
    onPhotoSelect('');
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-4 h-4 text-crd-green" />;
      case 'advanced': return <Settings className="w-4 h-4 text-crd-blue" />;
      default: return null;
    }
  };

  // Filter templates - always show essential frames first
  const getFilteredTemplates = () => {
    let filtered = [...ESSENTIAL_FRAMES];
    
    if (mode === 'quick') {
      // In quick mode, add popular templates
      filtered = [...filtered, ...templates.filter(t => !t.is_premium && t.usage_count > 100)];
    } else {
      // In advanced mode, add all templates
      filtered = [...filtered, ...templates];
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();
  const categories = [...new Set(templates.map(t => t.category))].filter(Boolean);

  const renderFramePreview = (template: DesignTemplate) => {
    const isGraded = template.id.includes('graded-slab');
    const is3D = template.id.includes('3d');
    
    return (
      <div 
        className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden bg-white"
        style={{ 
          transform: is3D ? 'perspective(500px) rotateY(-3deg) rotateX(1deg)' : 'none'
        }}
      >
        {isGraded ? (
          // Graded slab preview
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 rounded-lg">
            <div className="absolute top-1 left-1 bg-black text-white px-1 py-0.5 rounded text-xs font-bold">
              CRD
            </div>
            <div className="absolute top-1 right-1 bg-crd-green text-black px-1 py-0.5 rounded text-xs font-bold">
              10
            </div>
            <div className="absolute inset-2 bg-white rounded border shadow-inner">
              {selectedPhoto ? (
                <img 
                  src={selectedPhoto}
                  alt="Preview"
                  className="w-full h-3/4 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-3/4 bg-gray-200 rounded-t flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Photo</span>
                </div>
              )}
              <div className="p-1">
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          // Regular frame preview
          <>
            {selectedPhoto ? (
              <img 
                src={selectedPhoto}
                alt="Preview"
                className={`w-full ${template.id === 'full-bleed' ? 'h-full' : 'h-3/4'} object-cover`}
              />
            ) : (
              <div className={`w-full ${template.id === 'full-bleed' ? 'h-full' : 'h-3/4'} bg-gray-200 flex items-center justify-center`}>
                <span className="text-gray-400 text-xs">Photo</span>
              </div>
            )}
            {template.id !== 'full-bleed' && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-1">
                <div className="h-2 bg-white/30 rounded"></div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-8 h-full">
      {/* Left Side - Large Preview (2/3 width) */}
      <div className="col-span-2 space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getModeIcon()}
            <h2 className="text-2xl font-bold text-white">Create Your Card</h2>
          </div>
          <p className="text-crd-lightGray">
            {mode === 'quick' 
              ? 'Upload your photo and see it transformed into a professional card instantly'
              : 'Upload your photo and choose from our complete frame collection'
            }
          </p>
        </div>

        {/* AI Analysis Status */}
        {isAnalyzing && (
          <div className="text-center p-4 rounded-lg bg-crd-green/20 border border-crd-green/40">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 animate-pulse text-crd-green" />
              <span className="text-white font-medium">
                AI is analyzing your image and suggesting the perfect setup...
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Preview */}
        <EnhancedCardPreview
          selectedPhoto={selectedPhoto}
          selectedTemplate={selectedTemplate}
          cardData={{
            title: 'Your Card Title',
            description: 'Card description will appear here',
            rarity: 'rare'
          }}
        />
      </div>

      {/* Right Sidebar - Upload & Frame Selection (1/3 width) */}
      <div className="space-y-6">
        {/* Upload Section */}
        <CompactPhotoUpload
          selectedPhoto={selectedPhoto}
          onPhotoSelect={onPhotoSelect}
          onPhotoRemove={handlePhotoRemove}
          isAnalyzing={isAnalyzing}
        />

        {/* Frame Selection */}
        <Card className="bg-crd-darkGray border-crd-mediumGray/30">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Choose Frame</h3>
                {mode === 'advanced' && (
                  <Filter className="w-4 h-4 text-crd-lightGray" />
                )}
              </div>

              {/* AI Recommendation */}
              {mode === 'quick' && selectedTemplate && (
                <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-crd-green text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">AI Recommended</span>
                  </div>
                  <p className="text-xs text-crd-lightGray mt-1">
                    {selectedTemplate.name} works perfectly for your image
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
                      ? 'bg-crd-blue text-white' 
                      : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
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
                        ? 'bg-crd-blue text-white' 
                        : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
                      }`}
                    >
                      {category?.charAt(0).toUpperCase() + category?.slice(1)}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Frames Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => onTemplateSelect(template)}
                    className={`p-2 rounded-lg cursor-pointer transition-all border ${
                      selectedTemplate?.id === template.id
                        ? `ring-2 ${mode === 'quick' ? 'ring-crd-green border-crd-green bg-crd-green/10' : 'ring-crd-blue border-crd-blue bg-crd-blue/10'}`
                        : 'bg-editor-tool hover:bg-editor-border border-editor-border hover:border-crd-mediumGray'
                    }`}
                  >
                    {renderFramePreview(template)}
                    
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium text-xs truncate">{template.name}</h4>
                        {template.is_premium && mode === 'advanced' && (
                          <Badge className="bg-yellow-500 text-black text-xs px-1 py-0">
                            <Star className="w-2 h-2 mr-1" />
                            Pro
                          </Badge>
                        )}
                        {ESSENTIAL_FRAMES.includes(template) && (
                          <Badge className="bg-crd-green text-black text-xs px-1 py-0">
                            Essential
                          </Badge>
                        )}
                      </div>
                      
                      {mode === 'advanced' && template.description && (
                        <p className="text-crd-lightGray text-xs line-clamp-2">{template.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ready Status */}
              {selectedPhoto && selectedTemplate && (
                <div className="text-center p-3 bg-crd-green/10 border border-crd-green/20 rounded-lg">
                  <p className="text-sm text-crd-lightGray">
                    ✓ Ready to proceed! Click <strong className="text-crd-green">Next</strong> to continue.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
