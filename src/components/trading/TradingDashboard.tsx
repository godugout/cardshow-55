
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Gavel, 
  ArrowLeftRight, 
  Users, 
  Clock,
  Search,
  Filter,
  Plus,
  Bell
} from 'lucide-react';
import { useRealTimeTrading } from '@/hooks/useRealTimeTrading';
import { LiveAuctionCard } from './LiveAuctionCard';
import { TradeOfferCard } from './TradeOfferCard';
import { formatCurrency } from '@/services/stripe';
import type { LiveAuction, TradeOffer } from '@/types/trading';

export const TradingDashboard: React.FC = () => {
  const { activeTrades, activeAuctions, userPresence, connectionStatus } = useRealTimeTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('auctions');
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    timeLeft: 'all', // 'ending_soon', '1h', '6h', '24h', 'all'
    category: 'all'
  });

  // Mock data for demonstration
  const [mockAuctions] = useState<LiveAuction[]>([
    {
      id: '1',
      sellerId: 'seller1',
      cardId: 'card1',
      title: 'Rare Lightning Dragon - First Edition',
      description: 'Mint condition rare card from the original set',
      startingPrice: 50,
      currentBid: 125,
      bidIncrement: 5,
      reservePrice: 100,
      buyNowPrice: 200,
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      status: 'active',
      bidCount: 12,
      currentBidderId: 'bidder1',
      bids: [],
      watchers: ['user1', 'user2', 'user3'],
      card: {
        id: 'card1',
        title: 'Lightning Dragon',
        image_url: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
        rarity: 'Legendary',
        condition: 'Mint'
      },
      seller: {
        id: 'seller1',
        username: 'CardMaster99',
        avatar_url: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
        rating: 4.8
      }
    }
  ]);

  const [mockTrades] = useState<TradeOffer[]>([
    {
      id: '1',
      initiatorId: 'user1',
      recipientId: 'user2',
      initiatorCards: [
        {
          id: '1',
          cardId: 'card1',
          quantity: 1,
          condition: 'near_mint',
          estimatedValue: 45,
          card: {
            id: 'card1',
            title: 'Lightning Dragon',
            image_url: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
            rarity: 'Legendary',
            current_market_value: 45
          }
        }
      ],
      recipientCards: [
        {
          id: '2',
          cardId: 'card2',
          quantity: 1,
          condition: 'excellent',
          estimatedValue: 42,
          card: {
            id: 'card2',
            title: 'Ice Phoenix',
            image_url: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
            rarity: 'Epic',
            current_market_value: 42
          }
        }
      ],
      status: 'pending',
      message: 'Great collection! Would love to trade for your Ice Phoenix.',
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      tradeHistory: [],
      totalValue: {
        initiatorValue: 45,
        recipientValue: 42,
        difference: 3
      }
    }
  ]);

  const stats = {
    activeAuctions: mockAuctions.length,
    activeTrades: mockTrades.length,
    totalValue: mockAuctions.reduce((sum, auction) => sum + auction.currentBid, 0) +
                mockTrades.reduce((sum, trade) => sum + trade.totalValue.initiatorValue, 0),
    onlineUsers: userPresence.filter(user => user.status === 'online').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Trading Center</h1>
              <p className="text-muted-foreground">Live auctions and peer-to-peer trading</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
                {connectionStatus === 'connected' ? 'Live' : 'Connecting...'}
              </Badge>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Auction
              </Button>
              <Button variant="outline">
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Start Trade
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-muted/50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Auctions</p>
                <p className="font-semibold">{stats.activeAuctions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Trades</p>
                <p className="font-semibold">{stats.activeTrades}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-semibold">{formatCurrency(stats.totalValue * 100)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Online Now</p>
                <p className="font-semibold">{stats.onlineUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-auto grid-cols-3">
              <TabsTrigger value="auctions" className="flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                Live Auctions
              </TabsTrigger>
              <TabsTrigger value="trades" className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                Trade Offers
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Watchlist
              </TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search auctions and trades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <TabsContent value="auctions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAuctions.map((auction) => (
                <LiveAuctionCard
                  key={auction.id}
                  auction={auction}
                  onWatchAuction={(auctionId) => console.log('Watching auction:', auctionId)}
                  onBidPlaced={(auctionId, amount) => console.log('Bid placed:', auctionId, amount)}
                />
              ))}
            </div>
            
            {mockAuctions.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Gavel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active auctions</h3>
                  <p className="text-muted-foreground">Check back later or create your own auction!</p>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Auction
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {mockTrades.map((trade) => (
                <TradeOfferCard
                  key={trade.id}
                  trade={trade}
                  currentUserId="user2" // Mock current user
                  onAccept={(tradeId) => console.log('Accepting trade:', tradeId)}
                  onDecline={(tradeId) => console.log('Declining trade:', tradeId)}
                  onCounter={(tradeId) => console.log('Counter offer:', tradeId)}
                  onMessage={(tradeId) => console.log('Messaging trade:', tradeId)}
                />
              ))}
            </div>

            {mockTrades.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <ArrowLeftRight className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active trades</h3>
                  <p className="text-muted-foreground">Start trading with other collectors!</p>
                  <Button className="mt-4">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Start Trade
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground">Add auctions and trades to your watchlist to track them here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
