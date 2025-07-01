
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft, Upload, Eye, Sparkles, Download, Zap, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { AnalysisDashboard } from '@/components/crdmkr/analysis/AnalysisDashboard';

type WorkflowStep = 'upload' | 'analysis' | 'suggestions' | 'optimize' | 'export';

export const SmartUploadWorkflow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  const { analyzeImage, isAnalyzing, progress } = useFreeAIAnalysis();

  const steps = [
    { id: 'upload', label: 'Upload Media', icon: Upload, description: 'Upload any image format' },
    { id: 'analysis', label: 'AI Analysis', icon: Eye, description: 'Analyze content and format' },
    { id: 'suggestions', label: 'Smart Suggestions', icon: Sparkles, description: 'Review AI recommendations' },
    { id: 'optimize', label: 'Auto-Optimize', icon: Zap, description: 'Apply optimizations' },
    { id: 'export', label: 'Quick Export', icon: Download, description: 'Download results' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[getCurrentStepIndex()];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    toast.success('Image uploaded successfully! Starting AI analysis...');
    setCurrentStep('analysis');

    // Auto-start analysis
    try {
      const result = await analyzeImage(url);
      if (result) {
        setAnalysisResult(result);
        setCurrentStep('suggestions');
        toast.success('AI analysis completed!');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
      setCurrentStep('upload');
    }
  };

  const handleSuggestionToggle = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId) 
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleApplyOptimizations = () => {
    setCurrentStep('optimize');
    
    // Simulate optimization process
    setTimeout(() => {
      setOptimizedResult({
        applied: selectedSuggestions,
        improvements: {
          quality: 85,
          efficiency: 92,
          compatibility: 98
        }
      });
      setCurrentStep('export');
      toast.success('Optimizations applied successfully!');
    }, 2000);
  };

  const suggestions = analysisResult ? [
    {
      id: 'enhance-contrast',
      title: 'Enhance Contrast',
      description: 'Improve image contrast for better card visibility',
      confidence: 88,
      category: 'quality'
    },
    {
      id: 'crop-suggestions',
      title: 'Smart Cropping',
      description: 'Optimize crop area for standard card dimensions',
      confidence: 92,
      category: 'layout'
    },
    {
      id: 'color-balance',
      title: 'Color Balance',
      description: 'Adjust colors for optimal printing results',
      confidence: 75,
      category: 'color'
    },
    {
      id: 'resolution-optimize',
      title: 'Resolution Optimization',
      description: 'Ensure optimal resolution for card printing',
      confidence: 95,
      category: 'technical'
    }
  ] : [];

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="text-center space-y-6">
            <div className="border-2 border-dashed border-crd-blue/30 rounded-xl h-96 flex flex-col items-center justify-center p-8 hover:border-crd-blue/50 transition-colors">
              <Upload className="w-16 h-16 text-crd-blue mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Smart Media Upload</h3>
              <p className="text-crd-lightGray mb-6 max-w-md">
                Upload any image format and let our AI analyze it for optimal card creation. 
                Supports JPG, PNG, WebP, and more.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="smart-upload"
              />
              <label htmlFor="smart-upload">
                <CRDButton className="bg-gradient-to-r from-crd-blue to-purple-500 text-white font-bold cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Image File
                </CRDButton>
              </label>
              <p className="text-sm text-crd-mediumGray mt-4">
                AI analysis • Smart suggestions • Quick optimization
              </p>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Eye className="w-16 h-16 text-crd-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Analyzing Your Image</h3>
              <p className="text-crd-lightGray mb-6">
                Our AI is analyzing your image to provide smart suggestions and optimizations
              </p>
            </div>
            
            {imageUrl && (
              <AnalysisDashboard
                result={analysisResult}
                isAnalyzing={isAnalyzing}
                progress={progress}
              />
            )}
          </div>
        );

      case 'suggestions':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 text-crd-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Smart Suggestions</h3>
              <p className="text-crd-lightGray">
                Based on our analysis, here are recommendations to optimize your card
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedSuggestions.includes(suggestion.id)
                      ? 'border-crd-green bg-crd-green/5'
                      : 'border-crd-mediumGray/30 bg-crd-darker hover:border-crd-orange/50'
                  }`}
                  onClick={() => handleSuggestionToggle(suggestion.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-crd-white mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-crd-lightGray mb-2">{suggestion.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category}
                          </Badge>
                          <span className="text-xs text-crd-mediumGray">
                            {suggestion.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      {selectedSuggestions.includes(suggestion.id) && (
                        <CheckCircle className="w-5 h-5 text-crd-green flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <CRDButton 
                onClick={handleApplyOptimizations}
                disabled={selectedSuggestions.length === 0}
                className="bg-crd-orange text-black"
              >
                Apply {selectedSuggestions.length} Optimization{selectedSuggestions.length !== 1 ? 's' : ''}
              </CRDButton>
            </div>
          </div>
        );

      case 'optimize':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-crd-orange/10 to-crd-yellow/10 border border-crd-orange/30 rounded-xl p-8">
              <Zap className="w-16 h-16 text-crd-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Applying Optimizations</h3>
              <p className="text-crd-lightGray mb-6">
                Processing your image with selected optimizations...
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={75} className="mb-4" />
                <p className="text-sm text-crd-mediumGray">Applying {selectedSuggestions.length} optimizations</p>
              </div>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-500/10 to-crd-green/10 border border-green-500/30 rounded-xl p-8">
              <Download className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Optimization Complete!</h3>
              <p className="text-crd-lightGray mb-6">
                Your image has been optimized and is ready for card creation
              </p>

              {/* Results Summary */}
              {optimizedResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-crd-darker p-4 rounded-lg">
                    <h4 className="text-white font-medium">Quality Score</h4>
                    <p className="text-2xl font-bold text-crd-green">{optimizedResult.improvements.quality}%</p>
                  </div>
                  <div className="bg-crd-darker p-4 rounded-lg">
                    <h4 className="text-white font-medium">Efficiency</h4>
                    <p className="text-2xl font-bold text-crd-blue">{optimizedResult.improvements.efficiency}%</p>
                  </div>
                  <div className="bg-crd-darker p-4 rounded-lg">
                    <h4 className="text-white font-medium">Compatibility</h4>
                    <p className="text-2xl font-bold text-crd-orange">{optimizedResult.improvements.compatibility}%</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <CRDButton className="bg-crd-green text-black">
                  <Download className="w-4 h-4 mr-2" />
                  Download Optimized Image
                </CRDButton>
                <CRDButton 
                  variant="outline" 
                  onClick={() => navigate('/create')}
                  className="border-crd-blue/30 text-crd-blue"
                >
                  Continue to Card Creator
                </CRDButton>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CRDButton
                variant="outline"
                onClick={() => navigate('/crdmkr')}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to CRDMKR
              </CRDButton>
              <div>
                <h1 className="text-2xl font-bold text-crd-white">Smart Upload Workflow</h1>
                <p className="text-crd-lightGray">AI-powered analysis and optimization</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-crd-blue/10 text-crd-blue border-crd-blue/30">
              Free
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              const isCurrent = getCurrentStepIndex() === index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-crd-blue/20 text-crd-blue' :
                    isCompleted ? 'bg-green-500/20 text-green-400' :
                    'text-crd-mediumGray'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium text-sm">{step.label}</p>
                      {isCurrent && (
                        <p className="text-xs opacity-70">{step.description}</p>
                      )}
                    </div>
                    {isCompleted && (
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-400' : 'bg-crd-mediumGray/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
