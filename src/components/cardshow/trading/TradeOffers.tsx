
import React, { useState } from 'react';
import { Clock, Star, CheckCircle, X } from 'lucide-react';

interface TradeOffer {
  id: string;
  fromUser: string;
  fromAvatar: string;
  offeredCards: Array<{ id: string; name: string; image: string; value: number }>;
  requestedCards: Array<{ id: string; name: string; image: string; value: number }>;
  message: string;
  createdAt: Date;
  expiresAt: Date;
  isInbound: boolean;
}

export const TradeOffers: React.FC = () => {
  const [offers, setOffers] = useState<TradeOffer[]>([
    {
      id: '1',
      fromUser: 'TradeKing23',
      fromAvatar: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
      offeredCards: [
        { id: '1', name: 'Lightning Dragon', image: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png', value: 45.99 }
      ],
      requestedCards: [
        { id: '2', name: 'Ice Phoenix', image: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png', value: 42.50 }
      ],
      message: 'Great collection! Would love to trade for your Ice Phoenix.',
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      expiresAt: new Date(Date.now() + 86400000 * 6), // 6 days from now
      isInbound: true
    }
  ]);

  const acceptOffer = (offerId: string) => {
    console.log('Accepting offer:', offerId);
    // Implement accept logic
  };

  const declineOffer = (offerId: string) => {
    console.log('Declining offer:', offerId);
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
  };

  const getTimeLeft = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Expires soon';
  };

  return (
    <div className="p-4 pb-20">
      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={offer.fromAvatar}
                alt={offer.fromUser}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{offer.fromUser}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeLeft(offer.expiresAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">4.8</span>
              </div>
            </div>

            {/* Message */}
            {offer.message && (
              <div className="bg-[#3d3d3d] rounded-lg p-3 mb-4">
                <p className="text-gray-300 text-sm">{offer.message}</p>
              </div>
            )}

            {/* Trade Details */}
            <div className="space-y-3 mb-4">
              <div>
                <h4 className="text-white text-sm font-medium mb-2">
                  {offer.isInbound ? 'They offer:' : 'You offer:'}
                </h4>
                <div className="flex gap-2 overflow-x-auto">
                  {offer.offeredCards.map((card) => (
                    <div key={card.id} className="bg-[#3d3d3d] rounded-lg p-2 min-w-[80px]">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full aspect-[2.5/3.5] object-cover rounded mb-1"
                      />
                      <p className="text-white text-xs text-center truncate">{card.name}</p>
                      <p className="text-[#00C851] text-xs text-center font-bold">${card.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white text-sm font-medium mb-2">
                  {offer.isInbound ? 'For your:' : 'For their:'}
                </h4>
                <div className="flex gap-2 overflow-x-auto">
                  {offer.requestedCards.map((card) => (
                    <div key={card.id} className="bg-[#3d3d3d] rounded-lg p-2 min-w-[80px]">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full aspect-[2.5/3.5] object-cover rounded mb-1"
                      />
                      <p className="text-white text-xs text-center truncate">{card.name}</p>
                      <p className="text-[#00C851] text-xs text-center font-bold">${card.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {offer.isInbound && (
              <div className="flex gap-3">
                <button
                  onClick={() => acceptOffer(offer.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => declineOffer(offer.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">No offers yet</h3>
          <p className="text-gray-400">Trade offers will appear here when you receive them.</p>
        </div>
      )}
    </div>
  );
};
