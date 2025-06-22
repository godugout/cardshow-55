
import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface Trade {
  id: string;
  partner: string;
  partnerAvatar: string;
  status: 'pending' | 'negotiating' | 'accepted' | 'completed' | 'cancelled';
  yourCards: Array<{ id: string; name: string; image: string; value: number }>;
  theirCards: Array<{ id: string; name: string; image: string; value: number }>;
  lastMessage: string;
  lastActivity: Date;
  unreadCount: number;
}

export const LiveTradingInterface: React.FC = () => {
  const [activeTrades, setActiveTrades] = useState<Trade[]>([
    {
      id: '1',
      partner: 'CardMaster99',
      partnerAvatar: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
      status: 'negotiating',
      yourCards: [
        { id: '1', name: 'Lightning Dragon', image: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png', value: 45.99 }
      ],
      theirCards: [
        { id: '2', name: 'Ice Phoenix', image: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png', value: 42.50 }
      ],
      lastMessage: 'Would you consider adding $5 to balance the trade?',
      lastActivity: new Date(Date.now() - 300000), // 5 minutes ago
      unreadCount: 2
    }
  ]);

  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [message, setMessage] = useState('');

  const getStatusColor = (status: Trade['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'negotiating': return 'text-blue-400';
      case 'accepted': return 'text-green-400';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Trade['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'negotiating': return <MessageCircle className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedTrade) return;
    
    // Simulate sending message
    setMessage('');
    console.log('Sending message:', message);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      {!selectedTrade ? (
        // Trade List View
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Active Trades</h1>
          
          <div className="space-y-4">
            {activeTrades.map((trade) => (
              <div
                key={trade.id}
                onClick={() => setSelectedTrade(trade)}
                className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600 hover:border-[#00C851] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
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
                  {trade.unreadCount > 0 && (
                    <div className="bg-[#00C851] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {trade.unreadCount}
                    </div>
                  )}
                </div>

                {/* Trade Preview */}
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex -space-x-2">
                    {trade.yourCards.slice(0, 3).map((card, index) => (
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
                    {trade.theirCards.slice(0, 3).map((card, index) => (
                      <img
                        key={index}
                        src={card.image}
                        alt={card.name}
                        className="w-8 h-8 rounded border-2 border-[#2d2d2d] object-cover"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                  {trade.lastMessage}
                </p>

                <div className="text-gray-500 text-xs">
                  {new Date(trade.lastActivity).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Trade Detail View
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="bg-[#2d2d2d] border-b border-gray-600 p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTrade(null)}
                className="text-gray-400 hover:text-white"
              >
                ←
              </button>
              <img
                src={selectedTrade.partnerAvatar}
                alt={selectedTrade.partner}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-white font-semibold">{selectedTrade.partner}</h2>
                <div className={`flex items-center gap-1 text-sm ${getStatusColor(selectedTrade.status)}`}>
                  {getStatusIcon(selectedTrade.status)}
                  <span className="capitalize">{selectedTrade.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Content */}
          <div className="flex-1 p-4 space-y-4">
            {/* Your Cards */}
            <div>
              <h3 className="text-white font-medium mb-2">Your Cards</h3>
              <div className="flex gap-2 overflow-x-auto">
                {selectedTrade.yourCards.map((card) => (
                  <div key={card.id} className="bg-[#2d2d2d] rounded-lg p-2 min-w-[100px]">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full aspect-[2.5/3.5] object-cover rounded mb-2"
                    />
                    <p className="text-white text-xs text-center truncate">{card.name}</p>
                    <p className="text-[#00C851] text-xs text-center font-bold">${card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Their Cards */}
            <div>
              <h3 className="text-white font-medium mb-2">Their Cards</h3>
              <div className="flex gap-2 overflow-x-auto">
                {selectedTrade.theirCards.map((card) => (
                  <div key={card.id} className="bg-[#2d2d2d] rounded-lg p-2 min-w-[100px]">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full aspect-[2.5/3.5] object-cover rounded mb-2"
                    />
                    <p className="text-white text-xs text-center truncate">{card.name}</p>
                    <p className="text-[#00C851] text-xs text-center font-bold">${card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Accept Trade
              </button>
              <button className="flex-1 bg-[#2d2d2d] text-white py-3 rounded-lg font-medium hover:bg-[#3d3d3d] transition-colors">
                Counter Offer
              </button>
              <button className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Decline
              </button>
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-[#2d2d2d] border-t border-gray-600 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-[#3d3d3d] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00C851]"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-[#00C851] text-black px-4 py-3 rounded-lg hover:bg-[#00C851]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
