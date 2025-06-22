
import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

export const TrendingCards: React.FC = () => {
  const trendingCards = [
    {
      id: '1',
      name: 'Lightning Dragon',
      image: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
      currentPrice: 45.99,
      priceChange: 12.5,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Ice Phoenix',
      image: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
      currentPrice: 32.50,
      priceChange: -5.2,
      trend: 'down'
    },
    {
      id: '3',
      name: 'Fire Sprite',
      image: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
      currentPrice: 18.75,
      priceChange: 8.3,
      trend: 'up'
    }
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-[#00C851]" />
        <h2 className="text-white text-lg font-semibold">Trending Now</h2>
      </div>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {trendingCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#2d2d2d] rounded-lg p-3 min-w-[160px] border border-gray-600 hover:border-[#00C851] transition-colors"
          >
            <div className="w-full aspect-[2.5/3.5] bg-[#3d3d3d] rounded-md mb-3 overflow-hidden">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-white font-medium text-sm mb-2 truncate">
              {card.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-[#00C851] font-bold text-sm">
                ${card.currentPrice}
              </span>
              <div className={`flex items-center gap-1 text-xs ${
                card.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {card.trend === 'up' ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(card.priceChange)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
