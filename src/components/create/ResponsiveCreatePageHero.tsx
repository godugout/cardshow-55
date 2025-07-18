
import React from 'react';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { MobileCreateHero } from './MobileCreateHero';
import { DesktopCreateHero } from './DesktopCreateHero';
import { MobileStudioSection } from './MobileStudioSection';
import { ScrollableLayout } from '@/components/layout/ScrollableLayout';
import { ResponsiveSection } from '@/components/layout/ResponsiveSection';
import { EnhancedCreateHero } from './EnhancedCreateHero';
import { Create3DSection } from './Create3DSection';

export const ResponsiveCreatePageHero: React.FC = () => {
  const { isMobile, isShortScreen, deviceType } = useResponsiveBreakpoints();

  // Mobile: Always use mobile layout with sections
  if (isMobile) {
    return (
      <ScrollableLayout enableSnapScroll={true}>
        <ResponsiveSection snapScroll={true}>
          <MobileCreateHero />
        </ResponsiveSection>
        <ResponsiveSection snapScroll={true}>
          <MobileStudioSection />
        </ResponsiveSection>
      </ScrollableLayout>
    );
  }

  // Desktop with short screen: Use multi-section layout to prevent overlap
  if (isShortScreen) {
    return (
      <ScrollableLayout enableSnapScroll={true}>
        <ResponsiveSection id="hero-section" snapScroll={true}>
          <EnhancedCreateHero />
        </ResponsiveSection>
        <ResponsiveSection id="studio-section" snapScroll={true}>
          <Create3DSection />
        </ResponsiveSection>
      </ScrollableLayout>
    );
  }

  // Desktop with sufficient height: Use overlay layout
  return <DesktopCreateHero />;
};
