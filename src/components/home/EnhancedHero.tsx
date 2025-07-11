
import React from "react";
import { useNavigate } from "react-router-dom";
import { Hero3 } from "@/components/ui/design-system";
import { useCards } from "@/hooks/useCards";
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly
type DbCard = Tables<'cards'>;

export const EnhancedHero: React.FC = () => {
  const { cards, featuredCards, loading, fetchAllCardsFromDatabase } = useCards();
  const navigate = useNavigate();
  
  // Use all cards if available, otherwise featured cards for ticker carousel
  const allCards = cards.length > 0 ? cards : featuredCards;
  const showcaseCards = allCards.length > 0 ? allCards : [];

  // Fetch all cards for the ticker on mount
  React.useEffect(() => {
    if (allCards.length === 0) {
      fetchAllCardsFromDatabase();
    }
  }, [fetchAllCardsFromDatabase, allCards.length]);

  // Make cards clickable, no immersive preview
  const handleCardStudioOpen = (card: DbCard) => {
    if (!card?.id) return;
    navigate(`/studio/${card.id}`);
  };

  return (
    <Hero3
      caption="THE FIRST PRINT & MINT DIGITAL CARD MARKET"
      heading={`Create, collect, and trade card art\nwith stunning 3D effects`}
      bodyText="Experience cards like never before with immersive 3D viewing, professional lighting, and visual effects that bring your art to life."
      ctaText="Create Your First Card"
      ctaLink="/create"
      showFeaturedCards={true}
      featuredCards={showcaseCards}
      onCardClick={handleCardStudioOpen}
    />
  );
};
