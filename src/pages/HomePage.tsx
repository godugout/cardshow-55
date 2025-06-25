
import React from 'react';
import { EnhancedHero } from '@/components/home/EnhancedHero';
import { FeaturedCards } from '@/components/home/FeaturedCards';
import { DiscoverSection } from '@/components/home/DiscoverSection';
import { CreatorSection } from '@/components/home/CreatorSection';
import { Footer } from '@/components/home/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <EnhancedHero />
      <FeaturedCards />
      <DiscoverSection />
      <CreatorSection />
      <Footer />
    </div>
  );
};

export default HomePage;
