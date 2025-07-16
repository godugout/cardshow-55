import React, { useState, useEffect } from 'react';
import { Typography } from '@/components/ui/design-system/Typography';
import { CRDButton } from '@/components/ui/design-system/Button';
import { InteractiveElement } from '@/components/global/InteractiveElement';
import { Play, RotateCcw } from 'lucide-react';

interface AnimationDemoProps {
  title: string;
  description: string;
}

export const CascadingLetterDemo: React.FC<AnimationDemoProps> = ({ title, description }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const demoText = "Create Amazing Cards";

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2500);
  };

  return (
    <div className="p-6 bg-crd-darker rounded-lg border border-crd-border">
      <div className="mb-4">
        <Typography variant="h3" className="text-crd-white mb-2">
          {title}
        </Typography>
        <Typography variant="caption" className="text-crd-lightGray">
          {description}
        </Typography>
      </div>
      
      <div className="h-24 flex items-center justify-center mb-4 bg-crd-darkest rounded-lg">
        <div className="flex">
          {demoText.split('').map((char, index) => (
            <span
              key={index}
              className={`text-2xl font-black text-crd-white ${
                isAnimating 
                  ? 'letter-animate'
                  : 'opacity-100 transform-none'
              }`}
              style={{
                animationDelay: isAnimating ? `${index * 0.1}s` : '0s'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </div>
      
      <CRDButton 
        variant="secondary" 
        size="sm" 
        onClick={triggerAnimation}
        disabled={isAnimating}
        className="w-full"
      >
        <Play className="w-4 h-4 mr-2" />
        {isAnimating ? 'Playing...' : 'Play Animation'}
      </CRDButton>
    </div>
  );
};

export const PrismaticShimmerDemo: React.FC<AnimationDemoProps> = ({ title, description }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const demoText = "Design Your Vision";

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2500);
  };

  return (
    <div className="p-6 bg-crd-darker rounded-lg border border-crd-border">
      <div className="mb-4">
        <Typography variant="h3" className="text-crd-white mb-2">
          {title}
        </Typography>
        <Typography variant="caption" className="text-crd-lightGray">
          {description}
        </Typography>
      </div>
      
      <div className="h-24 flex items-center justify-center mb-4 bg-crd-darkest rounded-lg overflow-hidden">
        <div 
          className={`relative text-2xl font-black transition-all duration-2000 ${
            isAnimating 
              ? 'text-transparent bg-gradient-to-r from-crd-white via-crd-green to-crd-white bg-clip-text animate-[shimmerSweep_2s_ease-out]'
              : 'text-crd-white'
          }`}
        >
          {demoText}
          {isAnimating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmerOverlay_2s_ease-out]" />
          )}
        </div>
      </div>
      
      <CRDButton 
        variant="secondary" 
        size="sm" 
        onClick={triggerAnimation}
        disabled={isAnimating}
        className="w-full"
      >
        <Play className="w-4 h-4 mr-2" />
        {isAnimating ? 'Playing...' : 'Play Animation'}
      </CRDButton>
    </div>
  );
};