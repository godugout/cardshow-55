
import React, { useState } from 'react';
import { TrendingUp, PieChart, BarChart3, Calendar, DollarSign, Star, Target, Activity } from 'lucide-react';

interface AnalyticsData {
  totalValue: number;
  totalCards: number;
  rareCards: number;
  monthlyGrowth: number;
  rarityDistribution: Array<{ rarity: string; count: number; percentage: number }>;
  valueHistory: Array<{ date: string; value: number }>;
  topCards: Array<{ name: string; value: number; change: number }>;
  investmentMetrics: {
    totalInvested: number;
    currentValue: number;
    roi: number;
    bestPerformer: string;
  };
}

export const CollectionAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  
  // Mock data - replace with real data
  const analyticsData: AnalyticsData = {
    totalValue: 12450.00,
    totalCards: 234,
    rareCards: 45,
    monthlyGrowth: 15.7,
    rarityDistribution: [
      { rarity: 'Common', count: 120, percentage: 51.3 },
      { rarity: 'Uncommon', count: 69, percentage: 29.5 },
      { rarity: 'Rare', count: 32, percentage: 13.7 },
      { rarity: 'Ultra Rare', count: 10, percentage: 4.3 },
      { rarity: 'Legendary', count: 3, percentage: 1.3 }
    ],
    valueHistory: [
      { date: '2024-01', value: 8500 },
      { date: '2024-02', value: 9200 },
      { date: '2024-03', value: 10100 },
      { date: '2024-04', value: 11300 },
      { date: '2024-05', value: 12450 }
    ],
    topCards: [
      { name: 'Lightning Dragon', value: 1250, change: 12.5 },
      { name: 'Ice Phoenix', value: 890, change: -5.2 },
      { name: 'Fire Sprite', value: 670, change: 8.3 }
    ],
    investmentMetrics: {
      totalInvested: 9800,
      currentValue: 12450,
      roi: 27.04,
      bestPerformer: 'Lightning Dragon'
    }
  };
  
  return (
    <div className="p-4 space-y-6 bg-[#1a1a1a] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Collection Analytics</h1>
        <div className="flex gap-1 bg-[#2d2d2d] rounded-lg p-1">
          {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-[#00C851] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00C851] bg-opacity-20 rounded-lg">
              <DollarSign className="w-5 h-5 text-[#00C851]" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-white text-xl font-bold">${analyticsData.totalValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-3 h-3" />
            +{analyticsData.monthlyGrowth}% this month
          </div>
        </div>
        
        <div className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Cards</p>
              <p className="text-white text-xl font-bold">{analyticsData.totalCards}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">{analyticsData.rareCards} rare or above</p>
        </div>
        
        <div className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 bg-opacity-20 rounded-lg">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">ROI</p>
              <p className="text-white text-xl font-bold">+{analyticsData.investmentMetrics.roi}%</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">Best: {analyticsData.investmentMetrics.bestPerformer}</p>
        </div>
        
        <div className="bg-[#2d2d2d] rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 bg-opacity-20 rounded-lg">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Activity</p>
              <p className="text-white text-xl font-bold">12</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">trades this month</p>
        </div>
      </div>
      
      {/* Value Chart */}
      <div className="bg-[#2d2d2d] rounded-lg p-6 border border-gray-600">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#00C851]" />
          <h2 className="text-white text-lg font-semibold">Portfolio Value Over Time</h2>
        </div>
        <div className="h-64 flex items-end gap-2">
          {analyticsData.valueHistory.map((point, index) => (
            <div key={point.date} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-[#00C851] rounded-t"
                style={{ 
                  height: `${(point.value / Math.max(...analyticsData.valueHistory.map(p => p.value))) * 200}px` 
                }}
              />
              <p className="text-gray-400 text-xs mt-2">{point.date.split('-')[1]}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Rarity Distribution */}
      <div className="bg-[#2d2d2d] rounded-lg p-6 border border-gray-600">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-[#00C851]" />
          <h2 className="text-white text-lg font-semibold">Rarity Distribution</h2>
        </div>
        <div className="space-y-3">
          {analyticsData.rarityDistribution.map((item, index) => (
            <div key={item.rarity} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded ${
                index === 0 ? 'bg-gray-500' :
                index === 1 ? 'bg-green-500' :
                index === 2 ? 'bg-blue-500' :
                index === 3 ? 'bg-purple-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white text-sm">{item.rarity}</span>
                  <span className="text-gray-400 text-sm">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-[#3d3d3d] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-gray-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-blue-500' :
                      index === 3 ? 'bg-purple-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Performing Cards */}
      <div className="bg-[#2d2d2d] rounded-lg p-6 border border-gray-600">
        <h2 className="text-white text-lg font-semibold mb-4">Top Performing Cards</h2>
        <div className="space-y-3">
          {analyticsData.topCards.map((card, index) => (
            <div key={card.name} className="flex items-center justify-between p-3 bg-[#3d3d3d] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00C851] bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-[#00C851] font-bold text-sm">#{index + 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{card.name}</p>
                  <p className="text-gray-400 text-sm">${card.value}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 ${
                card.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`w-3 h-3 ${card.change < 0 ? 'rotate-180' : ''}`} />
                <span className="text-sm">{Math.abs(card.change)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
