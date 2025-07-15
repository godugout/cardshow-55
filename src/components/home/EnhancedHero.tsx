import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StandardHero } from "@/components/shared/StandardHero";
import { useCards } from "@/hooks/useCards";
import { SecretMenu3D } from "@/components/hero/SecretMenu3D";
import { TextEffects3D, type TextEffectStyle, type TextAnimation } from "@/components/hero/TextEffects3D";
import { SparkleText } from "@/components/hero/SparkleText";
import { ThemedRansomNote } from "@/components/ui/ThemedRansomNote";
import { useSecretMenuDetection } from "@/hooks/useSecretMenuDetection";
import { Hero3 } from "@/components/ui/design-system";
import type { Tables } from '@/integrations/supabase/types';

// Use the database type directly
type DbCard = Tables<'cards'>;

export const EnhancedHero: React.FC = () => {
  const { cards, featuredCards, loading, fetchAllCardsFromDatabase } = useCards();
  const navigate = useNavigate();
  
  // Hero rotation state
  const [currentHero, setCurrentHero] = useState(0);
  
  // Secret menu state for text effects
  const [secretMenuOpen, setSecretMenuOpen] = useState(false);
  const [textStyle, setTextStyle] = useState<TextEffectStyle>('gradient');
  const [animation, setAnimation] = useState<TextAnimation>('glow');
  const [intensity, setIntensity] = useState(0.8);
  const [speed, setSpeed] = useState(1.5);
  const [glowEnabled, setGlowEnabled] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crd-secret-text-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setTextStyle(settings.textStyle || 'gradient');
        setAnimation(settings.animation || 'glow');
        setIntensity(settings.intensity || 0.8);
        setSpeed(settings.speed || 1.5);
        setGlowEnabled(settings.glowEnabled !== false);
      } catch (e) {
        console.log('Failed to load text settings');
      }
    }
  }, []);

  // Save preferences to localStorage
  const saveSettings = (newSettings: any) => {
    localStorage.setItem('crd-secret-text-settings', JSON.stringify(newSettings));
  };

  // Secret menu detection
  useSecretMenuDetection({
    onActivate: () => setSecretMenuOpen(true),
    isActive: secretMenuOpen
  });

  const handleTextStyleChange = (newStyle: TextEffectStyle) => {
    setTextStyle(newStyle);
    saveSettings({ textStyle: newStyle, animation, intensity, speed, glowEnabled });
  };

  const handleAnimationChange = (newAnimation: TextAnimation) => {
    setAnimation(newAnimation);
    saveSettings({ textStyle, animation: newAnimation, intensity, speed, glowEnabled });
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    saveSettings({ textStyle, animation, intensity: newIntensity, speed, glowEnabled });
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    saveSettings({ textStyle, animation, intensity, speed: newSpeed, glowEnabled });
  };

  const handleGlowChange = (enabled: boolean) => {
    setGlowEnabled(enabled);
    saveSettings({ textStyle, animation, intensity, speed, glowEnabled: enabled });
  };

  const handleReset = () => {
    const defaults = {
      textStyle: 'gradient' as TextEffectStyle,
      animation: 'glow' as TextAnimation,
      intensity: 0.8,
      speed: 1.5,
      glowEnabled: true
    };
    setTextStyle(defaults.textStyle);
    setAnimation(defaults.animation);
    setIntensity(defaults.intensity);
    setSpeed(defaults.speed);
    setGlowEnabled(defaults.glowEnabled);
    saveSettings(defaults);
  };

  // Hero rotation effect - switch every 12 seconds
  useEffect(() => {
    const heroRotationInterval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % 3);
    }, 12000);

    return () => clearInterval(heroRotationInterval);
  }, []);
  
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

  // Hero configurations
  const heroConfigs = [
    {
      theme: 'craft' as const,
      word: 'Craft',
      tagline: 'your vision into reality',
      label: 'THE FIRST PRINT & MINT DIGITAL CARD MARKET',
      description: 'Experience cards like never before with immersive 3D viewing, professional lighting, and visual effects that bring your art to life.',
      ctaText: 'Create your first CRD',
      ctaLink: '/create'
    },
    {
      theme: 'collect' as const,
      word: 'Collect',
      tagline: 'memories that last forever',
      label: 'DISCOVER RARE & VINTAGE DIGITAL TREASURES',
      description: 'Build your digital collection with unique cards from talented creators around the world. Every card tells a story worth preserving.',
      ctaText: 'Start collecting',
      ctaLink: '/discover'
    },
    {
      theme: 'connect' as const,
      word: 'Connect',
      tagline: 'with creators worldwide',
      label: 'JOIN THE GLOBAL CREATOR COMMUNITY',
      description: 'Network with artists, share your work, and collaborate on groundbreaking digital card projects in our vibrant creator ecosystem.',
      ctaText: 'Join community',
      ctaLink: '/community'
    }
  ];

  const currentConfig = heroConfigs[currentHero];

  // Create enhanced heading with responsive text wrapping control and consistent typography
  const enhancedHeading = (
    <div className="mb-4 leading-tight text-crd-white drop-shadow-lg text-5xl md:text-6xl lg:text-7xl">
      <ThemedRansomNote theme={currentConfig.theme}>{currentConfig.word}</ThemedRansomNote><br />
      <span className="xl:whitespace-nowrap text-6xl md:text-7xl lg:text-8xl">
        {currentConfig.tagline.split(' ').slice(0, -1).join(' ')}{' '}
        <span className="gradient-text-green-blue-purple">{currentConfig.tagline.split(' ').slice(-1)[0]}</span>
      </span>
    </div>
  );

  return (
    <div className="relative">
      {/* Hero content */}
      <StandardHero
        label={currentConfig.label}
        title={`${currentConfig.word} ${currentConfig.tagline}`}
        titleEffects={enhancedHeading}
        description={currentConfig.description}
        primaryCta={{
          text: currentConfig.ctaText,
          link: currentConfig.ctaLink
        }}
        heroVariant="hero"
      >
        {/* Featured Cards Section */}
        {showcaseCards.length > 0 && (
          <div className="mt-8">
            <Hero3
              caption=""
              heading=""
              bodyText=""
              ctaText=""
              ctaLink=""
              showFeaturedCards={true}
              featuredCards={showcaseCards}
              onCardClick={handleCardStudioOpen}
            />
          </div>
        )}
      </StandardHero>

      {/* Secret Menu */}
      <SecretMenu3D
        isOpen={secretMenuOpen}
        onClose={() => setSecretMenuOpen(false)}
        textStyle={textStyle}
        onTextStyleChange={handleTextStyleChange}
        animation={animation}
        onAnimationChange={handleAnimationChange}
        intensity={intensity}
        onIntensityChange={handleIntensityChange}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        glowEnabled={glowEnabled}
        onGlowChange={handleGlowChange}
        onReset={handleReset}
      />
    </div>
  );
};
