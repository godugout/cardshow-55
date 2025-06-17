
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Database, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { seedSampleCards } from '@/utils/seedDatabase';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface DatabaseSeedPromptProps {
  onSeedComplete?: () => void;
}

export const DatabaseSeedPrompt: React.FC<DatabaseSeedPromptProps> = ({ onSeedComplete }) => {
  const { user } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    if (!user?.id) {
      toast.error('Please sign in to add sample cards');
      return;
    }

    setIsSeeding(true);
    try {
      await seedSampleCards(user.id);
      toast.success('Sample cards added successfully!');
      onSeedComplete?.();
    } catch (error) {
      toast.error('Failed to add sample cards. Please try again.');
      console.error('Seeding error:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-crd-darkest p-4">
      <Card className="w-full max-w-md bg-surface-dark border-surface-accent">
        <CardHeader className="text-center">
          <Database className="w-12 h-12 mx-auto mb-4 text-crd-green" />
          <CardTitle className="text-text-primary">No Cards Available</CardTitle>
          <CardDescription className="text-text-secondary">
            The database doesn't have any cards yet. Would you like to add some sample cards to get started?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSeedDatabase}
            disabled={isSeeding || !user}
            className="w-full bg-crd-green hover:bg-crd-green-dark text-surface-dark"
          >
            {isSeeding ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Adding Sample Cards...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Add Sample Cards
              </>
            )}
          </Button>
          
          {!user && (
            <p className="text-sm text-text-muted text-center">
              Please sign in to add cards to the database
            </p>
          )}
          
          <div className="text-xs text-text-muted">
            <p>Sample cards include:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>LeBron James (Lakers)</li>
              <li>Stephen Curry (Warriors)</li>
              <li>Kevin Durant (Suns)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
