
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, EyeOff, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Card } from '@/types/card';

type SortField = 'title' | 'rarity' | 'created_at' | 'visibility';
type SortDirection = 'asc' | 'desc';

interface CardManagementTableViewProps {
  cards: Card[];
  onToggleVisibility: (cardId: string, currentVisibility: boolean) => void;
  onDeleteCard: (cardId: string) => void;
  getRarityColor: (rarity: string) => string;
}

export const CardManagementTableView: React.FC<CardManagementTableViewProps> = ({
  cards,
  onToggleVisibility,
  onDeleteCard,
  getRarityColor
}) => {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCards = React.useMemo(() => {
    return [...cards].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          aValue = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0;
          bValue = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'visibility':
          aValue = a.is_public ? 1 : 0;
          bValue = b.is_public ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cards, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-crd-lightGray">
        No cards found matching your criteria.
      </div>
    );
  }

  return (
    <div className="border border-crd-mediumGray rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-crd-mediumGray hover:bg-crd-mediumGray/20">
            <TableHead className="w-12"></TableHead>
            <TableHead 
              className="text-crd-white cursor-pointer hover:text-white"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center space-x-1">
                <span>Title</span>
                <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead className="text-crd-white">Description</TableHead>
            <TableHead 
              className="text-crd-white cursor-pointer hover:text-white"
              onClick={() => handleSort('rarity')}
            >
              <div className="flex items-center space-x-1">
                <span>Rarity</span>
                <SortIcon field="rarity" />
              </div>
            </TableHead>
            <TableHead 
              className="text-crd-white cursor-pointer hover:text-white"
              onClick={() => handleSort('visibility')}
            >
              <div className="flex items-center space-x-1">
                <span>Visibility</span>
                <SortIcon field="visibility" />
              </div>
            </TableHead>
            <TableHead 
              className="text-crd-white cursor-pointer hover:text-white"
              onClick={() => handleSort('created_at')}
            >
              <div className="flex items-center space-x-1">
                <span>Created</span>
                <SortIcon field="created_at" />
              </div>
            </TableHead>
            <TableHead className="text-crd-white w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCards.map((card) => (
            <TableRow key={card.id} className="border-crd-mediumGray hover:bg-crd-mediumGray/20">
              <TableCell>
                {card.thumbnail_url && (
                  <img 
                    src={card.thumbnail_url} 
                    alt={card.title}
                    className="w-8 h-11 object-cover rounded"
                  />
                )}
              </TableCell>
              <TableCell className="text-white font-medium">{card.title}</TableCell>
              <TableCell className="text-crd-lightGray max-w-xs">
                <div className="truncate">{card.description}</div>
              </TableCell>
              <TableCell>
                <Badge className={`${getRarityColor(card.rarity)} text-white`}>
                  {card.rarity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={card.is_public ? 'default' : 'secondary'}>
                  {card.is_public ? 'Public' : 'Private'}
                </Badge>
              </TableCell>
              <TableCell className="text-crd-lightGray text-sm">
                {new Date(card.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleVisibility(card.id, card.is_public)}
                    className="text-crd-lightGray hover:text-white h-8 w-8 p-0"
                  >
                    {card.is_public ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-white h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-crd-darkGray border-crd-mediumGray">
                      <DropdownMenuItem 
                        onClick={() => window.open(`/card/${card.id}`, '_blank')}
                        className="text-white hover:bg-crd-mediumGray"
                      >
                        View Card
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteCard(card.id)}
                        className="text-red-400 hover:bg-crd-mediumGray focus:text-red-400"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
