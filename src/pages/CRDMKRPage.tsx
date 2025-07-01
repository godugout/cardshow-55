
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState } from '@/components/common/LoadingState';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowRight, Upload, Zap, Layers, Sparkles, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CRDMKRPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  console.log('CRDMKRPage: Loaded with dedicated workflow routing');

  if (loading) {
    return <LoadingState message="Loading CRDMKR..." fullPage />;
  }

  const handleStartWorkflow = (workflowType: string) => {
    if (!user) {
      console.log('User not authenticated, redirecting to auth');
      navigate('/auth');
      return;
    }

    console.log('Starting CRDMKR workflow:', workflowType);
    
    // Navigate to dedicated workflow routes
    navigate(`/crdmkr/${workflowType}`);
  };

  const workflows = [
    {
      id: 'psd-professional',
      title: 'PSD Professional Workflow',
      description: 'Extract layers from Photoshop files, create custom regions, and generate team-specific templates',
      icon: Layers,
      features: ['Layer extraction', 'Custom regions', 'Team variations', 'Export templates'],
      premium: true,
      recommended: true,
      route: '/crdmkr/psd-professional'
    },
    {
      id: 'smart-upload',
      title: 'Smart Media Upload',
      description: 'AI-powered analysis of any image format with intelligent workflow suggestions',
      icon: Eye,
      features: ['Format detection', 'Smart suggestions', 'Auto-optimization', 'Quick processing'],
      premium: false,
      recommended: false,
      route: '/crdmkr/smart-upload'
    },
    {
      id: 'batch-processing',
      title: 'Batch Processing',
      description: 'Process multiple files simultaneously with consistent styling and effects',
      icon: Zap,
      features: ['Multi-file upload', 'Consistent styling', 'Batch export', 'Progress tracking'],
      premium: true,
      recommended: false,
      route: '/crdmkr/batch-processing'
    }
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      <ErrorBoundary>
        {/* Header */}
        <div className="bg-crd-darker border-b border-crd-mediumGray/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-crd-green to-emerald-400 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <h1 className="text-4xl font-bold text-crd-white">CRDMKR</h1>
              </div>
              <p className="text-xl text-crd-lightGray max-w-2xl mx-auto">
                AI-powered template generation system that transforms your creative assets into customizable trading card templates
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Workflow Selection */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-crd-white mb-4">Choose Your Workflow</h2>
              <p className="text-crd-lightGray">Select the approach that best fits your creative goals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => {
                const Icon = workflow.icon;
                
                return (
                  <Card
                    key={workflow.id}
                    className="cursor-pointer transition-all hover:scale-105 bg-crd-darker border-crd-mediumGray/20 hover:border-crd-green/50"
                    onClick={() => handleStartWorkflow(workflow.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          workflow.recommended ? 'bg-crd-green/20' : 'bg-crd-mediumGray/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            workflow.recommended ? 'text-crd-green' : 'text-crd-lightGray'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-crd-white">{workflow.title}</h3>
                            {workflow.recommended && (
                              <Badge variant="outline" className="bg-crd-green/10 text-crd-green border-crd-green/30 text-xs">
                                Recommended
                              </Badge>
                            )}
                            {workflow.premium && (
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-crd-lightGray text-sm mb-4">{workflow.description}</p>
                          
                          <div>
                            <h4 className="text-crd-white font-medium text-sm mb-2">Features</h4>
                            <ul className="space-y-1">
                              {workflow.features.map((feature, index) => (
                                <li key={index} className="text-xs text-crd-lightGray flex items-center gap-1">
                                  <div className="w-1 h-1 bg-crd-green rounded-full" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-crd-mediumGray/20">
                        <CRDButton 
                          className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
                          size="sm"
                        >
                          Start Workflow
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </CRDButton>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Start Section */}
          <div className="bg-crd-darker rounded-lg p-6 border border-crd-mediumGray/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-crd-white mb-2">Quick Start</h3>
              <p className="text-crd-lightGray mb-4">
                New to CRDMKR? Start with a simple upload to see the magic happen
              </p>
              <CRDButton 
                onClick={() => handleStartWorkflow('smart-upload')}
                variant="outline"
                className="border-crd-green/30 text-crd-green hover:bg-crd-green/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload & Analyze
              </CRDButton>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default CRDMKRPage;
