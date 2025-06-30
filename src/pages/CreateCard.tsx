
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useCardEditor } from '@/hooks/useCardEditor';
import { PhotoUploadSection } from '@/components/editor/unified/sections/PhotoUploadSection';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft, Sparkles, Grid, Layers, FileImage } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CardData } from '@/hooks/useCardEditor';

const CreateCard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cardEditor = useCardEditor();
  const [workflowInfo, setWorkflowInfo] = useState<{
    source: string | null;
    workflow: string | null;
    activated: boolean;
  }>({ source: null, workflow: null, activated: false });

  // Handle URL parameters for workflow activation with enhanced feedback
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow) {
      console.log('🎯 Auto-activating workflow from URL parameters:', { source, workflow });
      
      setWorkflowInfo({ source, workflow, activated: true });
      
      // Set workflow metadata
      cardEditor.updateDesignMetadata('workflowSource', 'crdmkr');
      cardEditor.updateDesignMetadata('workflowType', workflow);
    }
  }, [searchParams, cardEditor]);

  console.log('CreateCard page loaded - enhanced workflow ready', workflowInfo);

  const getWorkflowConfig = (workflow: string | null) => {
    switch (workflow) {
      case 'psd-professional':
        return {
          title: 'PSD Professional Workflow',
          description: 'Advanced PSD layer extraction and template generation',
          icon: Layers,
          color: 'from-purple-500 to-blue-500',
          badge: 'PRO'
        };
      case 'batch-processing':
        return {
          title: 'Batch Processing Workflow',
          description: 'Efficient creation of multiple cards from uploaded media',
          icon: Grid,
          color: 'from-green-500 to-blue-500',
          badge: 'BATCH'
        };
      case 'smart-upload':
        return {
          title: 'Smart Upload Workflow',
          description: 'AI-powered image analysis and automatic template selection',
          icon: Sparkles,
          color: 'from-yellow-500 to-green-500',
          badge: 'AI'
        };
      case 'crd-frame-generator':
        return {
          title: 'CRD Frame Generator',
          description: 'Create custom reusable frames from your designs',
          icon: FileImage,
          color: 'from-blue-500 to-purple-500',
          badge: 'FRAME'
        };
      default:
        return null;
    }
  };

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/gallery');
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  const handleNext = () => {
    console.log('Moving to next step - effects and finalization');
    // Navigate to next step or continue workflow
  };

  const workflowConfig = getWorkflowConfig(workflowInfo.workflow);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkGray">
      <ErrorBoundary>
        {/* Enhanced Header with Workflow Badge */}
        <div className="bg-gradient-to-r from-crd-darker via-crd-darkGray to-crd-darker border-b border-crd-green/20 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-crd-green to-crd-blue bg-clip-text text-transparent">
                Professional Card Creator
              </h1>
              <div className="hidden md:block h-8 w-px bg-crd-mediumGray/30"></div>
              
              {/* Workflow Status Badge */}
              {workflowInfo.activated && workflowConfig && (
                <div className="hidden md:flex items-center gap-3">
                  <div className={`bg-gradient-to-r ${workflowConfig.color} p-2 rounded-lg`}>
                    <workflowConfig.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{workflowConfig.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {workflowConfig.badge}
                      </Badge>
                    </div>
                    <p className="text-crd-lightGray text-sm">{workflowConfig.description}</p>
                  </div>
                </div>
              )}
              
              {/* Default status when no workflow */}
              {!workflowInfo.activated && (
                <div className="hidden md:flex items-center gap-2 text-crd-lightGray">
                  <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Standard Creation Mode</span>
                </div>
              )}
            </div>

            <CRDButton
              variant="outline"
              onClick={handleCancel}
              className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white hover:border-crd-green/50 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </CRDButton>
          </div>
        </div>

        {/* Workflow Activation Confirmation */}
        {workflowInfo.activated && workflowConfig && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className={`bg-gradient-to-r ${workflowConfig.color} bg-opacity-10 border border-current border-opacity-20 rounded-xl p-4`}>
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-r ${workflowConfig.color} p-3 rounded-xl`}>
                  <workflowConfig.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {workflowConfig.title} Activated
                  </h3>
                  <p className="text-crd-lightGray">
                    {workflowConfig.description} - Ready to begin workflow
                  </p>
                </div>
                <Badge className="ml-auto" variant="outline">
                  {workflowConfig.badge}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PhotoUploadSection
            cardEditor={cardEditor}
            onNext={handleNext}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default CreateCard;
