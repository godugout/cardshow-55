
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, CRDButton } from '@/components/ui/design-system';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export const CreatePageHero: React.FC = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className="relative mb-16 overflow-hidden">
      {/* Modern Vibrant Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-themed-hero opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-crd-darkest/20 to-crd-darkest/80"></div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 liquid-gradient-blue-purple opacity-30"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center py-20">
        <div className={`max-w-4xl mx-auto ${isMobile ? 'px-5' : 'px-12'}`}>
          {/* Caption with gradient text */}
          <Typography variant="label" className="mb-4 gradient-text-blue-purple font-bold tracking-wider">
            UNLEASH YOUR CREATIVITY
          </Typography>
          
          {/* Main Heading with enhanced styling */}
          <Typography 
            as="h1" 
            variant="display"
            className="mb-6 leading-tight text-crd-white drop-shadow-lg"
          >
            Every masterpiece starts with a <span className="gradient-text-blue-purple">single vision</span>
          </Typography>
          
          {/* Body Text */}
          <Typography 
            variant="large-body" 
            className="mb-8 text-crd-lightGray max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're crafting timeless collectibles or pioneering interactive art experiences, 
            your creativity deserves tools as limitless as your imagination.
          </Typography>
          
          {/* CTA Button with new gradient */}
          <Link to="/create/crd">
            <CRDButton 
              variant="primary" 
              className="btn-themed-primary hover:scale-105 transition-transform duration-300 text-lg px-10 py-4 shadow-2xl"
            >
              Start Creating
            </CRDButton>
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-crd-blue/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-crd-purple/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
  );
};
