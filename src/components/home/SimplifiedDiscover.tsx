
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import type { CardData } from '@/hooks/useCardEditor';

const featuredCards = [
  {
    id: 'featured-1',
    title: 'Golden Warrior',
    price: '2.5 ETH',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
    rarity: 'Legendary',
    category: 'Sports'
  },
  {
    id: 'featured-2',
    title: 'Cyber Knight',
    price: '1.8 ETH',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80',
    rarity: 'Ultra Rare',
    category: 'Gaming'
  },
  {
    id: 'featured-3',
    title: 'Mystic Dragon',
    price: '3.2 ETH',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    rarity: 'Legendary',
    category: 'Fantasy'
  },
  {
    id: 'featured-4',
    title: 'Storm Elemental',
    price: '2.1 ETH',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    rarity: 'Rare',
    category: 'Magic'
  }
];

const DiscoverCard = ({ card }: { card: any }) => {
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
      description: `Premium ${card.rarity} card from the ${card.category} collection`,
      rarity: card.rarity.toLowerCase().replace(' ', '_') as any,
      tags: [card.category, 'Trading Card', card.rarity],
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
        className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
        onClick={handleCardClick}
      >
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Rarity Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800 border-0">
              {card.rarity}
            </Badge>
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white border-0">
              {card.price}
            </Badge>
          </div>
          
          {/* Card Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-white font-bold text-xl mb-1">{card.title}</h3>
            <p className="text-white/80 text-sm">{card.category} Collection</p>
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

export const SimplifiedDiscover = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 text-blue-700 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Featured Collection</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Cards
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of premium trading cards with stunning visual effects and collectible value.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredCards.map((card) => (
            <DiscoverCard key={card.id} card={card} />
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Effects</h3>
            <p className="text-gray-600">Create cards with holographic, chrome, and prismatic effects that bring your designs to life.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Collectible Value</h3>
            <p className="text-gray-600">Each card is unique and verifiable, with rarity levels that determine their collectible worth.</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">3D Experience</h3>
            <p className="text-gray-600">View and interact with cards in immersive 3D environments with realistic lighting.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Link to="/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
