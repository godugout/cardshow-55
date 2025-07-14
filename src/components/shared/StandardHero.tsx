
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

  const heroClasses = fullWidth 
    ? `relative mb-6 overflow-hidden w-screen -mx-[50vw] left-1/2 ${className}`
    : `relative mb-6 overflow-hidden ${className}`;

  return (
    <div className={heroClasses}>
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
      <div className="relative z-10 text-center pt-8 md:pt-10 lg:pt-12 pb-2">
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-6'}`}>
          {/* Label */}
          {label && (
            <Typography variant="label" className="mb-2 gradient-text-green-blue-purple font-bold tracking-wider">
              {label}
            </Typography>
          )}
          
          {/* Main Heading - Use configurable variant */}
          <Typography 
            as="h1" 
            variant={heroVariant}
            className="mb-2 leading-tight text-crd-white drop-shadow-lg"
          >
            {title}
          </Typography>
          
          {/* Description */}
          <Typography 
            variant="large-body" 
            className="mb-4 text-crd-lightGray max-w-2xl mx-auto leading-relaxed"
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
