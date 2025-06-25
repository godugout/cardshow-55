
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Gavel, 
  TrendingUp, 
  Eye, 
  Heart, 
  ShoppingCart,
  Users,
  Zap
} from 'lucide-react';
import { useRealTimeTrading } from '@/hooks/useRealTimeTrading';
import { formatCurrency } from '@/services/stripe';
import type { LiveAuction } from '@/types/trading';

interface LiveAuctionCardProps {
  auction: LiveAuction;
  onWatchAuction?: (auctionId: string) => void;
  onBidPlaced?: (auctionId: string, amount: number) => void;
}

export const LiveAuctionCard: React.FC<LiveAuctionCardProps> = ({
  auction,
  onWatchAuction,
  onBidPlaced
}) => {
  const { placeBid } = useRealTimeTrading({ auctionId: auction.id });
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isWatching, setIsWatching] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(auction.endTime);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Auction ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const handlePlaceBid = async () => {
    if (bidAmount <= auction.currentBid) return;

    setIsPlacingBid(true);
    try {
      await placeBid(auction.id, bidAmount);
      onBidPlaced?.(auction.id, bidAmount);
      setBidAmount(bidAmount + auction.bidIncrement);
    } catch (error) {
      console.error('Failed to place bid:', error);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleQuickBid = () => {
    setBidAmount(auction.currentBid + auction.bidIncrement);
    handlePlaceBid();
  };

  const handleBuyNow = () => {
    if (auction.buyNowPrice) {
      setBidAmount(auction.buyNowPrice);
      handlePlaceBid();
    }
  };

  const toggleWatch = () => {
    setIsWatching(!isWatching);
    onWatchAuction?.(auction.id);
  };

  const progressPercentage = auction.reservePrice 
    ? Math.min((auction.currentBid / auction.reservePrice) * 100, 100)
    : (auction.currentBid / (auction.startingPrice * 2)) * 100;

  const isEndingSoon = new Date(auction.endTime).getTime() - Date.now() < 3600000; // 1 hour

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
      isEndingSoon ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
    }`}>
      {isEndingSoon && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs text-center py-1 font-medium animate-pulse">
          <Zap className="inline w-3 h-3 mr-1" />
          Ending Soon!
        </div>
      )}

      <CardHeader className={`pb-3 ${isEndingSoon ? 'pt-8' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">{auction.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="w-6 h-6">
                <AvatarImage src={auction.seller.avatar_url} />
                <AvatarFallback>{auction.seller.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{auction.seller.username}</span>
              <Badge variant="secondary" className="text-xs">
                {auction.seller.rating}/5 ⭐
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleWatch}
            className={isWatching ? 'text-red-500' : ''}
          >
            <Heart className={`w-4 h-4 ${isWatching ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Card Image */}
        <div className="relative">
          <img
            src={auction.card.image_url}
            alt={auction.card.title}
            className="w-full aspect-[2.5/3.5] object-cover rounded-lg"
          />
          <Badge className="absolute top-2 left-2 bg-black/75 text-white">
            {auction.card.rarity}
          </Badge>
          <Badge className="absolute top-2 right-2 bg-black/75 text-white">
            {auction.card.condition}
          </Badge>
        </div>

        {/* Bidding Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Bid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(auction.currentBid * 100)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Time Left</p>
              <p className={`font-medium ${isEndingSoon ? 'text-orange-500' : ''}`}>
                <Clock className="inline w-4 h-4 mr-1" />
                {timeLeft}
              </p>
            </div>
          </div>

          {/* Reserve Progress */}
          {auction.reservePrice && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Reserve Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              {auction.currentBid >= auction.reservePrice && (
                <p className="text-xs text-green-600 font-medium">✓ Reserve met</p>
              )}
            </div>
          )}

          {/* Auction Stats */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Gavel className="w-4 h-4" />
              <span>{auction.bidCount} bids</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{auction.watchers.length} watching</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>Live</span>
            </div>
          </div>

          {/* Bidding Controls */}
          {auction.status === 'active' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={auction.currentBid + auction.bidIncrement}
                  step={auction.bidIncrement}
                  className="flex-1"
                />
                <Button
                  onClick={handlePlaceBid}
                  disabled={isPlacingBid || bidAmount <= auction.currentBid}
                  className="px-8"
                >
                  {isPlacingBid ? 'Bidding...' : 'Bid'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickBid}
                  disabled={isPlacingBid}
                  className="flex-1"
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Quick Bid (+{formatCurrency(auction.bidIncrement * 100)})
                </Button>
                
                {auction.buyNowPrice && (
                  <Button
                    size="sm"
                    onClick={handleBuyNow}
                    disabled={isPlacingBid}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy Now - {formatCurrency(auction.buyNowPrice * 100)}
                  </Button>
                )}
              </div>
            </div>
          )}

          {auction.status === 'ended' && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Auction has ended</p>
              {auction.currentBidderId && (
                <p className="text-sm">Winner will be contacted shortly</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
