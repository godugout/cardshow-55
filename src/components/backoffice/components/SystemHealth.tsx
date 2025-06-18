
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { localCardStorage } from '@/lib/localCardStorage';
import { useCards } from '@/hooks/useCards';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Database, Cloud, HardDrive } from 'lucide-react';

interface SystemStatus {
  database: 'healthy' | 'warning' | 'error';
  localStorage: 'healthy' | 'warning' | 'error';
  dataSync: 'healthy' | 'warning' | 'error';
}

export const SystemHealth = () => {
  const { cards, userCards, dataSource, migrateLocalCardsToDatabase } = useCards();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'healthy',
    localStorage: 'healthy',
    dataSync: 'healthy'
  });
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);

  const checkSystemHealth = async () => {
    setIsCheckingHealth(true);
    const newStatus: SystemStatus = {
      database: 'healthy',
      localStorage: 'healthy',
      dataSync: 'healthy'
    };

    try {
      // Test database connection
      const { error: dbError } = await supabase.from('cards').select('count').limit(1);
      if (dbError) {
        newStatus.database = 'error';
        console.error('Database health check failed:', dbError);
      }
    } catch (error) {
      newStatus.database = 'error';
      console.error('Database connection failed:', error);
    }

    try {
      // Test localStorage
      const localCards = localCardStorage.getAllCards();
      const unsyncedCards = localCardStorage.getUnsyncedCards();
      
      if (unsyncedCards.length > 0) {
        newStatus.dataSync = 'warning';
      }
    } catch (error) {
      newStatus.localStorage = 'error';
      console.error('LocalStorage check failed:', error);
    }

    // Check data synchronization
    if (dataSource === 'mixed' || dataSource === 'local') {
      newStatus.dataSync = 'warning';
    }

    setSystemStatus(newStatus);
    setLastHealthCheck(new Date());
    setIsCheckingHealth(false);
  };

  const handleMigrateLocalCards = async () => {
    try {
      await migrateLocalCardsToDatabase();
      toast.success('Local cards migrated to database');
      checkSystemHealth();
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Failed to migrate local cards');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const localCards = localCardStorage.getAllCards();
  const unsyncedCards = localCardStorage.getUnsyncedCards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">System Health</h2>
        <Button
          onClick={checkSystemHealth}
          disabled={isCheckingHealth}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingHealth ? 'animate-spin' : ''}`} />
          Check Health
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Database
            </CardTitle>
            {getStatusIcon(systemStatus.database)}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={`${getStatusColor(systemStatus.database)} text-white`}>
                {systemStatus.database.toUpperCase()}
              </Badge>
              <p className="text-xs text-crd-lightGray">
                {cards.length} cards in database
              </p>
              {systemStatus.database === 'error' && (
                <p className="text-xs text-red-400">
                  Database connection failed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Local Storage
            </CardTitle>
            {getStatusIcon(systemStatus.localStorage)}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={`${getStatusColor(systemStatus.localStorage)} text-white`}>
                {systemStatus.localStorage.toUpperCase()}
              </Badge>
              <p className="text-xs text-crd-lightGray">
                {localCards.length} cards locally stored
              </p>
              {systemStatus.localStorage === 'error' && (
                <p className="text-xs text-red-400">
                  Local storage unavailable
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-crd-lightGray flex items-center">
              <Cloud className="h-4 w-4 mr-2" />
              Data Sync
            </CardTitle>
            {getStatusIcon(systemStatus.dataSync)}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={`${getStatusColor(systemStatus.dataSync)} text-white`}>
                {systemStatus.dataSync.toUpperCase()}
              </Badge>
              <p className="text-xs text-crd-lightGray">
                {unsyncedCards.length} unsynced cards
              </p>
              {systemStatus.dataSync === 'warning' && (
                <p className="text-xs text-yellow-400">
                  Local cards need sync
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {unsyncedCards.length > 0 && (
        <Card className="bg-crd-darkGray border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Data Synchronization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-500 font-medium">Sync Required</span>
              </div>
              <p className="text-crd-lightGray text-sm">
                You have {unsyncedCards.length} cards stored locally that haven't been synced to the database. 
                Click below to migrate them.
              </p>
            </div>
            <Button
              onClick={handleMigrateLocalCards}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              Migrate Local Cards to Database
            </Button>
          </CardContent>
        </Card>
      )}

      {lastHealthCheck && (
        <div className="text-xs text-crd-lightGray text-center">
          Last health check: {lastHealthCheck.toLocaleString()}
        </div>
      )}
    </div>
  );
};
