
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCards } from '@/hooks/useCards';
import { CardRepository } from '@/repositories/cardRepository';
import { toast } from 'sonner';
import { Search, Eye, EyeOff, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Card as CardType } from '@/types/card';

export const CardManagement = () => {
  const { cards, loading, fetchCards } = useCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'public' | 'private'>('all');

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-crd-lightGray">Loading cards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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

      <Card className="bg-crd-darkGray border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Cards ({filteredCards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCards.length === 0 ? (
              <div className="text-center py-8 text-crd-lightGray">
                No cards found matching your criteria.
              </div>
            ) : (
              filteredCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-4 bg-crd-mediumGray/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {card.thumbnail_url && (
                      <img 
                        src={card.thumbnail_url} 
                        alt={card.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-white font-medium">{card.title}</h3>
                      <p className="text-sm text-crd-lightGray truncate max-w-md">
                        {card.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          className={`${getRarityColor(card.rarity)} text-white`}
                        >
                          {card.rarity}
                        </Badge>
                        <Badge variant={card.is_public ? 'default' : 'secondary'}>
                          {card.is_public ? 'Public' : 'Private'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(card.id, card.is_public)}
                      className="text-crd-lightGray hover:text-white"
                    >
                      {card.is_public ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-crd-darkGray border-crd-mediumGray">
                        <DropdownMenuItem 
                          onClick={() => window.open(`/card/${card.id}`, '_blank')}
                          className="text-white hover:bg-crd-mediumGray"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          View Card
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-red-400 hover:bg-crd-mediumGray focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
