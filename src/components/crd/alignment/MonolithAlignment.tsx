import React, { useState, useEffect, useCallback } from 'react';
import { MonolithTransformation } from './MonolithTransformation';
import { SunBehindMonolith } from './SunBehindMonolith';
import { DescendingMoon } from './DescendingMoon';
import { AlignmentBeam } from './AlignmentBeam';

interface MonolithAlignmentProps {
  cardAngle: number;
  cameraDistance: number;
  isOptimalPosition: boolean;
  onAlignmentComplete?: () => void;
}

export const MonolithAlignment: React.FC<MonolithAlignmentProps> = ({
  cardAngle,
  cameraDistance,
  isOptimalPosition,
  onAlignmentComplete
}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'transformation' | 'sun-rise' | 'moon-descent' | 'alignment' | 'climax'>('idle');
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Check alignment conditions - 400% zoom + 45° tilt + centered position
  const isZoomedEnough = cameraDistance <= 2;
  const isTiltedForward = cardAngle >= 45;
  const canTrigger = isZoomedEnough && isTiltedForward && isOptimalPosition && !isTriggered;

  // Hold timer for deliberate trigger (2 seconds)
  useEffect(() => {
    if (canTrigger) {
      const timer = setTimeout(() => {
        console.log('🌌 Monolith alignment triggered! Beginning transformation...');
        setIsTriggered(true);
        setAnimationPhase('transformation');
      }, 2000);
      setHoldTimer(timer);
    } else {
      if (holdTimer) {
        clearTimeout(holdTimer);
        setHoldTimer(null);
      }
    }

    return () => {
      if (holdTimer) clearTimeout(holdTimer);
    };
  }, [canTrigger, holdTimer, isTriggered]);

  // Animation sequence timing
  useEffect(() => {
    if (!isTriggered) return;

    const sequences = [
      { phase: 'transformation', duration: 1000 },
      { phase: 'sun-rise', duration: 1500 },
      { phase: 'moon-descent', duration: 2000 },
      { phase: 'alignment', duration: 1000 },
      { phase: 'climax', duration: 1000 }
    ];

    let currentDelay = 0;
    sequences.forEach((seq, index) => {
      setTimeout(() => {
        setAnimationPhase(seq.phase as any);
        setAnimationProgress((index + 1) / sequences.length);
      }, currentDelay);
      currentDelay += seq.duration;
    });

    // Complete and reset
    setTimeout(() => {
      onAlignmentComplete?.();
      setIsTriggered(false);
      setAnimationPhase('idle');
      setAnimationProgress(0);
    }, currentDelay + 2000);

  }, [isTriggered, onAlignmentComplete]);

  // Reset on position change
  useEffect(() => {
    if (!canTrigger && isTriggered) {
      setIsTriggered(false);
      setAnimationPhase('idle');
      setAnimationProgress(0);
    }
  }, [canTrigger, isTriggered]);

  if (!isTriggered && animationPhase === 'idle') {
    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Alignment hint when approaching trigger */}
        {canTrigger && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
            <div className="text-sm">Hold position for alignment...</div>
            <div className="w-full bg-white/20 h-1 rounded mt-1">
              <div className="bg-white h-1 rounded animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Atmospheric dimming */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-1000"
        style={{ 
          opacity: isTriggered ? 0.3 : 0 
        }}
      />

      {/* Monolith transformation overlay */}
      {(animationPhase === 'transformation' || animationPhase === 'sun-rise' || animationPhase === 'moon-descent' || animationPhase === 'alignment' || animationPhase === 'climax') && (
        <MonolithTransformation 
          phase={animationPhase}
          progress={animationProgress}
        />
      )}

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

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded text-xs font-mono">
          <div>Phase: {animationPhase}</div>
          <div>Progress: {Math.round(animationProgress * 100)}%</div>
          <div>Zoom 400%+: {isZoomedEnough ? '✓' : '✗'}</div>
          <div>Tilt 45°+: {isTiltedForward ? '✓' : '✗'}</div>
          <div>Position: {isOptimalPosition ? '✓' : '✗'}</div>
        </div>
      )}
    </div>
  );
};