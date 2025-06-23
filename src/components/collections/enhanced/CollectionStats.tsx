
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Activity,
  Star,
  Users,
  Calendar
} from 'lucide-react';
import type { CollectionStatistics } from '@/types/collection';

interface CollectionStatsProps {
  statistics: CollectionStatistics;
  className?: string;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({
  statistics,
  className = ''
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Total Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(statistics.total_value)}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {formatCurrency(statistics.average_value)}
          </p>
        </CardContent>
      </Card>

      {/* Total Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cards</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.total_cards.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total collection size
          </p>
        </CardContent>
      </Card>

      {/* Completion */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.completion_percentage.toFixed(1)}%
          </div>
          <Progress 
            value={statistics.completion_percentage} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Last Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {formatDate(statistics.last_activity)}
          </div>
          <p className="text-xs text-muted-foreground">
            Most recent update
          </p>
        </CardContent>
      </Card>

      {/* Rarity Breakdown */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4" />
            Rarity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statistics.rarity_breakdown).map(([rarity, count]) => (
              count > 0 && (
                <Badge 
                  key={rarity} 
                  variant="secondary"
                  className={`${getRarityColor(rarity)} text-white`}
                >
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}: {count}
                </Badge>
              )
            ))}
          </div>
          
          <div className="mt-4 space-y-2">
            {Object.entries(statistics.rarity_breakdown).map(([rarity, count]) => (
              count > 0 && (
                <div key={rarity} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{rarity}</span>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(count / statistics.total_cards) * 100} 
                      className="w-20 h-2"
                    />
                    <span className="text-xs text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
