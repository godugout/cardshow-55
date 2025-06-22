
import React, { useState } from 'react';
import { Heart, ShoppingCart, MessageCircle, Eye } from 'lucide-react';

interface MarketplaceGridProps {
  searchQuery: string;
  filters: string[];
  sortBy: 'price' | 'rarity' | 'recent' | 'popular';
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  searchQuery,
  filters,
  sortBy
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const mockListings = [
    {
      id: '1',
      cardName: 'Lightning Dragon',
      image: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
      price: 45.99,
      condition: 'Mint',
      seller: 'CardMaster99',
      sellerRating: 4.8,
      watchers: 12,
      timeLeft: '2d 5h',
      isAuction: true,
      isVerified: true
    },
    {
      id: '2',
      cardName: 'Ice Phoenix',
      image: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
      price: 32.50,
      condition: 'Near Mint',
      seller: 'CollectorPro',
      sellerRating: 4.9,
      watchers: 8,
      isAuction: false,
      isVerified: true
    },
    {
      id: '3',
      cardName: 'Fire Sprite',
      image: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
      price: 18.75,
      condition: 'Good',
      seller: 'NewTrader',
      sellerRating: 4.2,
      watchers: 3,
      isAuction: false,
      isVerified: false
    }
  ];

  const toggleFavorite = (cardId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(cardId)) {
        newFavorites.delete(cardId);
      } else {
        newFavorites.add(cardId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Listings'}
        </h2>
        <span className="text-gray-400 text-sm">
          {mockListings.length} cards found
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-[#2d2d2d] rounded-lg overflow-hidden border border-gray-600 hover:border-[#00C851] transition-colors"
          >
            {/* Card Image */}
            <div className="relative aspect-[2.5/3.5] bg-[#3d3d3d]">
              <img
                src={listing.image}
                alt={listing.cardName}
                className="w-full h-full object-cover"
              />
              
              {/* Auction Badge */}
              {listing.isAuction && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                  Auction
                </div>
              )}
              
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(listing.id)}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <Heart className={`w-4 h-4 ${
                  favorites.has(listing.id) ? 'text-red-500 fill-red-500' : 'text-white'
                }`} />
              </button>
              
              {/* Watchers */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md">
                <Eye className="w-3 h-3 text-white" />
                <span className="text-white text-xs">{listing.watchers}</span>
              </div>
            </div>

            {/* Card Info */}
            <div className="p-3">
              <h3 className="text-white font-medium text-sm mb-1 truncate">
                {listing.cardName}
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#00C851] font-bold">
                  ${listing.price}
                </span>
                <span className="text-gray-400 text-xs">
                  {listing.condition}
                </span>
              </div>
              
              {/* Seller Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-gray-300 text-xs">{listing.seller}</span>
                  {listing.isVerified && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </div>
                  )}
                </div>
                <span className="text-yellow-400 text-xs">
                  ★ {listing.sellerRating}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-[#00C851] text-black py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#00C851]/90 transition-colors flex items-center justify-center gap-1">
                  <ShoppingCart className="w-3 h-3" />
                  Buy
                </button>
                <button className="bg-[#3d3d3d] text-white p-2 rounded-lg hover:bg-[#4d4d4d] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
              
              {/* Time Left for Auctions */}
              {listing.isAuction && listing.timeLeft && (
                <div className="mt-2 text-center">
                  <span className="text-orange-400 text-xs font-medium">
                    Ends in {listing.timeLeft}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <button className="bg-[#2d2d2d] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3d3d3d] transition-colors">
          Load More Cards
        </button>
      </div>
    </div>
  );
};
