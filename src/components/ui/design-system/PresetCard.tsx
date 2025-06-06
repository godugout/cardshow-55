
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const presetCardVariants = cva(
  "relative overflow-hidden rounded-lg border-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-crd-green/50",
  {
    variants: {
      variant: {
        default: "border-editor-border hover:border-crd-green/50 hover:bg-white/5",
        selected: "border-crd-green bg-crd-green/10 shadow-lg shadow-crd-green/20",
        loading: "border-crd-green/50 bg-crd-green/5",
      },
      size: {
        sm: "p-3",
        default: "p-3",
        lg: "p-4",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PresetCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof presetCardVariants> {
  title: string;
  description?: string;
  category?: string;
  icon?: React.ComponentType<any>;
  emoji?: string;
  isSelected?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  badge?: string;
  tooltipContent?: React.ReactNode;
  onSelect?: () => void;
}

export const PresetCard = React.forwardRef<HTMLButtonElement, PresetCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    description, 
    category, 
    icon: Icon, 
    emoji, 
    isSelected = false, 
    isLoading = false, 
    isDisabled = false,
    badge,
    tooltipContent,
    onSelect,
    onClick,
    ...props 
  }, ref) => {
    const cardVariant = isSelected ? 'selected' : isLoading ? 'loading' : 'default';
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onSelect) onSelect();
      if (onClick) onClick(e);
    };
    
    const CardContent = (
      <Button
        onClick={handleClick}
        disabled={isDisabled || isLoading}
        variant="ghost"
        className={cn(
          presetCardVariants({ variant: cardVariant, size }),
          "w-full h-auto text-left p-0 min-h-[70px]",
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Status Indicators */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-crd-green rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-black" />
          </div>
        )}
        
        {isLoading && (
          <div className="absolute top-2 left-2">
            <Loader2 className="w-3 h-3 text-crd-green animate-spin" />
          </div>
        )}

        {/* Improved Layout: Icon and Label in separate areas, both left-aligned */}
        <div className="w-full">
          {/* Icon Section - Left Aligned */}
          <div className="flex justify-start mb-2">
            {emoji && (
              <span className="text-xl" role="img" aria-label={title}>
                {emoji}
              </span>
            )}
          </div>
          
          {/* Label Section - Left Aligned */}
          <div className="text-left">
            <span className={cn(
              "font-medium text-sm block",
              isSelected ? "text-white" : "text-crd-lightGray"
            )}>
              {title}
            </span>
            {badge && (
              <span className="text-xs text-crd-green mt-1 block">
                {badge}
              </span>
            )}
          </div>
        </div>
      </Button>
    );

    if (tooltipContent) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {CardContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-black border-crd-mediumGray text-white max-w-64 z-50">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      );
    }

    return CardContent;
  }
);

PresetCard.displayName = "PresetCard";
