
import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardCreationButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        "card-primary": "bg-crd-green text-black hover:bg-crd-green/90 font-semibold shadow-lg hover:shadow-xl",
        "card-secondary": "bg-editor-dark border-2 border-crd-mediumGray text-crd-lightGray hover:border-crd-green hover:text-white hover:bg-crd-green/10",
        "card-ghost": "text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20",
        "card-danger": "bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 hover:text-red-300",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "card-primary",
      size: "default",
    },
  }
);

export interface CardCreationButtonProps 
  extends Omit<ShadcnButtonProps, 'variant' | 'size'>, 
  VariantProps<typeof cardCreationButtonVariants> {
  icon?: React.ReactNode;
}

export const CardCreationButton = React.forwardRef<HTMLButtonElement, CardCreationButtonProps>(
  ({ className, variant, size, icon, children, asChild, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(cardCreationButtonVariants({ variant, size }), className)}
        ref={ref}
        asChild={asChild}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </ShadcnButton>
    );
  }
);

CardCreationButton.displayName = "CardCreationButton";
