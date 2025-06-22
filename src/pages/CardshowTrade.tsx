
import React from 'react';
import { ArrowLeftRight, Clock, Check, X } from 'lucide-react';

export const CardshowTrade: React.FC = () => {
  const mockTrades = [
    {
      id: '1',
      partner: 'Alex_Cards',
      avatar: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
      offering: ['Lightning Dragon'],
      requesting: ['Ice Phoenix'],
      status: 'pending'
    },
    {
      id: '2',
      partner: 'CardMaster99',
      avatar: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
      offering: ['Crystal Mage', 'Fire Sprite'],
      requesting: ['Shadow Warrior'],
      status: 'accepted'
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6">Trades</h1>
        
        <div className="space-y-4">
          {mockTrades.map((trade) => (
            <div key={trade.id} className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={trade.avatar}
                  alt={trade.partner}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{trade.partner}</h3>
                  <div className="flex items-center gap-2">
                    {trade.status === 'pending' && (
                      <>
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">Pending</span>
                      </>
                    )}
                    {trade.status === 'accepted' && (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Accepted</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex-1">
                  <p className="text-gray-400 mb-1">Offering:</p>
                  <p className="text-white">{trade.offering.join(', ')}</p>
                </div>
                <ArrowLeftRight className="w-5 h-5 text-[#00C851]" />
                <div className="flex-1">
                  <p className="text-gray-400 mb-1">Requesting:</p>
                  <p className="text-white">{trade.requesting.join(', ')}</p>
                </div>
              </div>

              {trade.status === 'pending' && (
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Accept
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
