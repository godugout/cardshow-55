
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hero3 } from "@/components/ui/design-system";
import { useCards } from "@/hooks/useCards";
import { Animated3DBackground, type Animated3DVariant } from "@/components/hero/Animated3DBackground";
import { SecretMenu3D } from "@/components/hero/SecretMenu3D";
import { useSecretMenuDetection } from "@/hooks/useSecretMenuDetection";
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly
type DbCard = Tables<'cards'>;

export const EnhancedHero: React.FC = () => {
  const { cards, featuredCards, loading, fetchAllCardsFromDatabase } = useCards();
  const navigate = useNavigate();
  
  // Secret menu state
  const [secretMenuOpen, setSecretMenuOpen] = useState(false);
  const [variant, setVariant] = useState<Animated3DVariant>('panels');
  const [intensity, setIntensity] = useState(0.3);
  const [speed, setSpeed] = useState(1);
  const [mouseInteraction, setMouseInteraction] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crd-secret-3d-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setVariant(settings.variant || 'panels');
        setIntensity(settings.intensity || 0.3);
        setSpeed(settings.speed || 1);
        setMouseInteraction(settings.mouseInteraction !== false);
        setAutoRotate(settings.autoRotate || false);
      } catch (e) {
        console.log('Failed to load 3D settings');
      }
    }
  }, []);

  // Save preferences to localStorage
  const saveSettings = (newSettings: any) => {
    localStorage.setItem('crd-secret-3d-settings', JSON.stringify(newSettings));
  };

  // Secret menu detection
  useSecretMenuDetection({
    onActivate: () => setSecretMenuOpen(true),
    isActive: secretMenuOpen
  });

  const handleVariantChange = (newVariant: Animated3DVariant) => {
    setVariant(newVariant);
    saveSettings({ variant: newVariant, intensity, speed, mouseInteraction, autoRotate });
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    saveSettings({ variant, intensity: newIntensity, speed, mouseInteraction, autoRotate });
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    saveSettings({ variant, intensity, speed: newSpeed, mouseInteraction, autoRotate });
  };

  const handleMouseInteractionChange = (enabled: boolean) => {
    setMouseInteraction(enabled);
    saveSettings({ variant, intensity, speed, mouseInteraction: enabled, autoRotate });
  };

  const handleAutoRotateChange = (enabled: boolean) => {
    setAutoRotate(enabled);
    saveSettings({ variant, intensity, speed, mouseInteraction, autoRotate: enabled });
  };

  const handleReset = () => {
    const defaults = {
      variant: 'panels' as Animated3DVariant,
      intensity: 0.3,
      speed: 1,
      mouseInteraction: true,
      autoRotate: false
    };
    setVariant(defaults.variant);
    setIntensity(defaults.intensity);
    setSpeed(defaults.speed);
    setMouseInteraction(defaults.mouseInteraction);
    setAutoRotate(defaults.autoRotate);
    saveSettings(defaults);
  };
  
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
    <div className="relative">
      {/* 3D Background positioned behind text */}
      <div className="absolute inset-0 z-0">
        <Animated3DBackground 
          variant={variant}
          intensity={intensity}
          speed={speed}
          mouseInteraction={mouseInteraction}
          autoRotate={autoRotate}
        />
      </div>
      
      {/* Hero content with higher z-index */}
      <div className="relative z-10">
        <Hero3
          caption="THE FIRST PRINT & MINT DIGITAL CARD MARKET"
          heading={`Create, collect, and trade card art\nwith stunning 3D effects`}
          bodyText="Experience cards like never before with immersive 3D viewing, professional lighting, and visual effects that bring your art to life."
          ctaText="Create your first CRD"
          ctaLink="/create"
          showFeaturedCards={true}
          featuredCards={showcaseCards}
          onCardClick={handleCardStudioOpen}
        />
      </div>

      {/* Secret Menu */}
      <SecretMenu3D
        isOpen={secretMenuOpen}
        onClose={() => setSecretMenuOpen(false)}
        variant={variant}
        onVariantChange={handleVariantChange}
        intensity={intensity}
        onIntensityChange={handleIntensityChange}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        mouseInteraction={mouseInteraction}
        onMouseInteractionChange={handleMouseInteractionChange}
        autoRotate={autoRotate}
        onAutoRotateChange={handleAutoRotateChange}
        onReset={handleReset}
      />
    </div>
  );
};
