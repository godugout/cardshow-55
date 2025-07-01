
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Upload, Palette, Sparkles, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

// Import phase components
import { UploadPhase } from '@/components/studio/enhanced/phases/UploadPhase';
import { FramePhase } from '@/components/studio/enhanced/phases/FramePhase';
import { EffectsPhase } from '@/components/studio/enhanced/phases/EffectsPhase';
import { PreviewPhase } from '@/components/studio/enhanced/phases/PreviewPhase';
import { PublishPhase } from '@/components/studio/enhanced/phases/PublishPhase';

type Phase = 'upload' | 'frame' | 'effects' | 'preview' | 'publish';

interface PhaseConfig {
  id: Phase;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const phases: PhaseConfig[] = [
  {
    id: 'upload',
    title: 'Upload',
    description: 'Add your image or use PSD processing',
    icon: Upload,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'frame',
    title: 'Frame',
    description: 'Choose your card template',
    icon: Palette,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'effects',
    title: 'Effects',
    description: 'Apply visual enhancements',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'preview',
    title: 'Preview',
    description: 'Review your creation',
    icon: Eye,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'publish',
    title: 'Publish',
    description: 'Share your masterpiece',
    icon: Download,
    color: 'from-red-500 to-rose-500'
  }
];

export const EnhancedCardCreator = () => {
  const navigate = useNavigate();
  const cardEditor = useCardEditor();
  const [currentPhase, setCurrentPhase] = useState<Phase>('upload');
  const [completedPhases, setCompletedPhases] = useState<Set<Phase>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPhaseIndex = phases.findIndex(p => p.id === currentPhase);
  const progress = ((currentPhaseIndex + 1) / phases.length) * 100;

  const handlePhaseComplete = (phase: Phase) => {
    setCompletedPhases(prev => new Set([...prev, phase]));
    
    // Auto-advance to next phase
    const nextPhaseIndex = currentPhaseIndex + 1;
    if (nextPhaseIndex < phases.length) {
      setCurrentPhase(phases[nextPhaseIndex].id);
      toast.success(`${phases[currentPhaseIndex].title} completed!`);
    }
  };

  const handlePhaseChange = (phase: Phase) => {
    setCurrentPhase(phase);
  };

  const handleBack = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhase(phases[currentPhaseIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhase(phases[currentPhaseIndex + 1].id);
    }
  };

  const handlePublish = async () => {
    setIsProcessing(true);
    try {
      await cardEditor.saveCard();
      toast.success('Card published successfully!');
      navigate('/gallery');
    } catch (error) {
      console.error('Failed to publish card:', error);
      toast.error('Failed to publish card');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'upload':
        return (
          <UploadPhase
            cardEditor={cardEditor}
            onComplete={() => handlePhaseComplete('upload')}
          />
        );
      case 'frame':
        return (
          <FramePhase
            cardEditor={cardEditor}
            onComplete={() => handlePhaseComplete('frame')}
          />
        );
      case 'effects':
        return (
          <EffectsPhase
            cardEditor={cardEditor}
            onComplete={() => handlePhaseComplete('effects')}
          />
        );
      case 'preview':
        return (
          <PreviewPhase
            cardEditor={cardEditor}
            onComplete={() => handlePhaseComplete('preview')}
          />
        );
      case 'publish':
        return (
          <PublishPhase
            cardEditor={cardEditor}
            onPublish={handlePublish}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkGray">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CRDButton
                variant="outline"
                onClick={() => navigate('/')}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </CRDButton>
              <div>
                <h1 className="text-2xl font-bold text-crd-white">Enhanced Card Creator</h1>
                <p className="text-crd-lightGray">Professional 5-phase creation workflow</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-crd-green/10 text-crd-green border-crd-green/30">
              Enhanced Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            {phases.map((phase, index) => {
              const isActive = phase.id === currentPhase;
              const isCompleted = completedPhases.has(phase.id);
              const isAccessible = index <= currentPhaseIndex || isCompleted;
              const Icon = phase.icon;

              return (
                <div key={phase.id} className="flex items-center">
                  <button
                    onClick={() => isAccessible && handlePhaseChange(phase.id)}
                    disabled={!isAccessible}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${phase.color} text-white shadow-lg scale-105`
                        : isCompleted
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : isAccessible
                        ? 'bg-crd-mediumGray/20 text-crd-lightGray hover:bg-crd-mediumGray/30'
                        : 'bg-crd-mediumGray/10 text-crd-mediumGray/50 cursor-not-allowed'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {isCompleted && (
                        <Check className="w-3 h-3 absolute -top-1 -right-1 text-green-400" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{phase.title}</p>
                      {isActive && (
                        <p className="text-xs opacity-80">{phase.description}</p>
                      )}
                    </div>
                  </button>
                  {index < phases.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 transition-colors ${
                      completedPhases.has(phase.id) ? 'bg-green-400' : 'bg-crd-mediumGray/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-crd-lightGray">
                Phase {currentPhaseIndex + 1} of {phases.length}: {phases[currentPhaseIndex].title}
              </span>
              <span className="text-crd-green font-medium">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPhaseContent()}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-crd-darker border-t border-crd-mediumGray/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <CRDButton
            variant="outline"
            onClick={handleBack}
            disabled={currentPhaseIndex === 0}
            className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </CRDButton>

          <div className="text-center">
            <p className="text-crd-lightGray text-sm">
              {phases[currentPhaseIndex].description}
            </p>
          </div>

          {currentPhase === 'publish' ? (
            <CRDButton
              onClick={handlePublish}
              disabled={isProcessing}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              {isProcessing ? 'Publishing...' : 'Publish Card'}
              <Download className="w-4 h-4 ml-2" />
            </CRDButton>
          ) : (
            <CRDButton
              onClick={handleNext}
              disabled={currentPhaseIndex === phases.length - 1}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </CRDButton>
          )}
        </div>
      </div>
    </div>
  );
};
