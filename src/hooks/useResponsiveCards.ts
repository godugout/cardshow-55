
import { useState, useEffect, useMemo } from 'react';
import { useResponsiveLayout } from './useResponsiveLayout';
import type { CardViewMode, CardFilterOptions } from '@/components/cards/types/cardTypes';
import { Card } from '@/types/card';

export const useResponsiveCards = (cards: Card[]) => {
  const { isMobile, windowSize } = useResponsiveLayout();
  const [viewMode, setViewMode] = useState<CardViewMode>({
    mode: 'preview',
    size: 'md',
    layout: 'grid'
  });
  const [filters, setFilters] = useState<CardFilterOptions>({
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Adjust view mode based on screen size
  useEffect(() => {
    if (isMobile) {
      setViewMode(prev => ({
        ...prev,
        mode: windowSize.width < 480 ? 'thumbnail' : 'preview',
        size: windowSize.width < 480 ? 'sm' : 'md',
        layout: 'grid'
      }));
    } else {
      setViewMode(prev => ({
        ...prev,
        mode: 'preview',
        size: 'md',
        layout: windowSize.width > 1200 ? 'masonry' : 'grid'
      }));
    }
  }, [isMobile, windowSize]);

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = [...cards];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(query) ||
        card.description?.toLowerCase().includes(query) ||
        card.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Rarity filter
    if (filters.rarity && filters.rarity.length > 0) {
      filtered = filtered.filter(card => 
        filters.rarity!.includes(card.rarity)
      );
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(card => 
        card.card_type && filters.type!.includes(card.card_type)
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(card =>
        card.tags?.some(tag => filters.tags!.includes(tag))
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(card => {
        const price = card.price || 0;
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }

    // Date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(card => {
        const cardDate = new Date(card.created_at);
        return cardDate >= filters.dateRange!.start && cardDate <= filters.dateRange!.end;
      });
    }

    // Sort cards
    filtered.sort((a, b) => {
      const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'created_at':
          return multiplier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        case 'updated_at':
          const aUpdated = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const bUpdated = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return multiplier * (aUpdated - bUpdated);
        case 'price':
          return multiplier * ((a.price || 0) - (b.price || 0));
        case 'rarity':
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
          return multiplier * (rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
        case 'popularity':
          return multiplier * ((a.view_count || 0) - (b.view_count || 0));
        default:
          return 0;
      }
    });

    return filtered;
  }, [cards, searchQuery, filters]);

  // Calculate grid columns based on screen size
  const gridColumns = useMemo(() => {
    if (isMobile) {
      return windowSize.width < 480 ? 2 : 3;
    }
    
    const cardWidth = viewMode.size === 'sm' ? 200 : viewMode.size === 'md' ? 280 : 320;
    const containerWidth = windowSize.width - 64; // Account for padding
    const gap = 24;
    
    return Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
  }, [isMobile, windowSize.width, viewMode.size]);

  return {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    filteredCards,
    gridColumns,
    totalCards: cards.length,
    filteredCount: filteredCards.length
  };
};
