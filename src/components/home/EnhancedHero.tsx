
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import type { CardData } from '@/hooks/useCardEditor';

// Mock card data for the hero section
const mockHeroCards = [
  {
    id: 'hero-1',
    title: 'LeBron James',
    price: '2.5 ETH',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80',
    rarity: 'Legendary'
  },
  {
    id: 'hero-2', 
    title: 'Steph Curry',
    price: '1.8 ETH',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80',
    rarity: 'Ultra Rare'
  },
  {
    id: 'hero-3',
    title: 'Tom Brady',
    price: '3.2 ETH', 
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&q=80',
    rarity: 'Legendary'
  }
];

const HeroCard = ({ card, index }: { card: any; index: number }) => {
  const [showViewer, setShowViewer] = useState(false);
  
  const handleCardClick = () => {
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  // Convert to CardData format for the viewer
  const convertToCardData = (): CardData => {
    return {
      id: card.id,
      title: card.title,
      description: `Premium ${card.rarity} trading card featuring ${card.title}`,
      rarity: card.rarity.toLowerCase().replace(' ', '_') as any,
      tags: ['Sports', 'Trading Card', card.rarity],
      image_url: card.image,
      thumbnail_url: card.image,
      design_metadata: {},
      visibility: 'public',
      is_public: true,
      creator_attribution: {
        creator_name: 'CRD Studio',
        creator_id: 'crd-studio',
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: true,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: {
          currency: 'ETH'
        },
        distribution: {
          limited_edition: true
        }
      },
      creator_id: 'crd-studio'
    };
  };

  return (
    <>
      <div 
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
          index === 1 ? 'transform scale-110 z-10' : 'opacity-80 hover:opacity-100'
        }`}
        onClick={handleCardClick}
      >
        <div className="aspect-[3/4] bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 p-1">
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Card Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {card.rarity}
                </Badge>
                <span className="text-white font-bold text-lg">{card.price}</span>
              </div>
              <h3 className="text-white font-bold text-xl">{card.title}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Immersive Card Viewer */}
      {showViewer && (
        <ImmersiveCardViewer
          card={convertToCardData()}
          isOpen={showViewer}
          onClose={handleCloseViewer}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </>
  );
};

export const EnhancedHero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Premium Digital Collectibles</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Create Epic
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent block">
                  Trading Cards
                </span>
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                Design, mint, and trade stunning 3D trading cards with advanced visual effects. 
                Turn your favorite moments into collectible masterpieces.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                <Link to="/editor">
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/gallery">
                  Explore Gallery
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/60">Cards Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">2.5K+</div>
                <div className="text-white/60">Active Creators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-white/60">Collections</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - 3D Cards Display */}
          <div className="relative">
            <div className="flex items-center justify-center space-x-4 perspective-1000">
              {mockHeroCards.map((card, index) => (
                <HeroCard key={card.id} card={card} index={index} />
              ))}
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
