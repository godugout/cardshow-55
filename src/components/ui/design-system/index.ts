
// CRD Design System - Complete Component Library
export { CRDButton } from './Button';
export { CRDBadge } from './Badge';
export { ThemedLayout, ThemedPage, ThemedSection } from './ThemedLayout';
export { CRDInput } from './Input';
export { Typography, Heading, AccentText } from './Typography';
export { PresetCard } from './PresetCard';
export { FilterButton } from './FilterButton';
export { EffectCard } from './EffectCard';
export { CollapsibleSection } from './CollapsibleSection';
export { colors } from './colors';
export type { BrandColor, NeutralColor, ColorKey } from './colors';
export { PalettePreview } from './PalettePreview';
export { TeamThemeShowcase } from './TeamThemeShowcase';

// Layout Components
export { CRDContainer, CRDSection } from '../../layout/CRDContainer';

// Section Components  
export { HeroSection } from '../../sections/HeroSection';

// Navigation Components
export { Navigation } from '../../navigation/Navigation';

// Card Components
export { AuctionCard } from '../../cards/AuctionCard';

// CRD:DNA System exports
export { CRDDNABrowser } from '../../crd/CRDDNABrowser';
export { CRDLogo, MLBLogo, ClassicMLBLogo, UniformLogo, SketchLogo, CRDEntryCard } from '../../crd/CRDLogoComponent';

// CRD:DNA Logo Components
export { MLBBalOBSLogo } from '../../home/navbar/MLBBalOBSLogo';
export { MLBBosRBBLogo } from '../../home/navbar/MLBBosRBBLogo';
export { MLBPadres70sLogo } from '../../home/navbar/MLBPadres70sLogo';
export { MLBMariners80sLogo } from '../../home/navbar/MLBMariners80sLogo';
export { MLBAthletics00sLogo } from '../../home/navbar/MLBAthletics00sLogo';
export { CS3DWGBLogo } from '../../home/navbar/CS3DWGBLogo';
export { NCAABig10Logo } from '../../home/navbar/NCAABig10Logo';
export { CSSketchRBLogo } from '../../home/navbar/CSSketchRBLogo';
export { CSSketchRSLogo } from '../../home/navbar/CSSketchRSLogo';
export { CSOrigWSLogo } from '../../home/navbar/CSOrigWSLogo';

// Hero Components with larger cards
export const Hero3 = ({ 
  caption, 
  heading, 
  bodyText, 
  ctaText, 
  ctaLink, 
  showFeaturedCards = false, 
  featuredCards = [], 
  onCardClick = () => {} 
}: {
  caption?: string;
  heading?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  showFeaturedCards?: boolean;
  featuredCards?: any[];
  onCardClick?: (card: any) => void;
}) => {
  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Horizontal scrolling carousel with larger cards */}
      <div className="flex gap-6 animate-scroll-right">
        {/* Duplicate the cards array to create seamless loop */}
        {[...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-72 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => onCardClick(card)}
          >
            <div className="bg-crd-dark rounded-xl overflow-hidden shadow-lg border border-crd-mediumGray/20">
              <div className="aspect-[3/4] relative">
                {card.image_url || card.thumbnail_url ? (
                  <img 
                    src={card.image_url || card.thumbnail_url} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                    <div className="text-4xl opacity-50">🎨</div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-crd-white font-semibold truncate">{card.title}</h3>
                <p className="text-crd-lightGray text-sm mt-1">
                  {card.rarity ? `${card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)} Card` : 'Digital Card'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
