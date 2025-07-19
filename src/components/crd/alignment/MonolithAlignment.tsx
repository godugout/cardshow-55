import React, { useState, useEffect } from 'react';
import { MonolithTransformation } from './MonolithTransformation';
import { SunBehindMonolith } from './SunBehindMonolith';
import { DescendingMoon } from './DescendingMoon';
import { AlignmentBeam } from './AlignmentBeam';

interface MonolithAlignmentProps {
  onAlignmentComplete?: () => void;
}

export const MonolithAlignment: React.FC<MonolithAlignmentProps> = ({
  onAlignmentComplete
}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'transformation' | 'sun-rise' | 'moon-descent' | 'alignment' | 'climax'>('idle');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showTriggerHint, setShowTriggerHint] = useState(true);

  // Hide hint after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTriggerHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Simple trigger - double click anywhere on the screen
  useEffect(() => {
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;

    const handleDoubleClick = () => {
      if (isTriggered) return;
      
      console.log('🌌 Double-click detected! Starting Kubrick alignment sequence...');
      setIsTriggered(true);
      setAnimationPhase('transformation');
      setShowTriggerHint(false);
    };

    const handleClick = () => {
      clickCount++;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 300);
      } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        handleDoubleClick();
      }
    };

    // Add to window for global capture
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      if (clickTimer) clearTimeout(clickTimer);
    };
  }, [isTriggered]);

  // Animation sequence timing
  useEffect(() => {
    if (!isTriggered) return;

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
        setAnimationPhase(seq.phase as any);
        setAnimationProgress((index + 1) / sequences.length);
      }, currentDelay);
      currentDelay += seq.duration;
    });

    // Complete and reset
    setTimeout(() => {
      onAlignmentComplete?.();
      setTimeout(() => {
        setIsTriggered(false);
        setAnimationPhase('idle');
        setAnimationProgress(0);
        setShowTriggerHint(true);
      }, 2000);
    }, currentDelay);

  }, [isTriggered, onAlignmentComplete]);

  if (!isTriggered && animationPhase === 'idle') {
    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Simple trigger hint */}
        {showTriggerHint && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-6 py-3 rounded-lg animate-fade-in">
            <div className="text-center">
              <div className="text-lg mb-1">✨ 2001: A Space Odyssey ✨</div>
              <div className="text-sm opacity-80">Double-click anywhere to trigger alignment</div>
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
          opacity: isTriggered ? 0.4 : 0 
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

      {/* Animation progress indicator */}
      {isTriggered && (
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
      )}
    </div>
  );
};