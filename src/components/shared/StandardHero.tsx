
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Typography, CRDButton } from '@/components/ui/design-system';
import { ThemedPage } from '@/components/ui/design-system/ThemedLayout';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface CTAConfig {
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'create' | 'collective';
  className?: string;
}

interface StandardHeroProps {
  label?: string;
  labelRef?: React.RefObject<HTMLElement>;
  title: React.ReactNode;
  tagline?: string;
  titleEffects?: React.ReactNode;
  description: string;
  primaryCta: CTAConfig;
  secondaryCta?: CTAConfig;
  showDecorations?: boolean;
  className?: string;
  children?: React.ReactNode;
  heroVariant?: 'hero' | 'display';
  fullWidth?: boolean;
}

export const StandardHero: React.FC<StandardHeroProps> = ({
  label,
  labelRef,
  title,
  tagline,
  titleEffects,
  description,
  primaryCta,
  secondaryCta,
  showDecorations = false,
  className = '',
  children,
  heroVariant = 'display',
  fullWidth = false
}) => {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className={`relative ${fullWidth ? 'w-screen -mx-[50vw] left-1/2' : 'mb-12'} overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-crd-darkest"></div>
      
      {/* Decorative elements - only show if requested */}
      {showDecorations && (
        <>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-crd-green/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-crd-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Sparkly Stars */}
          <div className="absolute top-20 left-10 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_6px_#fbbf24,0_0_12px_#fbbf24] animate-pulse"></div>
          <div className="absolute top-32 right-20 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#ffffff,0_0_16px_#ffffff] animate-pulse delay-500"></div>
          <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_10px_#fde047,0_0_20px_#fde047] animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 right-10 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#ffffff,0_0_12px_#ffffff] animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/5 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_12px_#fbbf24,0_0_24px_#fbbf24] animate-pulse delay-700"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_8px_#fefce8,0_0_16px_#fefce8] animate-pulse delay-200"></div>
          <div className="absolute bottom-60 left-20 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#ffffff,0_0_20px_#ffffff] animate-pulse delay-900"></div>
          <div className="absolute top-40 right-1/3 w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_8px_#fde047,0_0_16px_#fde047] animate-pulse delay-1200"></div>
        </>
      )}
      
      {/* Hero Content */}
      <div className="relative z-10 text-center pb-4 pt-[calc(var(--navbar-height)+100px)]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Label */}
          {label && (
            <Typography 
              ref={labelRef}
              variant="label" 
              className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider"
            >
              {label}
            </Typography>
          )}
          
          {/* Main Heading - Consistent spacing regardless of titleEffects vs title */}
          <div className="mb-4">
            {titleEffects ? (
              titleEffects
            ) : (
              <Typography 
                as="h1" 
                variant={heroVariant}
                className="leading-tight text-crd-white drop-shadow-lg text-5xl md:text-6xl lg:text-7xl"
              >
                {title}
              </Typography>
            )}
          </div>

          {/* Tagline - styled consistently */}
          {tagline && (
            <div className="mt-6 mb-8">
              <p className="text-lg md:text-xl italic text-center font-fredoka text-crd-orange animate-fade-in">
                "{tagline}"
              </p>
            </div>
          )}
          
          {/* Description */}
          <Typography 
            variant="large-body" 
            className="mb-8 text-crd-lightGray max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </Typography>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={primaryCta.link}>
              <CRDButton 
                size="lg" 
                variant={primaryCta.variant || 'primary'}
                className={`min-w-[200px] ${primaryCta.className || ''}`}
              >
                {primaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </CRDButton>
            </Link>
            {secondaryCta && (
              <Link to={secondaryCta.link}>
                <CRDButton 
                  variant={secondaryCta.variant || 'outline'} 
                  size="lg" 
                  className={`min-w-[200px] ${secondaryCta.className || ''}`}
                >
                  {secondaryCta.text}
                </CRDButton>
              </Link>
            )}
          </div>
        </div>
        
        {/* Additional content like carousels */}
        {children}
      </div>
    </div>
  );
};
