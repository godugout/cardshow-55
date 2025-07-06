import React from 'react';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
};

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'full'
}) => {
  const { isMobile, isTablet, containerPadding } = useResponsiveLayout();

  const responsiveClasses = [
    maxWidthClasses[maxWidth],
    'mx-auto',
    containerPadding,
    isMobile ? 'space-y-4' : isTablet ? 'space-y-6' : 'space-y-8',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={responsiveClasses}>
      {children}
    </div>
  );
};