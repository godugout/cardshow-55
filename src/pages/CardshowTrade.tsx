
import React, { useState } from 'react';
import { LiveTradingInterface } from '@/components/cardshow/trading/LiveTradingInterface';
import { TradingHistory } from '@/components/cardshow/trading/TradingHistory';
import { TradeOffers } from '@/components/cardshow/trading/TradeOffers';

type TradeTab = 'active' | 'offers' | 'history';

export const CardshowTrade: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TradeTab>('active');

  const tabs = [
    { id: 'active', label: 'Active Trades', count: 3 },
    { id: 'offers', label: 'Offers', count: 5 },
    { id: 'history', label: 'History', count: null }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Tab Navigation */}
      <div className="bg-[#2d2d2d] border-b border-gray-600 p-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TradeTab)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'bg-[#00C851] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id 
                    ? 'bg-black/20 text-black' 
                    : 'bg-[#00C851] text-black'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && <LiveTradingInterface />}
      {activeTab === 'offers' && <TradeOffers />}
      {activeTab === 'history' && <TradingHistory />}
    </div>
  );
};
