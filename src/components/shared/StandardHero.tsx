
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
  children?: React.ReactNode; // For additional content like carousels
}

export const StandardHero: React.FC<StandardHeroProps> = ({
  label,
  title,
  description,
  primaryCta,
  secondaryCta,
  showDecorations = false,
  className = '',
  children
}) => {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className={`relative mb-16 overflow-hidden ${className}`}>
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
      <div className="relative z-10 text-center pt-20 md:pt-24 lg:pt-32 pb-8">
        <div className={`max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
          {/* Label */}
          {label && (
            <Typography variant="label" className="mb-4 gradient-text-green-blue-purple font-bold tracking-wider">
              {label}
            </Typography>
          )}
          
          {/* Main Heading - Let Typography component handle all sizing */}
          <Typography 
            as="h1" 
            variant="display"
            className="mb-6 leading-tight text-crd-white drop-shadow-lg"
          >
            {title}
          </Typography>
          
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
                className={`liquid-gradient-blue-purple min-w-[200px] ${primaryCta.className || ''}`}
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
