
import React, { useState } from 'react';
import { Search, Filter, Star, TrendingUp, Bell, Calendar, Target, BarChart3 } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  criteria: {
    minPrice?: number;
    maxPrice?: number;
    rarity?: string[];
    category?: string[];
    condition?: string[];
  };
  alertsEnabled: boolean;
  lastResults: number;
}

interface TradingInsight {
  type: 'opportunity' | 'warning' | 'trend';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
}

export const AdvancedTradingTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'alerts' | 'insights'>('search');
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    rarity: [] as string[],
    category: [] as string[],
    condition: [] as string[]
  });
  
  // Mock data
  const savedSearches: SavedSearch[] = [
    {
      id: '1',
      name: 'Vintage Pokemon Under $100',
      criteria: { maxPrice: 100, category: ['Pokemon'], condition: ['Near Mint'] },
      alertsEnabled: true,
      lastResults: 23
    },
    {
      id: '2',
      name: 'Rare Sports Cards',
      criteria: { rarity: ['Rare', 'Ultra Rare'], category: ['Sports'] },
      alertsEnabled: false,
      lastResults: 7
    }
  ];
  
  const tradingInsights: TradingInsight[] = [
    {
      type: 'opportunity',
      title: 'Lightning Dragon Trending Up',
      description: 'Price increased 15% in last 7 days. High trading volume detected.',
      confidence: 87,
      timeframe: '7 days'
    },
    {
      type: 'warning',
      title: 'Market Volatility Alert',
      description: 'Sports card market showing increased volatility. Consider holding positions.',
      confidence: 72,
      timeframe: '24 hours'
    },
    {
      type: 'trend',
      title: 'Holographic Cards Gaining Popularity',
      description: 'Search volume for holographic effects up 34% this month.',
      confidence: 91,
      timeframe: '30 days'
    }
  ];
  
  const handleRarityToggle = (rarity: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      rarity: prev.rarity.includes(rarity)
        ? prev.rarity.filter(r => r !== rarity)
        : [...prev.rarity, rarity]
    }));
  };
  
  const handleCategoryToggle = (category: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };
  
  return (
    <div className="p-4 bg-[#1a1a1a] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Advanced Trading Tools</h1>
        <p className="text-gray-400">Professional tools for serious traders</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex bg-[#2d2d2d] rounded-lg p-1 mb-6">
        {[
          { id: 'search', label: 'Advanced Search', icon: Search },
          { id: 'alerts', label: 'Price Alerts', icon: Bell },
          { id: 'insights', label: 'Trading Insights', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#00C851] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Advanced Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Builder */}
          <div className="bg-[#2d2d2d] rounded-lg p-6 border border-gray-600">
            <h2 className="text-white text-lg font-semibold mb-4">Build Custom Search</h2>
            
            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Card Name</label>
                <input
                  type="text"
                  value={searchCriteria.name}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#3d3d3d] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00C851]"
                  placeholder="Search by name..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Min Price</label>
                  <input
                    type="number"
                    value={searchCriteria.minPrice}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="w-full bg-[#3d3d3d] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00C851]"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Max Price</label>
                  <input
                    type="number"
                    value={searchCriteria.maxPrice}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full bg-[#3d3d3d] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00C851]"
                    placeholder="Any"
                  />
                </div>
              </div>
            </div>
            
            {/* Rarity Filter */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Rarity</label>
              <div className="flex flex-wrap gap-2">
                {['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary'].map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => handleRarityToggle(rarity)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      searchCriteria.rarity.includes(rarity)
                        ? 'bg-[#00C851] text-black'
                        : 'bg-[#3d3d3d] text-gray-300 hover:text-white'
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {['Sports', 'Gaming', 'Fantasy', 'Vintage', 'Pokemon', 'Yu-Gi-Oh'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      searchCriteria.category.includes(category)
                        ? 'bg-[#00C851] text-black'
                        : 'bg-[#3d3d3d] text-gray-300 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-[#00C851] text-black py-3 rounded-lg font-semibold hover:bg-[#00a844] transition-colors">
                Search Cards
              </button>
              <button className="px-6 py-3 bg-[#3d3d3d] text-white rounded-lg font-semibold hover:bg-[#4d4d4d] transition-colors">
                Save Search
              </button>
            </div>
          </div>
          
          {/* Saved Searches */}
          <div className="bg-[#2d2d2d] rounded-lg p-6 border border-gray-600">
            <h2 className="text-white text-lg font-semibold mb-4">Saved Searches</h2>
            <div className="space-y-3">
              {savedSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between p-3 bg-[#3d3d3d] rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{search.name}</h3>
                    <p className="text-gray-400 text-sm">{search.lastResults} results • Last run 2 hours ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        search.alertsEnabled
                          ? 'bg-[#00C851] text-black'
                          : 'bg-[#4d4d4d] text-gray-400'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-[#00C851] text-black rounded-lg font-medium hover:bg-[#00a844] transition-colors">
                      Run
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Trading Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-[#2d2d2d] rounded-lg p-6 border border-gray-600">
            <h2 className="text-white text-lg font-semibold mb-4">Market Insights</h2>
            <div className="space-y-4">
              {tradingInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-[#3d3d3d] rounded-lg border-l-4 border-l-[#00C851]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        insight.type === 'opportunity' ? 'bg-green-400' :
                        insight.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`} />
                      <h3 className="text-white font-medium">{insight.title}</h3>
                    </div>
                    <span className="text-gray-400 text-sm">{insight.timeframe}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Confidence:</span>
                      <div className="w-16 bg-[#4d4d4d] rounded-full h-2">
                        <div 
                          className="bg-[#00C851] h-2 rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-white text-xs">{insight.confidence}%</span>
                    </div>
                    <button className="text-[#00C851] text-sm hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
