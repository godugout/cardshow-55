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

// Hero3 Component - Enhanced to match existing usage
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
  ...props 
}) => {
  return (
    <div className={cn("hero-section py-20 px-6", className)} {...props}>
      {caption && <p className="text-crd-lightGray mb-4">{caption}</p>}
      {heading && <h1 className="text-4xl font-bold text-crd-white mb-6">{heading}</h1>}
      {bodyText && <p className="text-crd-lightGray mb-8">{bodyText}</p>}
      {ctaText && ctaLink && (
        <a href={ctaLink} className="btn-themed-primary px-6 py-3 rounded-pill">
          {ctaText}
        </a>
      )}
      {children}
      {showFeaturedCards && featuredCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {featuredCards.map((card, index) => (
            <div 
              key={card?.id || index}
              className="group relative overflow-hidden rounded-2xl border-2 border-crd-mediumGray bg-crd-darkGray hover:border-crd-blue transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
              onClick={() => onCardClick?.(card)}
            >
              {/* Card Image */}
              <div className="aspect-[0.84] w-full overflow-hidden">
                {card?.image_url ? (
                  <img
                    src={card.image_url}
                    alt={card.title || 'Card'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 flex items-center justify-center">
                    <div className="text-crd-lightGray text-4xl">🎴</div>
                  </div>
                )}
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-crd-white font-semibold text-lg mb-2 truncate">
                  {card?.title || 'Untitled Card'}
                </h3>
                {card?.description && (
                  <p className="text-crd-lightGray text-sm line-clamp-2 mb-3">
                    {card.description}
                  </p>
                )}
                
                {/* Card Meta */}
                <div className="flex items-center justify-between text-xs text-crd-lightGray">
                  <span>{card?.rarity || 'Common'}</span>
                  {card?.view_count && (
                    <span>{card.view_count} views</span>
                  )}
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl mb-2">👁️</div>
                  <div className="text-sm font-medium">View Card</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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