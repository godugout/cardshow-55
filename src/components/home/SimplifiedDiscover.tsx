import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CRDButton, Typography } from "@/components/ui/design-system";
import { useCards } from "@/hooks/useCards";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Star } from "lucide-react";

export const SimplifiedDiscover: React.FC = () => {
  const [featuredCategory, setFeaturedCategory] = useState("Trending");
  const { featuredCards, loading } = useCards();
  const navigate = useNavigate();

  const handleCardStudioOpen = (cardId: string | undefined) => {
    if (!cardId) return;
    navigate(`/studio/${cardId}`);
  };

  const categoryButtons = [
    "Trending",
    "Hottest",
    "Newest",
    "Top Rated",
    "Most Viewed",
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-crd-darkest to-crd-darker relative overflow-hidden">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-crd-blue/10 blur-2xl animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 20}vw`,
              height: `${Math.random() * 20 + 20}vw`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Typography
            variant="h2"
            className="text-crd-white font-bold mb-4 drop-shadow-md"
          >
            Discover Digital Collectibles
          </Typography>
          <Typography
            variant="body"
            className="text-crd-lightGray max-w-2xl mx-auto leading-relaxed"
          >
            Explore a curated selection of digital art, collectibles, and
            experiences from top creators around the globe.
          </Typography>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center space-x-4 mb-8">
          {categoryButtons.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-crd-lightGray hover:text-crd-white transition-colors duration-200 ${
                featuredCategory === category
                  ? "bg-crd-blue text-crd-white"
                  : "bg-crd-darkGray"
              }`}
              onClick={() => setFeaturedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="text-center text-crd-lightGray">Loading...</div>
          ) : featuredCards.length > 0 ? (
            featuredCards.map((card) => (
              <Card
                key={card.id}
                className="card-themed-modern hover-glow cursor-pointer"
                onClick={() => handleCardStudioOpen(card.id)}
              >
                <CardContent className="p-4">
                  <div className="relative">
                    <img
                      src={card.image_url}
                      alt={card.name}
                      className="rounded-md w-full h-48 object-cover mb-3"
                    />
                    {card.is_trending && (
                      <Badge className="absolute top-2 right-2 bg-crd-orange text-crd-darkest font-semibold">
                        Trending
                      </Badge>
                    )}
                  </div>
                  <Typography
                    variant="h4"
                    className="text-crd-white font-semibold mb-2"
                  >
                    {card.name}
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-crd-lightGray text-sm mb-3"
                  >
                    {card.description?.substring(0, 60)}...
                  </Typography>
                  <div className="flex justify-between items-center text-crd-lightGray text-xs">
                    <div className="flex items-center">
                      <Heart className="mr-1 h-4 w-4" /> {card.likes || 0}
                    </div>
                    <div className="flex items-center">
                      <Eye className="mr-1 h-4 w-4" /> {card.views || 0}
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4" /> {card.rating || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-crd-lightGray">
              No cards found in this category.
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 mt-16">
        <div className="text-center">
          <Link to="/collections/catalog">
            <CRDButton 
              variant="primary" 
              size="lg"
              className="px-8 py-4 rounded-[90px]"
            >
              Browse CRD Catalog
            </CRDButton>
          </Link>
        </div>
      </div>
    </section>
  );
};
