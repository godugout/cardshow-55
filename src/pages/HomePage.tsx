
import React from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturedCards } from '@/components/home/FeaturedCards';
import { DiscoverSection } from '@/components/home/DiscoverSection';
import { CreatorSection } from '@/components/home/CreatorSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { CTASection } from '@/components/home/CTASection';
import { Footer } from '@/components/home/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <Hero />
      <FeaturedCards />
      <DiscoverSection />
      <CreatorSection />
      <CollectionsSection />
      <CTASection />
      <Footer />
    </div>
  );
};
