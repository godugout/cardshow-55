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
import { CRDButton } from './design-system/Button';

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
    <section className={cn("relative overflow-hidden bg-crd-darkest", className)} {...props}>
      {/* Main Content */}
      <div className="relative z-10">
        <div className="w-full pt-20 md:pt-24 lg:pt-32">
          <div className="flex w-full flex-col items-center text-center">
            {/* Caption */}
            {caption && (
              <div className="mb-2">
                <span className="tracking-[2px] text-xs font-medium text-center text-white/70 uppercase">
                  {caption}
                </span>
              </div>
            )}
            
            {/* Main Heading */}
            {heading && (
              <h1 className="text-[32px] md:text-[36px] lg:text-[40px] font-black leading-[38px] md:leading-[44px] lg:leading-[48px] tracking-[-0.4px] mt-2 text-center mb-4 text-white">
                <div className="whitespace-nowrap">Create, collect, and trade card art</div>
                <div>with stunning 3D effects</div>
              </h1>
            )}
            
            {/* Body Text */}
            {bodyText && (
              <p className="text-white/80 max-w-2xl text-center mb-8 leading-relaxed">
                {bodyText}
              </p>
            )}
            
            {/* CTA Button */}
            {ctaText && ctaLink && (
              <div className="mb-12">
                <CRDButton
                  variant="primary"
                  size="xl"
                  asChild
                >
                  <a href={ctaLink}>
                    {ctaText}
                  </a>
                </CRDButton>
              </div>
            )}
            
            {children}
          </div>
        </div>
      </div>

      {/* Featured Cards Carousel */}
      {showFeaturedCards && featuredCards && featuredCards.length > 0 && (
        <div className="w-screen mb-12 overflow-hidden">
          <div className="text-center mb-6">
            <h2 className="text-white text-2xl font-bold">Featured Creations</h2>
          </div>
          
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-crd-darkest to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-crd-darkest to-transparent z-10 pointer-events-none" />
            
            {/* Ticker Container */}
            <div className="flex animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
              {/* Multiple sets for seamless infinite scroll */}
              {Array.from({ length: 6 }).map((_, setIndex) => 
                featuredCards.map((card) => (
                  <div 
                    key={`set-${setIndex}-${card.id}`}
                    className="flex-shrink-0 w-48 mr-6 group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => onCardClick?.(card)}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl overflow-hidden relative">
                      <img
                        src={card.image_url || card.thumbnail_url || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white text-sm font-semibold mb-1 truncate">{card.title}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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