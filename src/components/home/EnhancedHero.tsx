import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StandardHero } from "@/components/shared/StandardHero";
import { useCards } from "@/hooks/useCards";
import { SecretMenu3D } from "@/components/hero/SecretMenu3D";
import { TextEffects3D, type TextEffectStyle, type TextAnimation } from "@/components/hero/TextEffects3D";
import { SparkleText } from "@/components/hero/SparkleText";
import { ThemedRansomNote } from "@/components/ui/ThemedRansomNote";
import { useSecretMenuDetection } from "@/hooks/useSecretMenuDetection";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { Hero3 } from "@/components/ui/design-system";
import { Pause, Play, SkipBack, SkipForward, Settings } from "lucide-react";
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
  
  // Hero slideshow and animation controls
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Scroll trigger for label visibility
  const { targetRef: labelRef, isVisible: isLabelVisible } = useScrollTrigger({
    threshold: 0.5,
    rootMargin: '-50px 0px'
  });

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

  // Hero rotation effect - switch every 12 seconds (respects pause state)
  useEffect(() => {
    if (isPaused) return;
    
    const heroRotationInterval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % 3);
    }, 12000);

    return () => clearInterval(heroRotationInterval);
  }, [isPaused]);
  
  // Keyboard shortcuts for controls (Ctrl+Shift+H to show/hide controls)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        setShowControls(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Control handlers
  const handlePrevSlide = () => {
    setCurrentHero(prev => prev === 0 ? 2 : prev - 1);
  };
  
  const handleNextSlide = () => {
    setCurrentHero(prev => (prev + 1) % 3);
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
      ctaText: 'Join the Collective',
      ctaLink: '/community'
    }
  ];

  const currentConfig = heroConfigs[currentHero];

  // Dynamic gradient class based on current theme
  const getGradientClass = (theme: 'craft' | 'collect' | 'connect') => {
    switch (theme) {
      case 'craft':
        return 'gradient-text-craft';
      case 'collect':
        return 'gradient-text-collect';
      case 'connect':
        return 'gradient-text-connect';
      default:
        return 'gradient-text-green-blue-purple';
    }
  };

  // Create enhanced heading with responsive text wrapping control and consistent typography
  const enhancedHeading = (
    <div className="leading-tight text-crd-white drop-shadow-lg">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2">
        <ThemedRansomNote theme={currentConfig.theme} isPaused={isAnimationPaused || !isLabelVisible}>
          {currentConfig.word}
        </ThemedRansomNote>
      </div>
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="block sm:inline">
          {currentConfig.tagline.split(' ').slice(0, -1).join(' ')}{' '}
        </span>
        <span className={`${getGradientClass(currentConfig.theme)} block sm:inline`}>
          {currentConfig.tagline.split(' ').slice(-1)[0]}
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Hero content */}
      <StandardHero
        label={currentConfig.label}
        labelRef={labelRef}
        title={`${currentConfig.word} ${currentConfig.tagline}`}
        titleEffects={enhancedHeading}
        description={currentConfig.description}
        primaryCta={{
          text: currentConfig.ctaText,
          link: currentConfig.ctaLink,
          variant: currentConfig.theme === 'craft' ? 'create' : 
                   currentConfig.theme === 'connect' ? 'collective' : 
                   'collect'
        }}
      >
      </StandardHero>

      {/* Dedicated Featured Cards Section with proper spacing */}
      {showcaseCards.length > 0 && (
        <section className="py-8 sm:py-12 lg:py-16 bg-crd-darkest">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-crd-white mb-4">
                Featured Cards
              </h2>
              <p className="text-crd-lightGray text-base sm:text-lg max-w-2xl mx-auto">
                Discover amazing cards from our community
              </p>
            </div>
            
            <Hero3
              caption=""
              heading=""
              bodyText=""
              ctaText=""
              ctaLink=""
              showFeaturedCards={true}
              featuredCards={showcaseCards}
              onCardClick={handleCardStudioOpen}
              shouldStartAnimation={!isLabelVisible}
            />
          </div>
        </section>
      )}

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
      
      {/* Hidden Controls (Ctrl+Shift+H to toggle) */}
      {showControls && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-3 text-white text-sm">
            <span className="font-mono text-xs opacity-70">Hero Controls</span>
            
            {/* Slideshow Controls */}
            <div className="flex items-center gap-2 border-r border-white/20 pr-3">
              <button
                onClick={handlePrevSlide}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Previous slide"
              >
                <SkipBack size={16} />
              </button>
              
              <button
                onClick={() => setIsPaused(prev => !prev)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isPaused ? "Resume slideshow" : "Pause slideshow"}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              
              <button
                onClick={handleNextSlide}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Next slide"
              >
                <SkipForward size={16} />
              </button>
            </div>
            
            {/* Animation Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-70">Anim:</span>
              <button
                onClick={() => setIsAnimationPaused(prev => !prev)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isAnimationPaused ? "Resume animation" : "Pause animation"}
              >
                {isAnimationPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setShowControls(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors ml-2"
              title="Hide controls (Ctrl+Shift+H)"
            >
              <Settings size={16} />
            </button>
          </div>
          
          <div className="text-xs opacity-50 mt-2 font-mono">
            Current: {currentConfig.theme} ({currentHero + 1}/3)
          </div>
        </div>
      )}
    </div>
  );
};
