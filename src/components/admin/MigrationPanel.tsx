
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { migrateMockDataToDatabase, checkMigrationStatus } from '@/services/migrations/mockDataMigration';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';

export const MigrationPanel: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<boolean | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const status = await checkMigrationStatus();
      setMigrationStatus(status);
      toast.success(status ? 'Migration already completed' : 'Migration needed');
    } catch (error) {
      toast.error('Failed to check migration status');
    }
    setIsLoading(false);
  };

  const runMigration = async () => {
    if (!user) {
      toast.error('Please log in to run migration');
      return;
    }

    setIsLoading(true);
    try {
      const result = await migrateMockDataToDatabase(user.id);
      
      if (result.success) {
        toast.success(`Successfully migrated ${result.migratedCount} cards!`);
        setMigrationStatus(true);
      } else {
        toast.error(`Migration failed. Errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      toast.error('Migration failed');
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Mock Data Migration</CardTitle>
        <CardDescription>
          Migrate mock cards to the database for persistent storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={checkStatus} 
            disabled={isLoading}
            variant="outline"
          >
            Check Status
          </Button>
          <Button 
            onClick={runMigration} 
            disabled={isLoading || !user}
          >
            Run Migration
          </Button>
        </div>
        
        {migrationStatus !== null && (
          <div className={`p-2 rounded text-sm ${
            migrationStatus 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {migrationStatus ? '✅ Migration completed' : '⚠️ Migration needed'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
