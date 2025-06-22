
import React from 'react';
import { CheckCircle, X, Clock } from 'lucide-react';

interface HistoricalTrade {
  id: string;
  partner: string;
  partnerAvatar: string;
  status: 'completed' | 'cancelled' | 'expired';
  yourCards: Array<{ name: string; image: string; value: number }>;
  theirCards: Array<{ name: string; image: string; value: number }>;
  completedAt: Date;
  feedback?: {
    rating: number;
    comment: string;
  };
}

export const TradingHistory: React.FC = () => {
  const history: HistoricalTrade[] = [
    {
      id: '1',
      partner: 'CardCollector88',
      partnerAvatar: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
      status: 'completed',
      yourCards: [
        { name: 'Lightning Dragon', image: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png', value: 45.99 }
      ],
      theirCards: [
        { name: 'Ice Phoenix', image: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png', value: 42.50 }
      ],
      completedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
      feedback: {
        rating: 5,
        comment: 'Great trader, cards arrived in perfect condition!'
      }
    }
  ];

  const getStatusIcon = (status: HistoricalTrade['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled': return <X className="w-5 h-5 text-red-400" />;
      case 'expired': return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: HistoricalTrade['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      case 'expired': return 'text-gray-400';
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="space-y-4">
        {history.map((trade) => (
          <div
            key={trade.id}
            className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={trade.partnerAvatar}
                alt={trade.partner}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{trade.partner}</h3>
                <div className={`flex items-center gap-2 ${getStatusColor(trade.status)}`}>
                  {getStatusIcon(trade.status)}
                  <span className="text-sm capitalize">{trade.status}</span>
                </div>
              </div>
              <div className="text-gray-400 text-sm text-right">
                {trade.completedAt.toLocaleDateString()}
              </div>
            </div>

            {/* Trade Summary */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {trade.yourCards.map((card, index) => (
                  <img
                    key={index}
                    src={card.image}
                    alt={card.name}
                    className="w-8 h-8 rounded border-2 border-[#2d2d2d] object-cover"
                  />
                ))}
              </div>
              <span className="text-gray-400">↔</span>
              <div className="flex -space-x-2">
                {trade.theirCards.map((card, index) => (
                  <img
                    key={index}
                    src={card.image}
                    alt={card.name}
                    className="w-8 h-8 rounded border-2 border-[#2d2d2d] object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Feedback */}
            {trade.feedback && (
              <div className="bg-[#3d3d3d] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < trade.feedback!.rating ? 'text-yellow-400' : 'text-gray-600'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">Their feedback</span>
                </div>
                <p className="text-gray-300 text-sm">{trade.feedback.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">No trading history</h3>
          <p className="text-gray-400">Your completed trades will appear here.</p>
        </div>
      )}
    </div>
  );
};
