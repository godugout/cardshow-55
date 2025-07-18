import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CarouselTrack } from './CarouselTrack';
import { Typography } from '@/components/ui/design-system/Typography';
import { EnhancedTestimonialCarousel } from '@/components/ui/EnhancedTestimonialCarousel';
import { mockTestimonials } from '@/data/testimonials';

const fetchFeaturedCards = async () => {
  const { data, error } = await supabase
    .from('cards')
    .select('id, title, image_url, thumbnail_url, rarity, creator_id')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
};

export const HeroCarousel: React.FC = () => {
  const { data: cards, isLoading, error } = useQuery({
    queryKey: ['featured-cards'],
    queryFn: fetchFeaturedCards,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <Typography variant="body" className="text-crd-mediumGray">
            Loading featured cards...
          </Typography>
        </div>
      </div>
    );
  }

  if (error || !cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="py-8 space-y-12">
      {/* Featured Cards Section */}
      <div>
        <div className="text-center mb-6">
          <Typography variant="h3" className="text-crd-white mb-2">
            Featured Cards
          </Typography>
          <Typography variant="body" className="text-crd-mediumGray">
            Discover amazing cards from our community
          </Typography>
        </div>
        
        <CarouselTrack cards={cards} />
      </div>

      {/* Enhanced Testimonials Section */}
      <div>
        <div className="text-center mb-8">
          <Typography variant="h3" className="text-crd-white mb-2">
            What Creators Are Saying
          </Typography>
          <Typography variant="body" className="text-crd-mediumGray">
            Industry leaders share their CRD experience
          </Typography>
        </div>
        
        <EnhancedTestimonialCarousel 
          testimonials={mockTestimonials}
          autoPlay={true}
          autoPlayInterval={4000}
          showNavigation={true}
          showDots={true}
          className="mx-auto max-w-6xl"
        />
      </div>
    </div>
  );
};