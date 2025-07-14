
import React from 'react';
import { CRDContainer, CRDSection } from '@/components/layout/CRDContainer';
import { Typography } from './Typography';
import { CRDButton } from './Button';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface Hero3Props {
  caption: string;
  heading: string | React.ReactNode;
  bodyText: string;
  ctaText: string;
  ctaLink: string;
  showFeaturedCards?: boolean;
  featuredCards?: DbCard[];
  onCardClick?: (card: DbCard) => void;
}

export const Hero3: React.FC<Hero3Props> = ({
  caption,
  heading,
  bodyText,
  ctaText,
  ctaLink,
  showFeaturedCards = false,
  featuredCards = [],
  onCardClick
}) => {
  return (
    <CRDSection spacing="large" className="relative overflow-hidden">
      <CRDContainer size="narrow" className="text-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Caption with proper gradient styling */}
          <Typography 
            variant="label" 
            className="crd-text-gradient uppercase tracking-wide font-semibold"
          >
            {caption}
          </Typography>
          
          {/* Main Heading - render content directly */}
          {typeof heading === 'string' ? (
            <Typography 
              as="h1" 
              variant="display"
              className="leading-tight drop-shadow-lg"
            >
              {heading}
            </Typography>
          ) : (
            heading
          )}
          
          {/* Body Text with proper styling */}
          <Typography 
            variant="large-body" 
            className="max-w-2xl mx-auto text-center text-crd-white/90"
          >
            {bodyText}
          </Typography>
          
          {/* CTA Button */}
          <Link to={ctaLink} className="inline-block">
            <CRDButton 
              variant="primary"
              size="lg"
              className="gap-3 mt-4"
            >
              {ctaText}
            </CRDButton>
          </Link>
        </div>
      </CRDContainer>

      {/* Featured Cards Section - temporarily removed until CardCarousel is available */}
      {showFeaturedCards && featuredCards.length > 0 && (
        <CRDSection spacing="default" className="mt-16">
          <CRDContainer size="content">
            <div className="text-center text-crd-lightGray">
              Featured cards section - CardCarousel component needed
            </div>
          </CRDContainer>
        </CRDSection>
      )}
    </CRDSection>
  );
};
