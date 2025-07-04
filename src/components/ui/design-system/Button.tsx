
import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Team spirit themed variants - transformative experience
        primary: "btn-themed-primary team-spirit-glow",
        secondary: "btn-themed-secondary team-spirit-glow",
        outline: "btn-themed-secondary",
        ghost: "btn-themed-ghost",
        action: "p-3 rounded-full btn-themed-secondary team-spirit-glow",
        // Fallback variants
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "accent-themed underline-offset-4 hover:underline hover:highlight-themed",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8", 
        icon: "h-10 w-10",
        "action-icon": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CRDButtonProps extends Omit<ShadcnButtonProps, 'variant' | 'size'>, VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
}

export const CRDButton = React.forwardRef<HTMLButtonElement, CRDButtonProps>(
  ({ className, variant, size, icon, children, asChild, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(buttonVariants({ variant, size }), className)}
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

CRDButton.displayName = "CRDButton";
