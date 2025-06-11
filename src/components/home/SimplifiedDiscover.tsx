
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useCards } from "@/hooks/useCards";
import { Skeleton } from "@/components/ui/skeleton";
import { useGalleryActions } from "@/pages/Gallery/hooks/useGalleryActions";
import { useCardConversion } from "@/pages/Gallery/hooks/useCardConversion";
import { ImmersiveCardViewer } from "@/components/viewer/ImmersiveCardViewer";
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly
type DbCard = Tables<'cards'>;

const FALLBACK_CARDS = [
  {
    id: 'fallback-1',
    title: "Mystic Dragon",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    creator: "ArtistOne"
  },
  {
    id: 'fallback-2',
    title: "Cyber Warrior",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
    creator: "DigitalMaster"
  },
  {
    id: 'fallback-3',
    title: "Forest Guardian",
    image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=400&q=80",
    creator: "NatureLover"
  },
  {
    id: 'fallback-4',
    title: "Space Explorer",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400&q=80",
    creator: "CosmicArt"
  },
  {
    id: 'fallback-5',
    title: "Ancient Rune",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80",
    creator: "RuneCaster"
  },
  {
    id: 'fallback-6',
    title: "Fire Phoenix",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80",
    creator: "FlameForge"
  }
];

export const SimplifiedDiscover: React.FC = () => {
  const { cards, loading } = useCards();
  const { selectedCardIndex, showImmersiveViewer, handleCardClick, handleCardChange, handleCloseViewer, handleShareCard, handleDownloadCard } = useGalleryActions();
  const { convertCardsToCardData } = useCardConversion();
  
  // Use real cards if available, otherwise use fallback
  const displayCards = cards && cards.length > 0 
    ? cards.slice(0, 6).map(card => ({
        id: card.id,
        title: card.title,
        image: card.image_url || card.thumbnail_url,
        creator: "Creator" // We'd get this from profiles later
      }))
    : FALLBACK_CARDS.slice(0, 6);

  // Convert cards to CardData format for the viewer
  const convertedCards = convertCardsToCardData(
    cards && cards.length > 0 ? cards.slice(0, 6) : []
  );

  const handleCardView = (card: any, index: number) => {
    if (cards && cards.length > 0) {
      // Real cards - use the gallery actions
      handleCardClick(cards[index], cards.slice(0, 6));
    } else {
      // Fallback cards - show a placeholder message or create a mock card
      console.log('Fallback card clicked:', card.title);
      // For now, just log - could create a demo viewer for fallback cards
    }
  };

  return (
    <>
      <div className="bg-[#141416] flex flex-col overflow-hidden pt-32 pb-16 px-4 md:px-8 lg:px-[352px] max-md:max-w-full">
        <div className="text-center mb-12">
          <Typography as="h2" variant="h1" className="mb-4">
            Discover Amazing Cards
          </Typography>
          <Typography variant="body" className="text-crd-lightGray text-lg max-w-2xl mx-auto">
            Explore stunning card art created by our community of talented artists and creators
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton className="w-full aspect-[3/4] rounded-xl bg-[#353945]" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="w-3/4 h-5 bg-[#353945]" />
                  <Skeleton className="w-1/2 h-4 bg-[#353945]" />
                </div>
              </div>
            ))
          ) : (
            displayCards.map((card, index) => (
              <div
                key={card.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => handleCardView(card, index)}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl overflow-hidden relative">
                  <img
                    src={card.image || FALLBACK_CARDS[index % FALLBACK_CARDS.length].image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Enhanced hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  {/* Click indicator */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  
                  {/* Enhanced action area */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <CRDButton size="sm" className="w-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {cards && cards.length > 0 ? 'View in 3D' : 'Demo Card'}
                    </CRDButton>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-crd-white font-semibold text-lg">{card.title}</h3>
                  <p className="text-crd-lightGray text-sm">by {card.creator}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center">
          <Link to="/gallery">
            <CRDButton 
              variant="secondary" 
              size="lg"
              className="px-8 py-4 rounded-[90px] mr-4"
            >
              Browse All Cards
            </CRDButton>
          </Link>
          <Link to="/editor">
            <CRDButton 
              variant="primary" 
              size="lg"
              className="px-8 py-4 rounded-[90px]"
            >
              Start Creating
            </CRDButton>
          </Link>
        </div>
      </div>

      {/* Immersive Viewer - Only show for real cards */}
      {showImmersiveViewer && convertedCards.length > 0 && (
        <ImmersiveCardViewer
          card={convertedCards[selectedCardIndex]}
          cards={convertedCards}
          currentCardIndex={selectedCardIndex}
          onCardChange={handleCardChange}
          isOpen={showImmersiveViewer}
          onClose={handleCloseViewer}
          onShare={() => handleShareCard(convertedCards)}
          onDownload={() => handleDownloadCard(convertedCards)}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </>
  );
};
