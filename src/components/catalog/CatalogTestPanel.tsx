
import React from 'react';
import { useUnifiedCardCatalog } from '@/hooks/useUnifiedCardCatalog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  HardDrive, 
  FileText, 
  Search, 
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export const CatalogTestPanel: React.FC = () => {
  const {
    cards,
    loading,
    error,
    total,
    sources,
    sync,
    selectedSources,
    refresh,
    isEmpty
  } = useUnifiedCardCatalog({
    defaultSources: ['database', 'local', 'template'],
    pageSize: 50
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'database': return <Database className="h-4 w-4 text-blue-400" />;
      case 'local': return <HardDrive className="h-4 w-4 text-green-400" />;
      case 'template': return <FileText className="h-4 w-4 text-purple-400" />;
      case 'detected': return <Search className="h-4 w-4 text-orange-400" />;
      case 'external': return <ExternalLink className="h-4 w-4 text-cyan-400" />;
      default: return null;
    }
  };

  const getStatusIcon = (hasCards: boolean, loading: boolean, error?: string) => {
    if (loading) return <Clock className="h-4 w-4 text-yellow-400" />;
    if (error) return <XCircle className="h-4 w-4 text-red-400" />;
    if (hasCards) return <CheckCircle className="h-4 w-4 text-green-400" />;
    return <XCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            🧪 Catalog System Test
            <Button onClick={refresh} size="sm" variant="outline" disabled={loading}>
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-sm text-gray-400">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedSources.length}</div>
              <div className="text-sm text-gray-400">Active Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{sync.pending}</div>
              <div className="text-sm text-gray-400">Pending Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{sync.conflicts}</div>
              <div className="text-sm text-gray-400">Conflicts</div>
            </div>
          </div>

          {/* Source Status */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Source Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {Object.entries(sources).map(([source, status]) => (
                <div key={source} className="flex items-center justify-between p-2 bg-crd-mediumGray/30 rounded">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(source)}
                    <span className="text-sm text-white capitalize">{source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {status.count}
                    </Badge>
                    {getStatusIcon(status.count > 0, status.loading, status.error)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Sample Cards */}
          {cards.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Sample Cards ({cards.length} total)</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {cards.slice(0, 5).map((card) => (
                  <div key={`${card.source}-${card.id}`} className="flex items-center gap-2 text-xs p-2 bg-crd-mediumGray/20 rounded">
                    {getSourceIcon(card.source)}
                    <span className="text-white truncate flex-1">{card.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {card.source}
                    </Badge>
                    <Badge 
                      variant={card.sync_status === 'synced' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {card.sync_status}
                    </Badge>
                  </div>
                ))}
                {cards.length > 5 && (
                  <div className="text-xs text-gray-400 text-center py-1">
                    ... and {cards.length - 5} more cards
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State Info */}
          {isEmpty && !loading && (
            <div className="text-center p-6 bg-crd-mediumGray/10 rounded">
              <div className="text-gray-400 mb-2">No cards found</div>
              <div className="text-xs text-gray-500">
                Selected sources: {selectedSources.join(', ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
