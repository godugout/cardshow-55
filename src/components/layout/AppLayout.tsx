import React from 'react';
import { MobileErrorBoundary } from '@/components/common/MobileErrorBoundary';
import { ResponsiveContainer } from '@/components/ui/design-system/ResponsiveContainer';
import { MobileNavigation } from './MobileNavigation';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  className = '',
  maxWidth = 'full'
}) => {
  const { isMobile } = useResponsiveLayout();

  return (
    <MobileErrorBoundary>
      <div className={`min-h-screen bg-crd-darkest ${className}`}>
        <ResponsiveContainer maxWidth={maxWidth}>
          <div className={isMobile ? 'pb-20' : 'pb-8'}>
            {children}
          </div>
        </ResponsiveContainer>
        <MobileNavigation />
      </div>
    </MobileErrorBoundary>
  );
};