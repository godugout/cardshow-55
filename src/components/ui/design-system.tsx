import React from 'react';

// Re-export all design system components
export { CRDButton } from './design-system/Button';
export { CRDBadge } from './design-system/Badge';
export { Typography, Heading, AccentText } from './design-system/Typography';

// Additional components and placeholders
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Typography } from './design-system/Typography';

export interface CRDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CRDCard = React.forwardRef<HTMLDivElement, CRDCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card 
        ref={ref}
        className={cn("bg-crd-darkGray border-crd-mediumGray", className)}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

CRDCard.displayName = "CRDCard";

// CRD Input Component
export interface CRDInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: string; // Add variant prop to match existing usage
}

export const CRDInput = React.forwardRef<HTMLInputElement, CRDInputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Input 
        ref={ref}
        className={cn("bg-crd-darkGray border-crd-mediumGray text-crd-white", className)}
        {...props}
      />
    );
  }
);

CRDInput.displayName = "CRDInput";

// Hero3 Component - Enhanced Professional Layout
export interface Hero3Props {
  children?: React.ReactNode;
  className?: string;
  caption?: string;
  heading?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  showFeaturedCards?: boolean;
  featuredCards?: any[];
  onCardClick?: (card: any) => void;
  variant?: 'default' | 'minimal';
}

export const Hero3: React.FC<Hero3Props> = ({ 
  children, 
  className, 
  caption,
  heading,
  bodyText,
  ctaText,
  ctaLink,
  showFeaturedCards,
  featuredCards,
  onCardClick,
  variant = 'default',
  ...props 
}) => {
  return (
    <section className={cn("relative overflow-hidden bg-background", className)} {...props}>
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient-shift" />
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_hsl(var(--primary))_2px,_transparent_2px)] bg-[length:60px_60px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_hsl(var(--accent))_1px,_transparent_1px)] bg-[length:40px_40px]" />
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Caption */}
            {caption && (
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                  {caption}
                </span>
              </div>
            )}
            
            {/* Main Heading */}
            {heading && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  {heading.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < heading.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </h1>
            )}
            
            {/* Body Text */}
            {bodyText && (
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                {bodyText}
              </p>
            )}
            
            {/* CTA Button */}
            {ctaText && ctaLink && (
              <div className="mb-16">
                <a 
                  href={ctaLink} 
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10">{ctaText}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </a>
              </div>
            )}
            
            {children}
          </div>
        </div>
      </div>

      {/* Enhanced Featured Cards Carousel */}
      {showFeaturedCards && featuredCards && featuredCards.length > 0 && (
        <div className="relative z-10 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <Typography variant="h2" className="text-2xl md:text-3xl font-bold mb-4">
                Featured Creations
              </Typography>
              <p className="text-muted-foreground">Discover amazing card designs from our community</p>
            </div>
            
            <div className="relative overflow-hidden">
              {/* Enhanced Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />
              
              {/* 3D Card Carousel */}
              <div className="flex animate-[scroll_80s_linear_infinite] hover:[animation-play-state:paused] py-8">
                {/* First set of cards */}
                {featuredCards.map((card, index) => (
                  <div 
                    key={`first-${card.id}`}
                    className="flex-shrink-0 w-56 mr-8 group cursor-pointer perspective-1000"
                    onClick={() => onCardClick?.(card)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-y-12">
                      {/* Card Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-110" />
                      
                      {/* Main Card */}
                      <div className="relative aspect-[3/4] bg-card border border-border rounded-xl overflow-hidden shadow-2xl group-hover:shadow-primary/25 transition-all duration-500">
                        <img
                          src={card.image_url || card.thumbnail_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Holographic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white font-semibold mb-1 truncate">{card.title}</h3>
                            {card.rarity && (
                              <span className={cn(
                                "inline-block px-2 py-1 text-xs rounded-full font-medium",
                                card.rarity === 'legendary' && "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
                                card.rarity === 'rare' && "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                                card.rarity === 'uncommon' && "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                                card.rarity === 'common' && "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                              )}>
                                {card.rarity}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Rarity Border Glow */}
                        {card.rarity === 'legendary' && (
                          <div className="absolute inset-0 rounded-xl border-2 border-yellow-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                        )}
                        {card.rarity === 'rare' && (
                          <div className="absolute inset-0 rounded-xl border-2 border-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {featuredCards.map((card, index) => (
                  <div 
                    key={`second-${card.id}`}
                    className="flex-shrink-0 w-56 mr-8 group cursor-pointer perspective-1000"
                    onClick={() => onCardClick?.(card)}
                    style={{ animationDelay: `${(index + featuredCards.length) * 0.1}s` }}
                  >
                    <div className="relative transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:rotate-y-12">
                      {/* Card Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-110" />
                      
                      {/* Main Card */}
                      <div className="relative aspect-[3/4] bg-card border border-border rounded-xl overflow-hidden shadow-2xl group-hover:shadow-primary/25 transition-all duration-500">
                        <img
                          src={card.image_url || card.thumbnail_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Holographic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-white font-semibold mb-1 truncate">{card.title}</h3>
                            {card.rarity && (
                              <span className={cn(
                                "inline-block px-2 py-1 text-xs rounded-full font-medium",
                                card.rarity === 'legendary' && "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
                                card.rarity === 'rare' && "bg-purple-500/20 text-purple-300 border border-purple-500/30",
                                card.rarity === 'uncommon' && "bg-blue-500/20 text-blue-300 border border-blue-500/30",
                                card.rarity === 'common' && "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                              )}>
                                {card.rarity}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Rarity Border Glow */}
                        {card.rarity === 'legendary' && (
                          <div className="absolute inset-0 rounded-xl border-2 border-yellow-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                        )}
                        {card.rarity === 'rare' && (
                          <div className="absolute inset-0 rounded-xl border-2 border-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Filter Button Component - Enhanced to match existing usage
export interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  isActive?: boolean; // Add isActive as alias for active
  count?: number;
}

export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ className, active, isActive, count, children, ...props }, ref) => {
    const isButtonActive = active || isActive; // Support both prop names
    return (
      <Button
        ref={ref}
        variant={isButtonActive ? "default" : "outline"}
        size="sm"
        className={cn(
          "transition-all",
          isButtonActive && "bg-crd-blue text-white",
          className
        )}
        {...props}
      >
        {children}
        {count !== undefined && (
          <span className="ml-2 bg-crd-orange text-white text-xs px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </Button>
    );
  }
);

FilterButton.displayName = "FilterButton";

// Effect Card Component - Enhanced to match existing usage
export interface EffectCardProps {
  title: string;
  description?: string;
  active?: boolean;
  isActive?: boolean; // Add isActive as alias
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: string;
  emoji?: string;
  intensity?: number;
}

export const EffectCard: React.FC<EffectCardProps> = ({
  title,
  description,
  active,
  isActive,
  onClick,
  className,
  children,
  variant,
  emoji,
  intensity,
  ...props
}) => {
  const isCardActive = active || isActive;
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-lg",
        isCardActive && "border-crd-blue bg-crd-blue/10",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        {emoji && <span className="text-lg">{emoji}</span>}
        <h3 className="font-semibold text-crd-white">{title}</h3>
        {intensity !== undefined && (
          <span className="text-xs text-crd-lightGray ml-auto">
            {intensity}%
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-crd-lightGray">{description}</p>
      )}
      {children}
    </Card>
  );
};

// Preset Card Component - Enhanced to match existing usage
export interface PresetCardProps {
  title: string;
  preview?: React.ReactNode;
  onClick?: () => void;
  onSelect?: () => void; // Add onSelect as alias
  className?: string;
  emoji?: string;
  isSelected?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: string;
  styleColor?: any;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  title,
  preview,
  onClick,
  onSelect,
  className,
  emoji,
  isSelected,
  isLoading,
  isDisabled,
  size,
  styleColor,
  ...props
}) => {
  const handleClick = onClick || onSelect;
  
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-lg hover:border-crd-blue",
        isSelected && "border-crd-blue bg-crd-blue/10",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={isDisabled ? undefined : handleClick}
      {...props}
    >
      <div className="space-y-2">
        {preview}
        <div className="flex items-center gap-2">
          {emoji && <span className="text-lg">{emoji}</span>}
          <h3 className="text-sm font-semibold text-crd-white">{title}</h3>
          {isLoading && (
            <span className="ml-auto text-xs text-crd-lightGray">Loading...</span>
          )}
        </div>
      </div>
    </Card>
  );
};

// Collapsible Section Component - Enhanced to match existing usage
export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  emoji?: string;
  icon?: React.ComponentType<any>;
  statusText?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
  emoji,
  icon: Icon,
  statusText,
  isOpen: controlledOpen,
  onToggle,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!open);
    } else {
      setInternalOpen(!open);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={handleToggle} className={className} {...props}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-4 h-auto text-left"
        >
          <div className="flex items-center gap-2">
            {emoji && <span className="text-lg">{emoji}</span>}
            {Icon && <Icon className="w-4 h-4" />}
            <span className="font-semibold text-crd-white">{title}</span>
            {statusText && (
              <span className="text-xs text-crd-lightGray ml-2">{statusText}</span>
            )}
          </div>
          <span className={cn("transition-transform", open && "rotate-180")}>
            ▼
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

// Team Theme Showcase Component
export interface TeamThemeShowcaseProps {
  theme: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const TeamThemeShowcase: React.FC<TeamThemeShowcaseProps> = ({
  theme,
  isSelected = false,
  onSelect
}) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 cursor-pointer transition-all",
        isSelected ? "border-crd-blue" : "border-crd-mediumGray hover:border-crd-lightGray"
      )}
      onClick={onSelect}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-crd-white">{theme.name}</h3>
        <div className="flex space-x-1">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: theme.primary }}
          />
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: theme.secondary }}
          />
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: theme.accent }}
          />
        </div>
      </div>
    </div>
  );
};

// Palette Preview Component
export interface PalettePreviewProps {
  colors: string[];
  title?: string;
}

export const PalettePreview: React.FC<PalettePreviewProps> = ({
  colors,
  title
}) => {
  return (
    <div className="space-y-2">
      {title && <h4 className="text-xs font-medium text-crd-lightGray">{title}</h4>}
      <div className="flex space-x-1">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded border border-crd-mediumGray"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};