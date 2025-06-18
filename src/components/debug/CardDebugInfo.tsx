
import React from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useCards } from '@/hooks/useCards';
import { localCardStorage } from '@/lib/localCardStorage';

export const CardDebugInfo: React.FC = () => {
  const { user } = useAuth();
  const { cards, userCards, loading, dataSource } = useCards();
  const localCards = localCardStorage.getAllCards();
  const unsyncedCards = localCardStorage.getUnsyncedCards();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Card Debug Info</h3>
      <div className="space-y-1">
        <div>User ID: {user?.id || 'Not logged in'}</div>
        <div>Data Source: {dataSource}</div>
        <div>Database Cards: {cards.length}</div>
        <div>User Cards: {userCards.length}</div>
        <div>Local Cards: {localCards.length}</div>
        <div>Unsynced Cards: {unsyncedCards.length}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        {unsyncedCards.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-900/50 rounded">
            <div className="font-semibold">Unsynced Cards:</div>
            {unsyncedCards.map(card => (
              <div key={card.id} className="truncate">
                {card.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
