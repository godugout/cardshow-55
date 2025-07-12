
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const typographyVariants = cva(
  "font-dm-sans",
  {
    variants: {
      variant: {
        // CRD Design System typography scale
        display: "text-display text-crd-white mb-8",
        section: "text-section text-crd-white mb-6",
        'page-title': "text-page-title text-crd-white mb-4",
        component: "text-component text-crd-white mb-3",
        card: "text-card text-crd-white mb-2",
        'small-heading': "text-small-heading text-crd-white mb-2",
        'large-body': "text-large-body text-crd-white",
        body: "text-body text-crd-white",
        'small-body': "text-small-body text-crd-lightGray",
        caption: "text-caption text-crd-lightGray",
        button: "text-button text-crd-white font-extrabold",
        link: "text-link text-crd-blue font-medium hover:text-crd-orange transition-colors",
        label: "text-label text-crd-lightGray font-semibold uppercase tracking-wider",
        // Legacy variants for backward compatibility
        h1: "text-4xl font-bold text-crd-white mb-8",
        h2: "text-3xl font-bold text-crd-white mb-6", 
        h3: "text-2xl font-bold text-crd-white mb-4",
        h4: "text-xl font-semibold text-crd-white mb-3",
        accent: "text-crd-orange font-medium",
        muted: "text-crd-lightGray",
        code: "font-roboto-mono text-sm text-crd-lightGray bg-crd-darkGray px-1 py-0.5 rounded",
      },
    },
    defaultVariants: {
      variant: "body",
    },
  }
);

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as: Component = "p", ...props }, ref) => {
    return React.createElement(Component, {
      className: cn(typographyVariants({ variant, className })),
      ref,
      ...props
    });
  }
);

Typography.displayName = "Typography";

// Convenience components
export const Heading = ({ level = 1, children, className, ...props }: { 
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) => (
  <Typography
    as={`h${level}` as keyof JSX.IntrinsicElements}
    variant={`h${level}` as VariantProps<typeof typographyVariants>['variant']}
    className={className}
    {...props}
  >
    {children}
  </Typography>
);

export const AccentText = ({ children, className, ...props }: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) => (
  <Typography
    as="span"
    variant="accent"
    className={className}
    {...props}
  >
    {children}
  </Typography>
);
