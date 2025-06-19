
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Upload, Camera, FileImage, Zap, Settings, Star, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { WizardMode } from '../UnifiedCardWizard';

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
  const { isAnalyzing, imageDetails, handleFileUpload } = usePhotoUpload(
    onPhotoSelect, 
    onAnalysisComplete
  );

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
    event.target.value = '';
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-5 h-5 text-crd-green" />;
      case 'advanced': return <Settings className="w-5 h-5 text-crd-blue" />;
      default: return <Upload className="w-5 h-5" />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'quick': 
        return 'Upload your photo and our AI will suggest the perfect frame. Preview how your card will look instantly.';
      case 'advanced': 
        return 'Upload your photo and choose from our complete frame collection with full customization control.';
      default: 
        return 'Upload your photo and select a frame to get started.';
    }
  };

  // Filter templates based on mode
  const getFilteredTemplates = () => {
    let filtered = templates;
    
    if (mode === 'quick') {
      // In quick mode, prioritize popular and easy-to-use templates
      filtered = templates.filter(t => !t.is_premium || t.usage_count > 100);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();
  const categories = [...new Set(templates.map(t => t.category))].filter(Boolean);

  const getFramePreviewGradient = (templateId: string) => {
    const gradients: Record<string, string> = {
      'tcg-classic': 'from-blue-600 via-blue-500 to-yellow-400',
      'sports-modern': 'from-red-600 via-red-500 to-orange-400',
      'school-academic': 'from-green-600 via-green-500 to-yellow-400',
      'organization-corporate': 'from-blue-700 via-indigo-600 to-purple-500',
      'friends-social': 'from-pink-500 via-purple-500 to-cyan-400',
      'vintage-retro': 'from-amber-700 via-orange-500 to-red-500'
    };
    return gradients[templateId] || 'from-gray-500 to-gray-600';
  };

  const renderFramePreview = (template: DesignTemplate) => {
    return (
      <div 
        className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden bg-gradient-to-br"
        style={{ 
          background: `linear-gradient(to bottom right, ${
            template.template_data?.colors?.background || '#1a1a1a'
          }, ${template.template_data?.colors?.primary || '#333333'})`
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getFramePreviewGradient(template.id)} opacity-20`} />
        
        {/* Show user's photo if available, otherwise placeholder */}
        <div className="absolute inset-2 border border-white/20 rounded overflow-hidden">
          {selectedPhoto ? (
            <img 
              src={selectedPhoto}
              alt="Your photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center">
              <FileImage className="w-8 h-8 text-white/40" />
            </div>
          )}
        </div>
        
        {/* Frame elements overlay */}
        <div 
          className="absolute top-2 left-2 right-2 h-6 rounded flex items-center justify-center"
          style={{ backgroundColor: template.template_data?.colors?.primary || '#333' }}
        >
          <span className="text-white text-xs font-bold">FRAME HEADER</span>
        </div>
        
        <div 
          className="absolute bottom-2 left-2 right-2 h-4 rounded flex items-center justify-center"
          style={{ backgroundColor: template.template_data?.colors?.accent || '#666' }}
        >
          <span className="text-black text-xs">Footer</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Panel - Photo Upload */}
      <div className="space-y-6">
        {/* Mode-specific header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getModeIcon()}
            <h2 className="text-2xl font-bold text-white">Upload Your Photo</h2>
          </div>
          <p className="text-crd-lightGray">{getModeDescription()}</p>
        </div>

        {/* AI Analysis Status */}
        {isAnalyzing && (
          <div className={`text-center p-4 rounded-lg ${
            mode === 'quick' 
              ? 'bg-crd-green/20 border border-crd-green/40' 
              : 'bg-editor-border/20'
          }`}>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className={`w-5 h-5 animate-pulse ${
                mode === 'quick' ? 'text-crd-green' : 'text-crd-blue'
              }`} />
              <span className="text-white font-medium">
                AI is analyzing your image and suggesting frames...
              </span>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <Card className="bg-crd-darkGray border-crd-mediumGray/30">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragActive 
                  ? 'border-crd-green bg-crd-green/10' 
                  : selectedPhoto 
                    ? 'border-crd-green bg-crd-green/5' 
                    : 'border-crd-mediumGray bg-crd-mediumGray/10 hover:border-crd-green'
              }`}
            >
              <input {...getInputProps()} />
              
              {selectedPhoto ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={selectedPhoto}
                      alt="Uploaded photo"
                      className="max-w-full max-h-48 rounded-lg shadow-lg"
                    />
                    <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-md text-xs font-medium">
                      ✓ Ready
                    </div>
                  </div>
                  
                  {imageDetails && (
                    <div className="text-sm text-crd-lightGray">
                      {imageDetails.width} × {imageDetails.height} • {imageDetails.fileSize}
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('photo-input')?.click()}
                    className="bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-crd-mediumGray rounded-full flex items-center justify-center">
                      <FileImage className="w-10 h-10 text-crd-lightGray" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">
                      {isDragActive ? 'Drop your photo here!' : 'Drop your photo here, or click to browse'}
                    </p>
                    <p className="text-crd-lightGray text-sm">
                      Supports JPG, PNG, WebP • Max 10MB • Recommended: 1080x1080 or higher
                    </p>
                  </div>
                  <Button
                    onClick={() => document.getElementById('photo-input')?.click()}
                    className={`${
                      mode === 'quick' 
                        ? 'bg-crd-green hover:bg-crd-green/90 text-black' 
                        : 'bg-crd-blue hover:bg-crd-blue/90 text-white'
                    } font-medium`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card Preview & Details */}
        {selectedPhoto && selectedTemplate && (
          <Card className="bg-crd-darkGray border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-crd-green" />
                Your Card Preview
              </h3>
              
              <div className="flex gap-4">
                <div className="w-32">
                  {renderFramePreview(selectedTemplate)}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-white font-medium">Frame: {selectedTemplate.name}</h4>
                    <p className="text-crd-lightGray text-sm">{selectedTemplate.description}</p>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2 text-crd-green">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">AI generating card details...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-crd-lightGray">Category:</span>
                        <span className="text-white ml-2 capitalize">{selectedTemplate.category}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-crd-lightGray">Usage:</span>
                        <span className="text-white ml-2">{selectedTemplate.usage_count} cards created</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Panel - Frame Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Frame</h2>
          <p className="text-crd-lightGray">
            {selectedPhoto ? 'See how your photo looks in different frames' : 'Frames will show your photo when uploaded'}
          </p>
        </div>

        {/* AI suggestion highlight for quick mode */}
        {mode === 'quick' && selectedTemplate && (
          <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-crd-green mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">AI Recommendation</span>
            </div>
            <p className="text-sm text-crd-lightGray">
              Based on your photo, we recommend the <strong className="text-white">{selectedTemplate.name}</strong> frame. 
              This frame works great for {selectedTemplate.category} content.
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
                All Frames
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
        
        {/* Frames grid */}
        <div className={`grid gap-4 max-h-96 overflow-y-auto ${
          mode === 'quick' 
            ? 'grid-cols-2' 
            : 'grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                selectedTemplate?.id === template.id
                  ? `ring-2 ${mode === 'quick' ? 'ring-crd-green border-crd-green bg-crd-green/10' : 'ring-crd-blue border-crd-blue bg-crd-blue/10'}`
                  : 'bg-editor-tool hover:bg-editor-border border-editor-border hover:border-crd-mediumGray'
              }`}
            >
              {renderFramePreview(template)}
              
              <div className="space-y-2 mt-3">
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

        {/* Ready indicator */}
        {selectedPhoto && selectedTemplate && (
          <div className="text-center p-4 bg-crd-green/5 border border-crd-green/20 rounded-lg">
            <p className="text-sm text-crd-lightGray">
              Perfect! Your photo and frame are selected. Click <strong className="text-crd-green">Next</strong> to finalize your card.
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );
};
