
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { TradeOffer, LiveAuction, TradingSession, UserPresence, TradeMessage } from '@/types/trading';

interface UseRealTimeTradingProps {
  sessionId?: string;
  auctionId?: string;
}

export const useRealTimeTrading = ({ sessionId, auctionId }: UseRealTimeTradingProps = {}) => {
  const { user } = useAuth();
  const [activeTrades, setActiveTrades] = useState<TradeOffer[]>([]);
  const [activeAuctions, setActiveAuctions] = useState<LiveAuction[]>([]);
  const [currentSession, setCurrentSession] = useState<TradingSession | null>(null);
  const [userPresence, setUserPresence] = useState<Map<string, UserPresence>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Track user presence
  const trackPresence = useCallback(async (location: UserPresence['currentLocation'] = 'trading') => {
    if (!user) return;

    const channel = supabase.channel('user-presence');
    const presenceState = {
      userId: user.id,
      status: 'online' as const,
      lastSeen: new Date().toISOString(),
      currentLocation: location,
      activeAuctions: auctionId ? [auctionId] : [],
      activeTrades: sessionId ? [sessionId] : []
    };

    await channel.track(presenceState);
    setConnectionStatus('connected');
  }, [user, auctionId, sessionId]);

  // Subscribe to real-time trade updates
  useEffect(() => {
    if (!user) return;

    const tradesChannel = supabase
      .channel('trades-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_offers',
          filter: `initiator_id=eq.${user.id},recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Trade update:', payload);
          if (payload.eventType === 'INSERT' && payload.new) {
            setActiveTrades(prev => [...prev, payload.new as TradeOffer]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setActiveTrades(prev => 
              prev.map(trade => trade.id === (payload.new as any).id ? payload.new as TradeOffer : trade)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tradesChannel);
    };
  }, [user]);

  // Subscribe to auction updates
  useEffect(() => {
    if (!auctionId) return;

    const auctionChannel = supabase
      .channel(`auction-${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_auctions',
          filter: `id=eq.${auctionId}`
        },
        (payload) => {
          console.log('Auction update:', payload);
          if (payload.new) {
            setActiveAuctions(prev => 
              prev.map(auction => auction.id === auctionId ? payload.new as LiveAuction : auction)
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_bids',
          filter: `auction_id=eq.${auctionId}`
        },
        (payload) => {
          console.log('New bid:', payload);
          if (payload.new) {
            const newBid = payload.new as any;
            // Update auction with new bid
            setActiveAuctions(prev => 
              prev.map(auction => {
                if (auction.id === auctionId) {
                  return {
                    ...auction,
                    currentBid: newBid.amount,
                    bidCount: auction.bidCount + 1,
                    currentBidderId: newBid.bidder_id
                  };
                }
                return auction;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(auctionChannel);
    };
  }, [auctionId]);

  // Subscribe to trading session updates
  useEffect(() => {
    if (!sessionId) return;

    const sessionChannel = supabase
      .channel(`session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trading_sessions'
        },
        (payload) => {
          if (payload.new && (payload.new as any).id === sessionId) {
            setCurrentSession(payload.new as TradingSession);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          if (payload.new) {
            const newMessage = payload.new as TradeMessage;
            setCurrentSession(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                messages: [...prev.messages, newMessage]
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, [sessionId]);

  // Initialize presence tracking
  useEffect(() => {
    if (user) {
      trackPresence();
    }
  }, [user, trackPresence]);

  const placeBid = useCallback(async (auctionId: string, amount: number, isProxy: boolean = false, maxAmount?: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('place-auction-bid', {
        body: {
          auctionId,
          amount,
          isProxy,
          maxAmount
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }, []);

  const sendTradeOffer = useCallback(async (tradeData: Partial<TradeOffer>) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-trade-offer', {
        body: tradeData
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending trade offer:', error);
      throw error;
    }
  }, []);

  const respondToTrade = useCallback(async (tradeId: string, action: 'accept' | 'decline' | 'counter', counterOffer?: Partial<TradeOffer>) => {
    try {
      const { data, error } = await supabase.functions.invoke('respond-to-trade', {
        body: {
          tradeId,
          action,
          counterOffer
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error responding to trade:', error);
      throw error;
    }
  }, []);

  const sendMessage = useCallback(async (sessionId: string, content: string, type: 'text' | 'voice' = 'text', metadata?: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-trade-message', {
        body: {
          sessionId,
          content,
          type,
          metadata
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, []);

  return {
    activeTrades,
    activeAuctions,
    currentSession,
    userPresence: Array.from(userPresence.values()),
    connectionStatus,
    placeBid,
    sendTradeOffer,
    respondToTrade,
    sendMessage,
    trackPresence
  };
};
