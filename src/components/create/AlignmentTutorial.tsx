import React, { useState, useEffect } from 'react';
import { X, MousePointer2, Hand, Zap } from 'lucide-react';

interface AlignmentTutorialProps {
  isVisible: boolean;
  onClose: () => void;
}

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  animation: string;
  duration: number;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Zoom In",
    description: "Scroll to zoom the card to 160% or larger",
    icon: <MousePointer2 className="w-6 h-6" />,
    animation: "zoom-gesture",
    duration: 3000
  },
  {
    id: 2,
    title: "Tilt Forward",
    description: "Drag to tilt the card forward at least 45°",
    icon: <Hand className="w-6 h-6" />,
    animation: "tilt-gesture",
    duration: 3000
  },
  {
    id: 3,
    title: "Drag Up",
    description: "Perform an upward drag gesture to trigger alignment",
    icon: <Zap className="w-6 h-6" />,
    animation: "drag-up-gesture",
    duration: 2000
  }
];

export const AlignmentTutorial: React.FC<AlignmentTutorialProps> = ({
  isVisible,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isPlaying || !isVisible) return;

    const timer = setTimeout(() => {
      if (currentStep < tutorialSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
        // Auto-restart after a pause
        setTimeout(() => {
          setCurrentStep(0);
          setIsPlaying(true);
        }, 1000);
      }
    }, tutorialSteps[currentStep]?.duration || 3000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, isVisible]);

  if (!isVisible) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-60 bg-crd-dark/90 hover:bg-crd-dark text-white p-2 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Tutorial Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Animated Card Representation */}
        <div className="relative">
          {/* Card Mock */}
          <div className={`
            relative w-64 h-96 bg-gradient-to-br from-crd-purple via-crd-accent to-crd-primary 
            rounded-2xl shadow-2xl transition-transform duration-1000 
            ${currentStep === 0 ? 'animate-zoom-in scale-110' : ''}
            ${currentStep === 1 ? 'animate-tilt-forward transform rotate-x-45' : ''}
            ${currentStep === 2 ? 'animate-drag-up-prep' : ''}
          `}>
            <div className="absolute inset-4 bg-black/20 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🌟</div>
                <div className="text-sm font-medium">Sample Card</div>
              </div>
            </div>
          </div>

          {/* Animated Cursor/Hand */}
          <div className={`
            absolute transition-all duration-1000 pointer-events-none
            ${currentStep === 0 ? 'animate-scroll-zoom top-1/2 right-[-60px]' : ''}
            ${currentStep === 1 ? 'animate-drag-tilt top-1/4 left-1/2 transform -translate-x-1/2' : ''}
            ${currentStep === 2 ? 'animate-drag-up-gesture bottom-10 left-1/2 transform -translate-x-1/2' : ''}
          `}>
            {currentStep === 0 && (
              <div className="bg-white rounded-full p-3 shadow-lg animate-pulse">
                <MousePointer2 className="w-6 h-6 text-crd-dark" />
              </div>
            )}
            {(currentStep === 1 || currentStep === 2) && (
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Hand className="w-6 h-6 text-crd-dark" />
              </div>
            )}
          </div>

          {/* Drag Up Arrow for Step 3 */}
          {currentStep === 2 && (
            <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 animate-drag-up-arrow">
              <div className="text-white text-3xl">↑</div>
            </div>
          )}

          {/* Zoom Indicators for Step 1 */}
          {currentStep === 0 && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium animate-fade-in">
              160%+ Zoom
            </div>
          )}

          {/* Angle Indicator for Step 2 */}
          {currentStep === 1 && (
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium animate-fade-in">
              45°+ Tilt
            </div>
          )}
        </div>

        {/* Instructions Panel */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-crd-dark/95 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-crd-lightGray/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-crd-accent/20 p-2 rounded-lg">
              {currentTutorialStep?.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Step {currentStep + 1}: {currentTutorialStep?.title}
              </h3>
              <p className="text-crd-lightGray text-sm">
                {currentTutorialStep?.description}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-crd-accent animate-pulse'
                    : index < currentStep
                    ? 'bg-crd-primary'
                    : 'bg-crd-lightGray/30'
                }`}
              />
            ))}
          </div>

          {/* Skip Button */}
          <button
            onClick={onClose}
            className="w-full mt-4 bg-crd-accent/20 hover:bg-crd-accent/30 text-crd-accent border border-crd-accent/30 py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Got it, let me try!
          </button>
        </div>
      </div>
    </div>
  );
};