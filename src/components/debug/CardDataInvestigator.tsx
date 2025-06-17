
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCards } from '@/hooks/useCards';
import { localCardStorage } from '@/lib/localCardStorage';
import { supabase } from '@/integrations/supabase/client';
import { Database, HardDrive, Cloud, RefreshCw } from 'lucide-react';

interface DataSourceInfo {
  source: string;
  count: number;
  items: any[];
}

export const CardDataInvestigator: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSourceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { cards, featuredCards, userCards, dataSource, migrateLocalCardsToDatabase } = useCards();

  const investigateAllDataSources = async () => {
    setLoading(true);
    const sources: DataSourceInfo[] = [];
    
    try {
      // Check cards table
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*');
      
      if (!cardsError) {
        sources.push({
          source: 'cards table',
          count: cardsData?.length || 0,
          items: cardsData || []
        });
      }

      // Check collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select(`
          *,
          collection_cards (
            card_id,
            cards (*)
          )
        `);
      
      if (!collectionsError) {
        const collectionCards = collectionsData?.flatMap(c => 
          c.collection_cards?.map(cc => cc.cards).filter(Boolean) || []
        ) || [];
        
        sources.push({
          source: 'collections',
          count: collectionsData?.length || 0,
          items: collectionsData || []
        });
        
        sources.push({
          source: 'collection_cards',
          count: collectionCards.length,
          items: collectionCards
        });
      }

      // Check memories table
      const { data: memoriesData, error: memoriesError } = await supabase
        .from('memories')
        .select('*');
      
      if (!memoriesError) {
        sources.push({
          source: 'memories table',
          count: memoriesData?.length || 0,
          items: memoriesData || []
        });
      }

      // Check card_templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('card_templates')
        .select('*');
      
      if (!templatesError) {
        sources.push({
          source: 'card_templates',
          count: templatesData?.length || 0,
          items: templatesData || []
        });
      }

      // Check local storage
      const localCards = localCardStorage.getAllCards();
      sources.push({
        source: 'local storage',
        count: localCards.length,
        items: localCards
      });

      setDataSources(sources);
    } catch (error) {
      console.error('Error investigating data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    investigateAllDataSources();
  }, []);

  const getSourceIcon = (source: string) => {
    if (source.includes('local')) return <HardDrive className="w-4 h-4" />;
    if (source.includes('table') || source.includes('cards')) return <Database className="w-4 h-4" />;
    return <Cloud className="w-4 h-4" />;
  };

  const getSourceColor = (count: number) => {
    if (count === 0) return 'secondary';
    if (count < 5) return 'outline';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Card Data Investigation
          </CardTitle>
          <CardDescription>
            Investigating all possible data sources for cards in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={investigateAllDataSources} 
              disabled={loading}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Investigation
            </Button>
            
            <Button 
              onClick={migrateLocalCardsToDatabase}
              variant="outline"
              size="sm"
            >
              Migrate Local Cards
            </Button>
          </div>

          <Separator />

          {/* Current Hook State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">useCards Hook</div>
              <div className="text-xs text-muted-foreground mt-1">
                Cards: {cards.length} | Featured: {featuredCards.length} | User: {userCards.length}
              </div>
              <Badge variant="outline" className="mt-2">
                Source: {dataSource}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Data Sources */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Data Sources Investigation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dataSources.map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getSourceIcon(source.source)}
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <Badge variant={getSourceColor(source.count)}>
                    {source.count} items
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Items */}
          {dataSources.map((source, index) => (
            source.count > 0 && (
              <div key={index} className="space-y-2">
                <h5 className="text-sm font-medium flex items-center gap-2">
                  {getSourceIcon(source.source)}
                  {source.source} ({source.count} items)
                </h5>
                <div className="text-xs space-y-1 bg-muted p-3 rounded max-h-40 overflow-y-auto">
                  {source.items.slice(0, 10).map((item, itemIndex) => (
                    <div key={itemIndex} className="font-mono">
                      {JSON.stringify(item, null, 2).slice(0, 200)}
                      {JSON.stringify(item).length > 200 && '...'}
                    </div>
                  ))}
                  {source.items.length > 10 && (
                    <div className="text-muted-foreground">
                      ... and {source.items.length - 10} more items
                    </div>
                  )}
                </div>
              </div>
            )
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
