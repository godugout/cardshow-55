import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';
import { CRDContainer, CRDSection } from '@/components/layout/CRDContainer';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  className
}) => {
  return (
    <CRDSection spacing="large" className={cn("text-center", className)}>
      <CRDContainer size="narrow">
        <div className="flex flex-col items-center">
          {/* Small Label */}
          {subtitle && (
            <Typography 
              variant="label" 
              className="mb-2"
            >
              {subtitle}
            </Typography>
          )}
          
          {/* Main Heading - matches spec exactly */}
          <Typography 
            as="h1" 
            variant="display"
            className="text-[40px] font-black leading-[48px] tracking-[-0.4px] mt-2 text-center max-w-full"
          >
            {title}
          </Typography>
          
          {/* CTA Button */}
          <Link to={ctaLink} className="mt-6">
            <CRDButton 
              variant="primary"
              size="lg"
              className="self-stretch gap-3"
            >
              {ctaText}
            </CRDButton>
          </Link>
        </div>
      </CRDContainer>
    </CRDSection>
  );
};