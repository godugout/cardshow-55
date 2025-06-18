import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCards } from '@/hooks/useCards';
import { CardRepository } from '@/repositories/cardRepository';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { CardsViewModeToggle, type CardManagementViewMode } from '@/components/cards/CardsViewModeToggle';
import { CardManagementCompactView } from './CardManagementCompactView';
import { CardManagementGridView } from './CardManagementGridView';
import { CardManagementTableView } from './CardManagementTableView';
import type { Card as CardType } from '@/types/card';

type ViewMode = 'rows' | 'grid' | 'table';

export const CardManagement = () => {
  const { cards, loading, fetchCards } = useCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'public' | 'private'>('all');
  const [viewMode, setViewMode] = useState<CardManagementViewMode>('rows');

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = selectedVisibility === 'all' || 
                             (selectedVisibility === 'public' && card.is_public) ||
                             (selectedVisibility === 'private' && !card.is_public);
    return matchesSearch && matchesVisibility;
  });

  const handleToggleVisibility = async (cardId: string, currentVisibility: boolean) => {
    try {
      const success = await CardRepository.updateCard(cardId, {
        is_public: !currentVisibility,
        visibility: !currentVisibility ? 'public' : 'private'
      });
      
      if (success) {
        toast.success(`Card ${!currentVisibility ? 'published' : 'made private'}`);
        fetchCards();
      } else {
        toast.error('Failed to update card visibility');
      }
    } catch (error) {
      console.error('Error updating card visibility:', error);
      toast.error('Failed to update card visibility');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await CardRepository.deleteCard(cardId);
      if (success) {
        toast.success('Card deleted successfully');
        fetchCards();
      } else {
        toast.error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
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

  const renderView = () => {
    const commonProps = {
      cards: filteredCards,
      onToggleVisibility: handleToggleVisibility,
      onDeleteCard: handleDeleteCard,
      getRarityColor
    };

    switch (viewMode) {
      case 'grid':
        return <CardManagementGridView {...commonProps} />;
      case 'table':
        return <CardManagementTableView {...commonProps} />;
      default:
        return <CardManagementCompactView {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-crd-lightGray">Loading cards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-crd-lightGray" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-crd-darkGray border-crd-mediumGray text-white"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'public', 'private'].map((visibility) => (
              <Button
                key={visibility}
                variant={selectedVisibility === visibility ? 'default' : 'outline'}
                onClick={() => setSelectedVisibility(visibility as any)}
                className={selectedVisibility === visibility 
                  ? 'bg-crd-green text-black' 
                  : 'border-crd-mediumGray text-crd-lightGray hover:text-white'
                }
              >
                {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        <CardsViewModeToggle value={viewMode} onChange={setViewMode} />
      </div>

      <Card className="bg-crd-darkGray border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Cards ({filteredCards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {renderView()}
        </CardContent>
      </Card>
    </div>
  );
};
