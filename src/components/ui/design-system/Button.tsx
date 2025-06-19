
import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // CRD Design System variants with dark theme focus
        primary: "bg-crd-green text-black hover:bg-crd-green/90 font-semibold",
        secondary: "bg-crd-blue text-white hover:bg-crd-blue/90 font-semibold",
        outline: "bg-transparent border border-crd-green text-crd-green hover:bg-crd-green/10 hover:text-crd-green",
        ghost: "bg-transparent text-crd-green hover:bg-crd-green/10 hover:text-crd-green",
        "outline-blue": "bg-transparent border border-crd-blue text-crd-blue hover:bg-crd-blue/10 hover:text-crd-blue",
        "ghost-blue": "bg-transparent text-crd-blue hover:bg-crd-blue/10 hover:text-crd-blue",
        "outline-gray": "bg-transparent border border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-white",
        action: "p-3 rounded-full border-2 border-crd-mediumGray bg-transparent hover:bg-crd-mediumGray/10 text-crd-lightGray hover:text-white",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        // Legacy variants for compatibility
        default: "bg-crd-green text-black hover:bg-crd-green/90",
        link: "text-crd-green underline-offset-4 hover:underline",
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
      variant: "outline",
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
