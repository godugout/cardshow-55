import React, { useState, useEffect } from 'react';
import { MonolithTransformation } from './MonolithTransformation';
import { SunBehindMonolith } from './SunBehindMonolith';
import { DescendingMoon } from './DescendingMoon';
import { AlignmentBeam } from './AlignmentBeam';

interface MonolithAlignmentProps {
  onAlignmentComplete?: () => void;
}

type AnimationPhase = 'transformation' | 'sun-rise' | 'moon-descent' | 'alignment' | 'climax';

export const MonolithAlignment: React.FC<MonolithAlignmentProps> = ({
  onAlignmentComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('transformation');
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animation sequence timing - Starts immediately when component mounts
  useEffect(() => {
    console.log('🌌 Kubrick alignment sequence initiated by sophisticated viewing detection!');
    
    const sequences = [
      { phase: 'transformation', duration: 1000 },
      { phase: 'sun-rise', duration: 1500 },
      { phase: 'moon-descent', duration: 2000 },
      { phase: 'alignment', duration: 1000 },
      { phase: 'climax', duration: 2000 }
    ];

    let currentDelay = 0;
    sequences.forEach((seq, index) => {
      setTimeout(() => {
        setAnimationPhase(seq.phase as AnimationPhase);
        setAnimationProgress((index + 1) / sequences.length);
      }, currentDelay);
      currentDelay += seq.duration;
    });

    // Auto-complete after full sequence
    const completeTimer = setTimeout(() => {
      onAlignmentComplete?.();
    }, currentDelay);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onAlignmentComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Sophisticated Viewing-Based Trigger Success Message */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-crd-blue/90 backdrop-blur-sm border border-crd-blue/30 rounded-lg px-6 py-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              Perfect alignment achieved. Initiating Kubrick sequence...
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-lg">
          <div className="text-white text-xs">
            <div>Phase: {animationPhase}</div>
            <div className="w-24 h-1 bg-white/20 rounded-full mt-1">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric dimming */}
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Monolith Transformation */}
      <MonolithTransformation 
        phase={animationPhase}
        progress={animationProgress}
      />

      {/* Sun behind monolith */}
      {(animationPhase === 'sun-rise' || animationPhase === 'moon-descent' || animationPhase === 'alignment' || animationPhase === 'climax') && (
        <SunBehindMonolith 
          phase={animationPhase}
          progress={animationProgress}
        />
      )}

      {/* Descending moon */}
      {(animationPhase === 'moon-descent' || animationPhase === 'alignment' || animationPhase === 'climax') && (
        <DescendingMoon 
          phase={animationPhase}
          progress={animationProgress}
        />
      )}

      {/* Alignment beam effect */}
      {(animationPhase === 'alignment' || animationPhase === 'climax') && (
        <AlignmentBeam 
          phase={animationPhase}
          progress={animationProgress}
        />
      )}

      {/* Animation progress indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
        <div className="text-center">
          <div className="text-sm mb-1">{animationPhase.toUpperCase().replace('-', ' ')}</div>
          <div className="w-32 bg-white/20 h-1 rounded">
            <div 
              className="bg-white h-1 rounded transition-all duration-300" 
              style={{ width: `${animationProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};