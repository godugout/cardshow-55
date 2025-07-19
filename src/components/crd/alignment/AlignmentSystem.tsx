import React, { useState, useEffect, useCallback } from 'react';
import { AlignmentMoon } from './AlignmentMoon';

interface AlignmentSystemProps {
  animationProgress: number;
  isPlaying: boolean;
  cardAngle: number;
  cameraDistance: number;
  isOptimalZoom: boolean;
  isOptimalPosition: boolean;
  onTriggerReached?: () => void;
  onCardControlUpdate?: (params: { positionY: number; lean: number; controlTaken: boolean }) => void;
}

export const AlignmentSystem: React.FC<AlignmentSystemProps> = React.memo(({
  animationProgress,
  isPlaying,
  cardAngle,
  cameraDistance,
  isOptimalZoom,
  isOptimalPosition,
  onTriggerReached,
  onCardControlUpdate
}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  
  // Check if card is zoomed 160% or larger (distance of 5 or less for 160%+ zoom)  
  const isZoomedEnough = cameraDistance <= 5;
  
  // Check if card is tilted forward at least 45 degrees
  const isTiltedForward = cardAngle >= 45;
  
  // Trigger alignment when ALL conditions are met: zoom + tilt + position
  const canTrigger = isZoomedEnough && isTiltedForward && isOptimalPosition && !hasTriggered;
  
  // Trigger callback
  const triggerCallback = useCallback(() => {
    if (canTrigger && onTriggerReached) {
      console.log('🌙 Alignment triggered! Moon should appear now');
      setHasTriggered(true);
      onTriggerReached();
    }
  }, [canTrigger, onTriggerReached]);
  
  useEffect(() => {
    triggerCallback();
  }, [triggerCallback]);
  
  // Handle alignment animation
  useEffect(() => {
    if (hasTriggered && !isAligned) {
      // Tilt card to 45 degrees and lock it
      if (onCardControlUpdate) {
        onCardControlUpdate({
          positionY: 0,
          lean: 45, // 45 degree tilt
          controlTaken: true // Lock the card in position
        });
      }
      setIsAligned(true);
    }
  }, [hasTriggered, isAligned, onCardControlUpdate]);
  
  // Reset when animation resets
  useEffect(() => {
    if (animationProgress === 0 && !isPlaying) {
      setHasTriggered(false);
      setIsAligned(false);
      if (onCardControlUpdate) {
        onCardControlUpdate({
          positionY: 0,
          lean: 0,
          controlTaken: false
        });
      }
    }
  }, [animationProgress, isPlaying, onCardControlUpdate]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Alignment Moon - Shows when alignment is triggered */}
      {hasTriggered && (
        <AlignmentMoon
          progress={animationProgress}
          isVisible={true} // Always visible once triggered
          isAnimationComplete={animationProgress >= 1 && !isPlaying}
        />
      )}
      
      {/* Alignment Status Indicator (optional debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-sm">
          <div>Zoom 160%+: {isZoomedEnough ? '✓' : '✗'} ({Math.round((1 - Math.min(cameraDistance / 20, 1)) * 100)}%)</div>
          <div>Tilt 45°+: {isTiltedForward ? '✓' : '✗'} ({Math.round(cardAngle)}°)</div>
          <div>Position: {isOptimalPosition ? '✓' : '✗'}</div>
          <div>Aligned: {isAligned ? '✓' : '✗'}</div>
          <div>Progress: {Math.round(animationProgress * 100)}%</div>
        </div>
      )}
    </div>
  );
});

AlignmentSystem.displayName = 'AlignmentSystem';