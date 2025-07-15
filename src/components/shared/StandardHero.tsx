
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Typography, CRDButton } from '@/components/ui/design-system';
import { ThemedPage } from '@/components/ui/design-system/ThemedLayout';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface CTAConfig {
  text: string;
  link: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

interface StandardHeroProps {
  label?: string;
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
        </>
      )}
      
      {/* Hero Content */}
      <div className="relative z-10 text-center pt-16 md:pt-20 lg:pt-24 pb-4">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Label */}
          {label && (
            <Typography variant="label" className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider">
              {label}
            </Typography>
          )}
          
          {/* Main Heading - Use configurable variant with consistent font size */}
          {titleEffects ? (
            titleEffects
          ) : (
            <Typography 
              as="h1" 
              variant={heroVariant}
              className="mb-4 leading-tight text-crd-white drop-shadow-lg text-5xl md:text-6xl lg:text-7xl"
            >
              {title}
            </Typography>
          )}

          {/* Tagline - styled consistently */}
          {tagline && (
            <div className="mt-6 mb-8">
              <p className="text-lg md:text-xl italic text-center font-medium gradient-text-green-blue-purple animate-fade-in">
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
                className={`liquid-gradient-cta min-w-[200px] ${primaryCta.className || ''}`}
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
