
export interface TradeOffer {
  id: string;
  initiatorId: string;
  recipientId: string;
  initiatorCards: TradeCard[];
  recipientCards: TradeCard[];
  initiatorCashAmount?: number;
  recipientCashAmount?: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'expired' | 'completed';
  message?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  tradeHistory: TradeHistoryItem[];
  totalValue: {
    initiatorValue: number;
    recipientValue: number;
    difference: number;
  };
}

export interface TradeCard {
  id: string;
  cardId: string;
  quantity: number;
  condition: 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor';
  estimatedValue: number;
  card: {
    id: string;
    title: string;
    image_url: string;
    rarity: string;
    current_market_value: number;
  };
}

export interface TradeHistoryItem {
  id: string;
  action: 'created' | 'countered' | 'accepted' | 'declined' | 'expired' | 'message';
  userId: string;
  message?: string;
  changes?: {
    cardsAdded?: TradeCard[];
    cardsRemoved?: TradeCard[];
    cashAmountChange?: number;
  };
  timestamp: string;
}

export interface LiveAuction {
  id: string;
  sellerId: string;
  cardId: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  bidIncrement: number;
  reservePrice?: number;
  buyNowPrice?: number;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  bidCount: number;
  currentBidderId?: string;
  bids: AuctionBid[];
  watchers: string[];
  card: {
    id: string;
    title: string;
    image_url: string;
    rarity: string;
    condition: string;
  };
  seller: {
    id: string;
    username: string;
    avatar_url?: string;
    rating: number;
  };
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  isProxyBid: boolean;
  maxProxyAmount?: number;
  timestamp: string;
  bidder: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface TradingSession {
  id: string;
  participants: string[];
  currentTrade?: TradeOffer;
  messages: TradeMessage[];
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: string;
  lastActivity: string;
}

export interface TradeMessage {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  type: 'text' | 'voice' | 'offer' | 'system';
  timestamp: string;
  metadata?: {
    voiceUrl?: string;
    duration?: number;
    offerData?: Partial<TradeOffer>;
  };
}

export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  currentLocation?: 'trading' | 'auction' | 'marketplace' | 'idle';
  activeAuctions?: string[];
  activeTrades?: string[];
}

export interface NegotiationTools {
  priceComparison: {
    currentMarketValue: number;
    recentSales: Array<{
      price: number;
      date: string;
      condition: string;
    }>;
    priceRange: {
      low: number;
      high: number;
      average: number;
    };
  };
  tradeBalance: {
    difference: number;
    suggestedCashAmount: number;
    fairnessScore: number; // 0-100
  };
  marketTrends: {
    priceDirection: 'up' | 'down' | 'stable';
    demandLevel: 'high' | 'medium' | 'low';
    volatility: number;
  };
}
