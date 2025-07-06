import React from 'react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4', 
  lg: 'gap-6'
};

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md'
}) => {
  const { isMobile, isTablet } = useResponsiveLayout();

  const getGridCols = () => {
    if (isMobile) return `grid-cols-${cols.mobile || 1}`;
    if (isTablet) return `grid-cols-${cols.tablet || 2}`;
    return `grid-cols-${cols.desktop || 3}`;
  };

  const gridClasses = [
    'grid',
    getGridCols(),
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};