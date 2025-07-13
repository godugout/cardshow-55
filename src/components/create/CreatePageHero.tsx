
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, CRDButton } from '@/components/ui/design-system';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

export const CreatePageHero: React.FC = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <div className="relative mb-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop&crop=center&auto=format"
          alt="Creative workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-crd-darkest/50 via-crd-darkest/30 to-crd-darkest/70"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center py-20">
        <div className={`max-w-4xl mx-auto ${isMobile ? 'px-5' : 'px-12'}`}>
          {/* Caption */}
          <Typography variant="label" className="mb-4 text-crd-orange">
            UNLEASH YOUR CREATIVITY
          </Typography>
          
          {/* Main Heading */}
          <Typography 
            as="h1" 
            variant="display"
            className="mb-6 leading-tight"
          >
            Every masterpiece starts with a single vision
          </Typography>
          
          {/* Body Text */}
          <Typography 
            variant="large-body" 
            className="mb-8 text-crd-lightGray max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're crafting timeless collectibles or pioneering interactive art experiences, 
            your creativity deserves tools as limitless as your imagination.
          </Typography>
          
          {/* CTA Button */}
          <Link to="/create/crd">
            <CRDButton 
              variant="primary" 
              className="bg-crd-blue hover:bg-crd-blue/80 text-white px-8 py-4 text-lg font-bold"
            >
              Start Creating
            </CRDButton>
          </Link>
        </div>
      </div>
    </div>
  );
};
