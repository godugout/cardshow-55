import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Eye, Heart, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DiscoverCard {
  id: string;
  title: string;
  description: string;
  image_url: string;
  creator_id: string;
  rarity: string;
  favorite_count: number;
  view_count: number;
  created_at: string;
}

export const SimplifiedDiscover = () => {
  const [cards, setCards] = useState<DiscoverCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('featured');

  useEffect(() => {
    fetchCards();
  }, [activeFilter]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('cards')
        .select('*')
        .eq('is_public', true)
        .limit(12);

      switch (activeFilter) {
        case 'trending':
          query = query.order('favorite_count', { ascending: false });
          break;
        case 'new':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('view_count', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching cards:', error);
        return;
      }

      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'trending': return 'Trending';
      case 'new': return 'New';
      default: return 'Featured';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'text-yellow-400';
      case 'epic': return 'text-purple-400';
      case 'rare': return 'text-blue-400';
      case 'uncommon': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <section className="py-6 px-4 sm:py-8 sm:px-6 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-themed-primary mb-3 sm:mb-4">
              Cards Rendered Digitally<span className="text-gray-400 text-lg sm:text-xl lg:text-2xl align-super">™</span>
            </h2>
            <p className="text-themed-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Explore the latest cards from creators around the world
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="bg-themed-secondary/10 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 px-4 sm:py-8 sm:px-6 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-themed-primary mb-3 sm:mb-4">
            Cards Rendered Digitally<span className="text-gray-400 text-lg sm:text-xl lg:text-2xl align-super">™</span>
          </h2>
          <p className="text-themed-secondary text-base sm:text-lg max-w-2xl mx-auto px-2">
            Explore the latest cards from creators around the world
          </p>
        </div>

        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="tabs-themed inline-flex rounded-lg p-1 w-full max-w-sm sm:max-w-none sm:w-auto">
            {['featured', 'trending', 'new'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "flex-1 sm:flex-none py-3 px-4 sm:px-6 text-sm font-medium rounded-md transition-all duration-200 min-h-[44px] flex items-center justify-center",
                  activeFilter === filter 
                    ? "tab-themed-active" 
                    : "tab-themed-inactive"
                )}
              >
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid - More columns for smaller cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {cards.map((card) => (
            <Card key={card.id} className="card-themed group hover:scale-105 transition-all duration-300 max-w-[200px] mx-auto">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                {card.image_url ? (
                  <img 
                    src={card.image_url} 
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-themed-accent/20 to-themed-accent/5 flex items-center justify-center">
                    <div className="text-2xl opacity-50">🎨</div>
                  </div>
                )}
                
                {activeFilter === 'trending' && card.rarity === 'legendary' && (
                  <div className="absolute top-1 right-1 bg-yellow-500/90 text-black text-xs px-1.5 py-0.5 rounded-full font-medium">
                    🔥
                  </div>
                )}
              </div>

              <CardContent className="p-2 sm:p-3">
                <h3 className="font-bold text-themed-primary text-sm mb-1 line-clamp-1">
                  {card.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-themed-secondary mb-2">
                  <span className={`capitalize font-medium ${getRarityColor(card.rarity)}`}>
                    {card.rarity || 'Common'}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{card.favorite_count || 0}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="text-xs w-full h-7">
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-themed-secondary/5 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-themed-primary mb-2 sm:mb-3">
              Ready to explore more?
            </h3>
            <p className="text-themed-secondary mb-3 sm:mb-4 max-w-md mx-auto text-sm">
              Browse our complete catalog of cards and collections from creators worldwide.
            </p>
            <div className="flex justify-center">
              <Link to="/collections/catalog">
                <Button className="btn-themed-primary px-4 sm:px-6 py-2 text-sm sm:text-base min-h-[40px] w-full sm:w-auto">
                  Browse CRD Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
