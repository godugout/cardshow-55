
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeftRight, 
  Clock, 
  DollarSign, 
  MessageCircle, 
  Check, 
  X, 
  Edit,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useRealTimeTrading } from '@/hooks/useRealTimeTrading';
import { formatCurrency } from '@/services/stripe';
import type { TradeOffer } from '@/types/trading';

interface TradeOfferCardProps {
  trade: TradeOffer;
  currentUserId: string;
  onAccept?: (tradeId: string) => void;
  onDecline?: (tradeId: string) => void;
  onCounter?: (tradeId: string) => void;
  onMessage?: (tradeId: string) => void;
}

export const TradeOfferCard: React.FC<TradeOfferCardProps> = ({
  trade,
  currentUserId,
  onAccept,
  onDecline,
  onCounter,
  onMessage
}) => {
  const { respondToTrade } = useRealTimeTrading();
  const [isResponding, setIsResponding] = useState(false);

  const isInitiator = trade.initiatorId === currentUserId;
  const isRecipient = trade.recipientId === currentUserId;
  const canRespond = isRecipient && trade.status === 'pending';

  const getStatusColor = (status: TradeOffer['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      case 'countered': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      case 'completed': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getTimeLeft = () => {
    const now = new Date();
    const expiresAt = new Date(trade.expiresAt);
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handleAccept = async () => {
    setIsResponding(true);
    try {
      await respondToTrade(trade.id, 'accept');
      onAccept?.(trade.id);
    } catch (error) {
      console.error('Failed to accept trade:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const handleDecline = async () => {
    setIsResponding(true);
    try {
      await respondToTrade(trade.id, 'decline');
      onDecline?.(trade.id);
    } catch (error) {
      console.error('Failed to decline trade:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const renderCardList = (cards: typeof trade.initiatorCards, title: string, cashAmount?: number) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {cards.map((tradeCard) => (
          <div key={tradeCard.id} className="relative">
            <img
              src={tradeCard.card.image_url}
              alt={tradeCard.card.title}
              className="w-full aspect-[2.5/3.5] object-cover rounded border"
            />
            <Badge className="absolute top-1 left-1 text-xs" variant="secondary">
              {tradeCard.quantity}x
            </Badge>
            <Badge className="absolute top-1 right-1 text-xs bg-green-600 text-white">
              {formatCurrency(tradeCard.estimatedValue * 100)}
            </Badge>
            <div className="mt-1">
              <p className="text-xs font-medium line-clamp-1">{tradeCard.card.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{tradeCard.condition}</p>
            </div>
          </div>
        ))}
      </div>
      {cashAmount && cashAmount > 0 && (
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">+ {formatCurrency(cashAmount * 100)} cash</span>
        </div>
      )}
    </div>
  );

  const valueDifference = trade.totalValue.initiatorValue - trade.totalValue.recipientValue;
  const fairnessScore = Math.max(0, 100 - Math.abs(valueDifference / Math.max(trade.totalValue.initiatorValue, trade.totalValue.recipientValue) * 100));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Trade Offer #{trade.id.slice(-8)}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(trade.status)}>
              {trade.status}
            </Badge>
            {trade.status === 'pending' && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeLeft()}
              </Badge>
            )}
          </div>
        </div>
        
        {trade.message && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm italic">"{trade.message}"</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trade Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Initiator's Cards */}
          <div>
            {renderCardList(
              trade.initiatorCards, 
              isInitiator ? "Your Cards" : "Their Cards",
              trade.initiatorCashAmount
            )}
            <div className="mt-2 text-right">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="font-semibold text-lg">
                {formatCurrency(trade.totalValue.initiatorValue * 100)}
              </p>
            </div>
          </div>

          {/* Trade Arrow & Stats */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
            
            {/* Fairness Score */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Fairness Score</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  fairnessScore >= 80 ? 'bg-green-500' : 
                  fairnessScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">{Math.round(fairnessScore)}%</span>
              </div>
            </div>

            {/* Value Difference */}
            {Math.abs(valueDifference) > 0 && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Value Difference</p>
                <p className={`text-sm font-medium ${
                  valueDifference > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {valueDifference > 0 ? '+' : ''}
                  {formatCurrency(Math.abs(valueDifference) * 100)}
                </p>
              </div>
            )}
          </div>

          {/* Recipient's Cards */}
          <div>
            {renderCardList(
              trade.recipientCards, 
              isRecipient ? "Your Cards" : "Their Cards",
              trade.recipientCashAmount
            )}
            <div className="mt-2 text-right">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="font-semibold text-lg">
                {formatCurrency(trade.totalValue.recipientValue * 100)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {canRespond && (
            <>
              <Button
                onClick={handleAccept}
                disabled={isResponding}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept Trade
              </Button>
              <Button
                variant="outline"
                onClick={() => onCounter?.(trade.id)}
                disabled={isResponding}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Counter Offer
              </Button>
              <Button
                variant="destructive"
                onClick={handleDecline}
                disabled={isResponding}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            onClick={() => onMessage?.(trade.id)}
            className={canRespond ? '' : 'flex-1'}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>

          {!canRespond && trade.status === 'pending' && isInitiator && (
            <Button variant="outline" className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Waiting for Response
            </Button>
          )}
        </div>

        {/* Trade History */}
        {trade.tradeHistory.length > 1 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Trade History</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {trade.tradeHistory.slice(-3).map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span>{item.action} • {new Date(item.timestamp).toLocaleTimeString()}</span>
                  {item.message && <span>• "{item.message}"</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {trade.status === 'pending' && new Date(trade.expiresAt).getTime() - Date.now() < 3600000 && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 text-orange-700 rounded border border-orange-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">This trade expires soon!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
