import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";

import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface Hero3Props {
  caption: string;
  heading: string;
  bodyText: string;
  ctaText: string;
  ctaLink: string;
  showFeaturedCards?: boolean;
  featuredCards?: DbCard[];
  variant?: 'default' | 'create' | 'gallery';
  className?: string;
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
  variant = 'default',
  className = '',
  onCardClick
}) => {
  const navigate = useNavigate();

  const handleCardClick = (card: DbCard) => {
    if (onCardClick) {
      onCardClick(card);
    } else {
      navigate(`/studio/${card.id}`);
    }
  };

  return (
    <div className={`items-center bg-crd-darkest flex w-full flex-col overflow-hidden text-center pt-20 md:pt-24 lg:pt-32 ${className}`}>
      <div className="flex w-full flex-col items-center">
        {/* Main Hero Content */}
        <div className="flex w-full flex-col items-center mb-12">
          <Typography 
            variant="caption" 
            className="text-xs font-semibold leading-none uppercase mb-2"
          >
            {caption}
          </Typography>
          <Typography 
            as="h1" 
            variant="h1"
            className="text-[32px] md:text-[36px] lg:text-[40px] font-black leading-[38px] md:leading-[44px] lg:leading-[48px] tracking-[-0.4px] mt-2 text-center mb-4 text-white"
          >
            <div className="whitespace-nowrap">Create, collect, and trade card art</div>
            <div>with stunning 3D effects</div>
          </Typography>
          <Typography 
            variant="body" 
            className="text-crd-lightGray text-lg mb-8 max-w-2xl"
          >
            {bodyText}
          </Typography>
        </div>

        {/* Featured Cards Ticker Carousel */}
        {showFeaturedCards && featuredCards.length > 0 && (
          <div className="w-screen mb-12 overflow-hidden">
            <Typography variant="h3" className="text-white mb-6 text-center">
              Featured Creations
            </Typography>
            <div className="relative">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-crd-darkest to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-crd-darkest to-transparent z-10 pointer-events-none" />
              
              {/* Ticker Container */}
              <div className="flex animate-[scroll_60s_linear_infinite] hover:[animation-play-state:paused]">
                {/* First set of cards */}
                {featuredCards.map((card) => (
                  <div 
                    key={`first-${card.id}`}
                    className="flex-shrink-0 w-48 mr-6 group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl overflow-hidden relative">
                      <img
                        src={card.image_url || card.thumbnail_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-sm font-semibold mb-1 truncate">{card.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {featuredCards.map((card) => (
                  <div 
                    key={`second-${card.id}`}
                    className="flex-shrink-0 w-48 mr-6 group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl overflow-hidden relative">
                      <img
                        src={card.image_url || card.thumbnail_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-sm font-semibold mb-1 truncate">{card.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <Link to={ctaLink}>
          <CRDButton 
            variant="primary"
            size="lg"
            className="self-stretch gap-3 text-lg font-extrabold px-8 py-4 rounded-[90px] max-md:px-5"
          >
            {ctaText}
          </CRDButton>
        </Link>
      </div>
    </div>
  );
};