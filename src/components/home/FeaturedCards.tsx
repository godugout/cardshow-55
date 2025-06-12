
import React, { useState } from "react";
import { useCards } from "@/hooks/useCards";
import { Skeleton } from "@/components/ui/skeleton";
import { StandardCardItem } from "@/components/cards/StandardCardItem";
import { ImmersiveCardViewer } from "@/components/viewer/ImmersiveCardViewer";
import { useCardConversion } from "@/pages/Gallery/hooks/useCardConversion";

export const FeaturedCards: React.FC = () => {
  const { featuredCards, loading } = useCards();
  const [showViewer, setShowViewer] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const { convertCardsToCardData } = useCardConversion();

  const handleView3D = (card: any) => {
    setSelectedCard(card);
    setShowViewer(true);
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedCard(null);
  };

  const handleShare = () => {
    if (selectedCard && navigator.share) {
      navigator.share({
        title: selectedCard.title,
        text: selectedCard.description || 'Check out this card!',
        url: `${window.location.origin}/card/${selectedCard.id}`
      });
    }
  };

  const handleDownload = () => {
    console.log('Download card:', selectedCard?.id);
  };

  // Fallback data in case the API returns empty
  const fallbackCards = [
    {
      id: '1',
      title: "Magic Mushroom #3241",
      description: "A mystical card with magical properties",
      image_url: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/d8f82b9c8c741a51de3f5c8f0ec3bfb7a8ce2357?placeholderIfAbsent=true",
      rarity: "rare",
      tags: ["magic", "mystical"],
      visibility: "public",
      is_public: true,
      created_at: new Date().toISOString(),
      series: "Mystical Collection"
    },
    {
      id: '2',
      title: "Happy Robot 032",
      description: "A cheerful robotic companion card",
      image_url: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/f77e9a2f29b3d6ca3e2ef7eb58bb96f8f61ae2e3?placeholderIfAbsent=true",
      rarity: "uncommon",
      tags: ["robot", "tech"],
      visibility: "public",
      is_public: true,
      created_at: new Date().toISOString(),
      series: "Robot Collection"
    },
    {
      id: '3',
      title: "Happy Robot 024",
      description: "Another cheerful robotic companion",
      image_url: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/bbddb7b98ca0d36e27c86999c1ba359a0f28d302?placeholderIfAbsent=true",
      rarity: "common",
      tags: ["robot", "companion"],
      visibility: "public",
      is_public: true,
      created_at: new Date().toISOString(),
      series: "Robot Collection"
    },
    {
      id: '4',
      title: "Happy Robot 029",
      description: "The happiest robot in the collection",
      image_url: "https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/47ecad8cb0d55baf48a07b5a5ad0aec67e4ab9f9?placeholderIfAbsent=true",
      rarity: "epic",
      tags: ["robot", "happy"],
      visibility: "public",
      is_public: true,
      created_at: new Date().toISOString(),
      series: "Robot Collection"
    },
  ];

  // Use real data if available, otherwise fallback to mock data
  const displayCards = featuredCards.length > 0 ? featuredCards : fallbackCards;
  const convertedCards = convertCardsToCardData(displayCards);
  const currentCardIndex = selectedCard ? displayCards.findIndex(c => c.id === selectedCard.id) : 0;
  const convertedSelectedCard = selectedCard ? convertCardsToCardData([selectedCard])[0] : null;

  return (
    <div className="bg-[#141416] flex flex-col overflow-hidden pt-32 pb-12 px-[352px] max-md:max-w-full max-md:px-5">
      <div className="self-stretch flex w-full justify-between items-center gap-5 max-md:max-w-full max-md:flex-wrap">
        <div className="text-[#FCFCFD] text-2xl font-bold leading-8 tracking-[-0.24px] max-md:max-w-full">
          Featured cards
        </div>
        <div className="flex gap-2">
          <button className="flex gap-2.5 p-2 rounded-[40px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/a634456f2f665b93045f6a817c79159c94b55353?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Previous"
            />
          </button>
          <button className="flex gap-2.5 p-2 rounded-[40px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/383525dbc8a15dc754c80a44d3eb6153844d0aed?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-6"
              alt="Next"
            />
          </button>
        </div>
      </div>
      
      <div className="self-stretch flex flex-wrap w-full items-stretch justify-between gap-8 mt-10 max-md:max-w-full">
        {loading ? (
          // Loading state
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="w-[270px] h-[366px]">
              <Skeleton className="w-full h-[270px] rounded-t-2xl" />
              <div className="bg-[#23262F] p-5 rounded-b-2xl">
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          ))
        ) : (
          displayCards.map((card) => (
            <StandardCardItem
              key={card.id}
              card={card as any}
              onView3D={handleView3D}
              showPrivacyBadge={false}
              className="w-[270px]"
            />
          ))
        )}
      </div>

      {/* 3D Viewer Modal */}
      {showViewer && convertedSelectedCard && (
        <ImmersiveCardViewer
          card={convertedSelectedCard}
          cards={convertedCards}
          currentCardIndex={currentCardIndex}
          onCardChange={(index) => {
            setSelectedCard(displayCards[index]);
          }}
          isOpen={showViewer}
          onClose={handleCloseViewer}
          onShare={handleShare}
          onDownload={handleDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </div>
  );
};
