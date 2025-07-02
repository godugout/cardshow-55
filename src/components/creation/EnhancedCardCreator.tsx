import React, { useState, useCallback } from 'react';
import { UploadPhase } from '@/components/studio/enhanced/phases/UploadPhase';
import { FramePhase } from '@/components/studio/enhanced/phases/FramePhase';
import { EffectsPhase } from '@/components/studio/enhanced/phases/EffectsPhase';
import { PreviewPhase } from '@/components/studio/enhanced/phases/PreviewPhase';
import { PublishPhase } from '@/components/studio/enhanced/phases/PublishPhase';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EnhancedCardCreatorProps {
  onComplete?: (cardData: any) => void;
  onCancel?: () => void;
}

type Phase = 'upload' | 'frame' | 'effects' | 'preview' | 'publish';

interface CardCreationState {
  uploadedImages: File[];
  selectedFrame: string | null;
  appliedEffects: Record<string, any>;
  cardData: any;
}

const phases: { key: Phase; title: string; description: string }[] = [
  { key: 'upload', title: 'Upload', description: 'Add your images' },
  { key: 'frame', title: 'Frame', description: 'Choose your style' },
  { key: 'effects', title: 'Effects', description: 'Apply enhancements' },
  { key: 'preview', title: 'Preview', description: 'Review your card' },
  { key: 'publish', title: 'Publish', description: 'Share your creation' },
];

export const EnhancedCardCreator: React.FC<EnhancedCardCreatorProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('upload');
  const [creationState, setCreationState] = useState<CardCreationState>({
    uploadedImages: [],
    selectedFrame: null,
    appliedEffects: {},
    cardData: null,
  });

  const currentPhaseIndex = phases.findIndex(p => p.key === currentPhase);
  const progress = ((currentPhaseIndex + 1) / phases.length) * 100;

  const handleNext = useCallback(() => {
    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < phases.length) {
      setCurrentPhase(phases[nextIndex].key);
    }
  }, [currentPhaseIndex]);

  const handlePrevious = useCallback(() => {
    const prevIndex = currentPhaseIndex - 1;
    if (prevIndex >= 0) {
      setCurrentPhase(phases[prevIndex].key);
    }
  }, [currentPhaseIndex]);

  const handlePhaseComplete = useCallback((phaseData: any) => {
    setCreationState(prev => ({
      ...prev,
      ...phaseData,
    }));
  }, []);

  const handleCardComplete = useCallback((finalCardData: any) => {
    onComplete?.(finalCardData);
  }, [onComplete]);

  const renderCurrentPhase = () => {
    switch (currentPhase) {
      case 'upload':
        return (
          <UploadPhase
            uploadedImages={creationState.uploadedImages}
            onImagesUploaded={(images) => handlePhaseComplete({ uploadedImages: images })}
            onNext={handleNext}
          />
        );
      case 'frame':
        return (
          <FramePhase
            selectedFrame={creationState.selectedFrame}
            uploadedImages={creationState.uploadedImages}
            onFrameSelected={(frame) => handlePhaseComplete({ selectedFrame: frame })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'effects':
        return (
          <EffectsPhase
            appliedEffects={creationState.appliedEffects}
            cardData={creationState}
            onEffectsApplied={(effects) => handlePhaseComplete({ appliedEffects: effects })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'preview':
        return (
          <PreviewPhase
            cardData={creationState}
            onDataUpdated={(data) => handlePhaseComplete({ cardData: data })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 'publish':
        return (
          <PublishPhase
            cardData={creationState}
            onPublish={handleCardComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <Card className="max-w-6xl mx-auto bg-crd-darker border-crd-border">
        {/* Header with Progress */}
        <div className="p-6 border-b border-crd-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Create Card</h1>
            {onCancel && (
              <Button variant="ghost" onClick={onCancel} className="text-gray-400">
                Cancel
              </Button>
            )}
          </div>
          
          {/* Phase Indicators */}
          <div className="flex items-center justify-between mb-4">
            {phases.map((phase, index) => (
              <div
                key={phase.key}
                className={`flex items-center ${index < phases.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index <= currentPhaseIndex
                      ? 'bg-crd-green text-black'
                      : 'bg-crd-darker border border-crd-border text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-2 min-w-0">
                  <div className="text-sm font-medium text-white">{phase.title}</div>
                  <div className="text-xs text-gray-400 truncate">{phase.description}</div>
                </div>
                {index < phases.length - 1 && (
                  <div className={`flex-1 mx-4 h-px ${
                    index < currentPhaseIndex ? 'bg-crd-green' : 'bg-crd-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />
        </div>

        {/* Phase Content */}
        <div className="p-6">
          {renderCurrentPhase()}
        </div>
      </Card>
    </div>
  );
};